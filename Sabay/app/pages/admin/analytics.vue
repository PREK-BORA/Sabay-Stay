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

const rawRevenue = ref<number>(0)
const totalBookingsCount = ref<number>(0)
const approvedUsersCount = ref<number>(0)
const loadingMetrics = ref<boolean>(true)

const monthlyRevenueData = ref<number[]>(new Array(12).fill(0))
const monthlyUsersData = ref<number[]>(new Array(12).fill(0))
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}

const parseDate = (data: any): Date => {
  const dateVal = data?.createdAt || data?.created_at || data?.date || data?.timestamp || data?.updatedAt || data?.joinedDate
  if (!dateVal) return new Date()
  if (typeof dateVal.toDate === 'function') return dateVal.toDate()
  const parsed = new Date(dateVal)
  return isNaN(parsed.getTime()) ? new Date() : parsed
}

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

    // 1. Fetch Bookings
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('status', 'in', ['Confirmed', 'Check-in', 'Check-out', 'paid', 'completed', 'Approved', 'pending'])
    )
    const bookingsSnap = await getDocs(bookingsQuery)

    let sumRevenue = 0
    totalBookingsCount.value = bookingsSnap.size

    bookingsSnap.forEach((docSnap) => {
      const data = docSnap.data() as any
      const price = Number(data?.totalPrice ?? data?.amount ?? data?.price ?? data?.total ?? 0)
      sumRevenue += price

      const date = parseDate(data)
      const monthIndex = date.getMonth()
      if (monthIndex >= 0 && monthIndex < 12) {
        revenueBuckets[monthIndex] = (revenueBuckets[monthIndex] || 0) + price
      }
    })
    rawRevenue.value = sumRevenue
    monthlyRevenueData.value = revenueBuckets

    // 2. Fetch Users & Owners from Firestore
    let activeCount = 0
    const processUserDocs = (snapshot: any) => {
      snapshot.forEach((docSnap: any) => {
        const data = docSnap.data() as any
        
        // Exclude admin if role is explicitly admin
        if (data?.role === 'admin') return

        activeCount++
        const date = parseDate(data)
        const monthIndex = date.getMonth()
        if (monthIndex >= 0 && monthIndex < 12) {
          userBuckets[monthIndex] = (userBuckets[monthIndex] || 0) + 1
        }
      })
    }

    // Try fetching from 'users' collection (most common in web apps)
    try {
      const usersSnap = await getDocs(collection(db, 'users'))
      processUserDocs(usersSnap)
    } catch (e) {
      // Fallback to 'user' if 'users' doesn't exist
      try {
        const userSnap = await getDocs(collection(db, 'user'))
        processUserDocs(userSnap)
      } catch (err) {}
    }

    // Try fetching from 'owner' collection if applicable
    try {
      const ownersSnap = await getDocs(collection(db, 'owner'))
      processUserDocs(ownersSnap)
    } catch (e) {}

    approvedUsersCount.value = activeCount
    monthlyUsersData.value = userBuckets

  } catch (error) {
    console.error('Error fetching analytics metrics:', error)
  } finally {
    loadingMetrics.value = false
  }
}

const conversionRate = computed(() => {
  if (approvedUsersCount.value === 0) return '0.0%'
  const rate = (totalBookingsCount.value / approvedUsersCount.value) * 100
  return rate.toFixed(1) + '%'
})

const formattedRevenue = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(rawRevenue.value)
})

const maxRevenueValue = computed(() => Math.max(...monthlyRevenueData.value, 100))
const maxUserValue = computed(() => Math.max(...monthlyUsersData.value, 10))

const generateSmoothPath = (data: number[], maxValue: number): string => {
  if (!data || data.length === 0) return ''
  const width = 500
  const height = 200
  const points = data.map((val, i) => {
    const x = (i / Math.max(1, data.length - 1)) * width
    const safeVal = val || 0
    const y = height - (safeVal / maxValue) * (height - 20) - 10
    return { x, y }
  })

  const firstPoint = points[0]
  if (!firstPoint) return ''

  let path = `M ${firstPoint.x} ${firstPoint.y}`
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i]
    const next = points[i + 1]
    if (!current || !next) continue
    const xc = (current.x + next.x) / 2
    const yc = (current.y + next.y) / 2
    path += ` Q ${current.x} ${current.y}, ${xc} ${yc}`
  }
  const last = points[points.length - 1]
  if (last) {
    path += ` L ${last.x} ${last.y}`
  }
  return path
}

const generateAreaPath = (data: number[], maxValue: number): string => {
  const linePath = generateSmoothPath(data, maxValue)
  if (!linePath) return ''
  const width = 500
  const height = 200
  return `${linePath} L ${width} ${height} L 0 ${height} Z`
}

const revenueLinePath = computed(() => generateSmoothPath(monthlyRevenueData.value, maxRevenueValue.value))
const revenueAreaPath = computed(() => generateAreaPath(monthlyRevenueData.value, maxRevenueValue.value))

const userLinePath = computed(() => generateSmoothPath(monthlyUsersData.value, maxUserValue.value))
const userAreaPath = computed(() => generateAreaPath(monthlyUsersData.value, maxUserValue.value))

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
    <div class="space-y-6 max-w-7xl mx-auto pb-12 text-slate-200">
      <!-- Header Section -->
      <div class="bg-[#1a1c23] rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Reports & Analytics</h1>
          <p class="text-sm text-slate-400 mt-1">Real-time revenue, booking performance, and registered user growth.</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="fetchAnalytics"
            class="px-4 py-2.5 bg-[#121318] hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            🔄 Refresh Data
          </button>
          <button 
            @click="exportReport"
            class="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md cursor-pointer"
          >
            📥 Export Full Report
          </button>
        </div>
      </div>

      <!-- Metrics Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-[#1a1c23] p-5 rounded-2xl border border-slate-800 shadow-md">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</p>
          <p class="text-2xl font-bold text-white mt-2">{{ loadingMetrics ? '...' : formattedRevenue }}</p>
          <p class="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">↗ Real-time Firestore Sync</p>
        </div>

        <div class="bg-[#1a1c23] p-5 rounded-2xl border border-slate-800 shadow-md">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Bookings</p>
          <p class="text-2xl font-bold text-white mt-2">{{ loadingMetrics ? '...' : totalBookingsCount }}</p>
          <p class="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">↗ Verified Reservations</p>
        </div>

        <div class="bg-[#1a1c23] p-5 rounded-2xl border border-slate-800 shadow-md">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Guests</p>
          <p class="text-2xl font-bold text-white mt-2">{{ loadingMetrics ? '...' : approvedUsersCount }}</p>
          <p class="text-xs text-amber-400 mt-2 font-medium flex items-center gap-1">👥 Accepted User Accounts</p>
        </div>

        <div class="bg-[#1a1c23] p-5 rounded-2xl border border-slate-800 shadow-md">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Conversion Rate</p>
          <p class="text-2xl font-bold text-white mt-2">{{ loadingMetrics ? '...' : conversionRate }}</p>
          <p class="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">↗ Bookings / Total Guests</p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Overview Chart -->
        <div class="bg-[#1a1c23] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-bold text-white">Revenue Overview</h2>
            <span class="text-xs font-semibold bg-[#121318] text-slate-300 border border-slate-700/80 px-3 py-1 rounded-xl">2026</span>
          </div>
          <div v-if="!loadingMetrics" class="relative h-64 w-full flex flex-col justify-end pt-4">
            <svg viewBox="0 0 500 200" class="w-full h-52 overflow-visible">
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35" />
                  <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="0" x2="500" y2="0" stroke="#222530" stroke-width="1" />
              <line x1="0" y1="65" x2="500" y2="65" stroke="#222530" stroke-width="1" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#222530" stroke-width="1" />
              <line x1="0" y1="200" x2="500" y2="200" stroke="#333842" stroke-width="1" />

              <path :d="revenueAreaPath" fill="url(#revenueGradient)" />
              <path :d="revenueLinePath" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" />
            </svg>
            <div class="flex justify-between text-[10px] text-slate-400 mt-2 px-1 font-medium">
              <span v-for="label in monthLabels" :key="label">{{ label }}</span>
            </div>
          </div>
          <div v-else class="h-64 flex items-center justify-center text-slate-500 text-xs">Loading graph...</div>
        </div>

        <!-- User Acquisition Chart -->
        <div class="bg-[#1a1c23] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-bold text-white">User Acquisition</h2>
            <span class="text-xs font-semibold bg-[#121318] text-slate-300 border border-slate-700/80 px-3 py-1 rounded-xl">Monthly</span>
          </div>
          <div v-if="!loadingMetrics" class="relative h-64 w-full flex flex-col justify-end pt-4">
            <svg viewBox="0 0 500 200" class="w-full h-52 overflow-visible">
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10b981" stop-opacity="0.35" />
                  <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="0" x2="500" y2="0" stroke="#222530" stroke-width="1" />
              <line x1="0" y1="65" x2="500" y2="65" stroke="#222530" stroke-width="1" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#222530" stroke-width="1" />
              <line x1="0" y1="200" x2="500" y2="200" stroke="#333842" stroke-width="1" />

              <path :d="userAreaPath" fill="url(#userGradient)" />
              <path :d="userLinePath" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" />
            </svg>
            <div class="flex justify-between text-[10px] text-slate-400 mt-2 px-1 font-medium">
              <span v-for="label in monthLabels" :key="label">{{ label }}</span>
            </div>
          </div>
          <div v-else class="h-64 flex items-center justify-center text-slate-500 text-xs">Loading graph...</div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>