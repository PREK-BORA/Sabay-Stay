<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  type Firestore 
} from 'firebase/firestore'
import { definePageMeta, useNuxtApp } from '#imports'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// Dynamic Metrics State
const rawRevenue = ref<number>(0)
const totalBookingsCount = ref<number>(0)
const approvedUsersCount = ref<number>(0)
const loadingMetrics = ref<boolean>(true)

// Chart Datasets
const monthlyRevenueData = ref<number[]>(new Array(12).fill(0))
const monthlyUsersData = ref<number[]>(new Array(12).fill(0))
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Helper to retrieve Firestore instance
const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}

// Helper to safely parse ANY Date format (Timestamp, String ISO, or Fallback to Today)
const parseDate = (dateVal: any): Date => {
  if (!dateVal) return new Date() // Fallback ទៅថ្ងៃនេះ ប្រសិនបើគ្មាន Field createdAt
  if (typeof dateVal.toDate === 'function') return dateVal.toDate() // Firestore Timestamp
  const parsed = new Date(dateVal) // String (ISO 8601)
  return isNaN(parsed.getTime()) ? new Date() : parsed
}

// Fetch dynamic analytics from Firestore collections
const fetchAnalytics = async () => {
  loadingMetrics.value = true
  const db = getDb()
  if (!db) {
    loadingMetrics.value = false
    return
  }

  try {
    const revenueBuckets = new Array(12).fill(0)
    const userBuckets = new Array(12).fill(0)

    // 1. Calculate Gross Revenue & Completed Bookings
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('status', 'in', ['Confirmed', 'Check-in', 'Check-out'])
    )
    const bookingsSnap = await getDocs(bookingsQuery)

    let sumRevenue = 0
    totalBookingsCount.value = bookingsSnap.size

    bookingsSnap.forEach((docSnap) => {
      const data = docSnap.data()
      const price = Number(data.totalPrice ?? data.amount ?? data.price ?? 0)
      sumRevenue += price

      // Convert Date safely
      const date = parseDate(data.createdAt)
      const monthIndex = date.getMonth()
      if (monthIndex >= 0 && monthIndex < 12) {
        revenueBuckets[monthIndex] += price
      }
    })
    rawRevenue.value = sumRevenue
    monthlyRevenueData.value = revenueBuckets

    // 2. Fetch Active Users
    const usersSnap = await getDocs(collection(db, 'user'))
    let activeCount = 0

    usersSnap.forEach((docSnap) => {
      const data = docSnap.data()
      const isApprovedOrActive = !data.status || ['Approved', 'Active'].includes(data.status)
      
      if (isApprovedOrActive && data.role !== 'admin') {
        activeCount++

        // Convert Date safely
        const date = parseDate(data.createdAt)
        const monthIndex = date.getMonth()
        if (monthIndex >= 0 && monthIndex < 12) {
          userBuckets[monthIndex] += 1
        }
      }
    })
    approvedUsersCount.value = activeCount
    monthlyUsersData.value = userBuckets

  } catch (error) {
    console.error('Error fetching analytics metrics:', error)
  } finally {
    loadingMetrics.value = false
  }
}

// Dynamic Conversion Rate
const conversionRate = computed(() => {
  if (approvedUsersCount.value === 0) return '0.0%'
  const rate = (totalBookingsCount.value / approvedUsersCount.value) * 100
  return rate.toFixed(1) + '%'
})

// Currency Formatter
const formattedRevenue = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(rawRevenue.value)
})

const revenueChartBars = computed(() =>
  monthLabels.map((label, index) => ({
    label,
    value: monthlyRevenueData.value[index] || 0
  }))
)

const userChartBars = computed(() =>
  monthLabels.map((label, index) => ({
    label,
    value: monthlyUsersData.value[index] || 0
  }))
)

const maxRevenueValue = computed(() => Math.max(...monthlyRevenueData.value, 1))
const maxUserValue = computed(() => Math.max(...monthlyUsersData.value, 1))

// Export CSV Report
const exportReport = () => {
  const csvContent = [
    ['Metric', 'Value'],
    ['Gross Revenue', `$${rawRevenue.value}`],
    ['Completed Bookings', totalBookingsCount.value],
    ['Active Guests', approvedUsersCount.value],
    ['Conversion Rate', conversionRate.value]
  ].map(e => e.join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', `SabayStay_Analytics_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  fetchAnalytics()
})
</script>

<template>
  <ClientOnly>
    <div class="space-y-8 font-sans">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold text-slate-900">Reports & Analytics</h1>
          <p class="text-slate-500 text-sm mt-1">Real-time revenue, booking performance, and registered user growth.</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="fetchAnalytics"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            🔄 Refresh Data
          </button>
          <button 
            @click="exportReport"
            class="px-4 py-2 bg-indigo-900 text-white text-sm font-medium rounded-xl hover:bg-indigo-800 transition-colors shadow-sm cursor-pointer"
          >
            📥 Export Full Report
          </button>
        </div>
      </div>

      <!-- Dynamic Analytics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">
            {{ loadingMetrics ? '...' : formattedRevenue }}
          </p>
          <p class="text-xs text-emerald-600 mt-2 font-medium">↗ Real-time Firestore Sync</p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Bookings</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">
            {{ loadingMetrics ? '...' : totalBookingsCount }}
          </p>
          <p class="text-xs text-emerald-600 mt-2 font-medium">↗ Verified Reservations</p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Guests</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">
            {{ loadingMetrics ? '...' : approvedUsersCount }}
          </p>
          <p class="text-xs text-indigo-600 mt-2 font-medium">👥 Accepted User Accounts</p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conversion Rate</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">
            {{ loadingMetrics ? '...' : conversionRate }}
          </p>
          <p class="text-xs text-emerald-600 mt-2 font-medium">↗ Bookings / Total Guests</p>
        </div>
      </div>

      <!-- Charts Area -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-slate-900">Revenue Overview</h2>
            <span class="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">2026</span>
          </div>
          <div v-if="!loadingMetrics" class="h-64 flex items-end gap-2 pt-4">
            <div v-for="bar in revenueChartBars" :key="bar.label" class="flex-1 flex flex-col items-center justify-end gap-2">
              <div class="w-full rounded-t-xl bg-linear-to-t from-indigo-600 to-indigo-300" :style="{ height: `${Math.max((bar.value / maxRevenueValue) * 100, 8)}%` }"></div>
              <span class="text-[10px] text-slate-500">{{ bar.label.slice(0, 3) }}</span>
            </div>
          </div>
          <div v-else class="h-64 flex items-center justify-center text-slate-400 text-sm">Loading graph...</div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-slate-900">User Acquisition</h2>
            <span class="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">Monthly</span>
          </div>
          <div v-if="!loadingMetrics" class="h-64 flex items-end gap-2 pt-4">
            <div v-for="bar in userChartBars" :key="bar.label" class="flex-1 flex flex-col items-center justify-end gap-2">
              <div class="w-full rounded-t-xl bg-linear-to-t from-sky-500 to-blue-300" :style="{ height: `${Math.max((bar.value / maxUserValue) * 100, 8)}%` }"></div>
              <span class="text-[10px] text-slate-500">{{ bar.label.slice(0, 3) }}</span>
            </div>
          </div>
          <div v-else class="h-64 flex items-center justify-center text-slate-400 text-sm">Loading graph...</div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
