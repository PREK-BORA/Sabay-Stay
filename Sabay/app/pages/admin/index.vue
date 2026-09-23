<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  collection,
  onSnapshot,
  type Firestore
} from 'firebase/firestore'
import { definePageMeta, useNuxtApp } from '#imports'
import { useAuth } from '~/composables/auth/useAuth'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { user } = useAuth()

interface BookingItem {
  id: string
  bookingDate: string
  customerName: string
  customerAvatar?: string
  customerEmail?: string
  persons: string
  phone: string
  checkIn: string
  checkOut: string
  paymentStatus: string
}

const totalRevenueAmount = ref<number>(0)
const loadingRevenue = ref<boolean>(true)

const totalRooms = ref<number>(0)
const occupiedRooms = ref<number>(0)
const totalBookings = ref<number>(0)
const totalHotels = ref<number>(0)

const firebaseBookings = ref<BookingItem[]>([])
const loadingBookings = ref<boolean>(true)
const firebaseError = ref<string>('')

const searchQuery = ref<string>('')

const monthlyOccupancyData = ref<number[]>(new Array(12).fill(0))
const monthLabels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']

let stopBookingsListener = () => {}
let stopRoomsListener = () => {}
let stopHotelsListener = () => {}

const normalizeStatus = (value?: unknown) => String(value ?? '').trim().toLowerCase()

const availableRooms = computed(() => Math.max(0, totalRooms.value - occupiedRooms.value))

const formattedRevenue = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(totalRevenueAmount.value)
})

const filteredBookings = computed(() => {
  if (!searchQuery.value.trim()) return firebaseBookings.value
  const query = searchQuery.value.toLowerCase().trim()
  return firebaseBookings.value.filter((item) => {
    return (
      item.customerName.toLowerCase().includes(query) ||
      (item.customerEmail && item.customerEmail.toLowerCase().includes(query)) ||
      item.phone.toLowerCase().includes(query) ||
      item.paymentStatus.toLowerCase().includes(query)
    )
  })
})

const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}

// Fixed parseDate to reliably prioritize booking/check-in dates
const parseDate = (data: any): Date => {
  const dateVal = 
    data?.checkIn || 
    data?.checkInDate || 
    data?.createdAt || 
    data?.created_at || 
    data?.date || 
    data?.timestamp || 
    data?.updatedAt

  if (!dateVal) return new Date()
  if (typeof dateVal.toDate === 'function') return dateVal.toDate()
  
  // Handle "YYYY-MM-DD" string formats directly
  const parsed = new Date(dateVal)
  return isNaN(parsed.getTime()) ? new Date() : parsed
}

const formatDateString = (dateInput: any): string => {
  const d = parseDate({ checkIn: dateInput })
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

const formatDateTimeString = (dateInput: any): string => {
  const d = parseDate({ checkIn: dateInput })
  const dateStr = formatDateString(d)
  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12
  return `${dateStr} • ${hours}:${minutes}${ampm}`
}

const getCustomMonthIndex = (date: Date): number => {
  const m = date.getMonth()
  const mapping: Record<number, number> = {
    4: 0,  // May
    5: 1,  // Jun
    6: 2,  // Jul
    7: 3,  // Aug
    8: 4,  // Sep
    9: 5,  // Oct
    10: 6, // Nov
    11: 7, // Dec
    0: 8,  // Jan
    1: 9,  // Feb
    2: 10, // Mar
    3: 11  // Apr
  }
  return mapping[m] ?? 0
}

const watchFirebaseData = () => {
  loadingRevenue.value = true
  loadingBookings.value = true
  firebaseError.value = ''
  const db = getDb()
  if (!db) {
    firebaseError.value = 'Firebase is not configured.'
    loadingRevenue.value = false
    loadingBookings.value = false
    return
  }

  stopBookingsListener()
  stopRoomsListener()
  stopHotelsListener()

  stopHotelsListener = onSnapshot(collection(db, 'hotels'), (hotelsSnapshot) => {
    totalHotels.value = hotelsSnapshot.size
  }, (error) => {
    console.error('Hotels snapshot error:', error)
    firebaseError.value = 'Hotels could not be loaded from Firebase.'
  })

  stopRoomsListener = onSnapshot(collection(db, 'rooms'), (roomsSnapshot) => {
    totalRooms.value = roomsSnapshot.size
    occupiedRooms.value = roomsSnapshot.docs.filter((item) => {
      const status = normalizeStatus(item.data().status)
      return ['occupied', 'maintenance'].includes(status)
    }).length
  }, (error) => {
    console.error('Rooms snapshot error:', error)
    firebaseError.value = 'Rooms could not be loaded from Firebase.'
  })

  stopBookingsListener = onSnapshot(collection(db, 'bookings'), (bookingsSnapshot) => {
    totalBookings.value = bookingsSnapshot.size
    let sumRevenue = 0
    const monthlyBookingsCount = new Array(12).fill(0)
    const mappedBookings: BookingItem[] = []

    bookingsSnapshot.docs.forEach((docSnap) => {
      const data = docSnap.data() as any
      const status = normalizeStatus(data.status)
      const isPaid = ['paid', 'confirmed', 'completed', 'check-in', 'check-out', 'received'].includes(status)
      const price = Number(data.totalPrice ?? data.total ?? data.amount ?? data.price ?? 0)

      if (isPaid) sumRevenue += price

      // Track monthly count based on check-in date
      const bookingDate = parseDate(data)
      const idx = getCustomMonthIndex(bookingDate)
      
      // Only count confirmed/paid bookings towards graph occupancy
      if (isPaid) {
        monthlyBookingsCount[idx] = (monthlyBookingsCount[idx] || 0) + 1
      }

      const adults = data.adults ?? data.guestsCount ?? data.guests ?? 2
      const children = data.children ?? data.kids ?? 0

      mappedBookings.push({
        id: docSnap.id,
        bookingDate: formatDateString(data.createdAt || data.date || data.bookedAt),
        customerName: data.customerName || data.name || data.fullName || data.guestName || 'Valued Guest',
        customerAvatar: data.avatar || data.photoURL || data.image || data.profileImage || data.photo,
        customerEmail: data.email || data.customerEmail,
        persons: children > 0 ? `${adults} Adults, ${children} Child${children > 1 ? 's' : ''}` : `${adults} Adults`,
        phone: data.phone || data.phoneNumber || data.contact || '+855 12 345 678',
        checkIn: formatDateTimeString(data.checkIn || data.checkInDate),
        checkOut: formatDateTimeString(data.checkOut || data.checkOutDate),
        paymentStatus: isPaid ? 'Received' : (data.paymentStatus || 'Pending')
      })
    })

    totalRevenueAmount.value = sumRevenue
    firebaseBookings.value = mappedBookings

    // Calculate chart percentage based on active total rooms
    monthlyOccupancyData.value = monthlyBookingsCount.map((count) => {
      const totalAvailable = Math.max(totalRooms.value, 1)
      const rate = Math.round((count / totalAvailable) * 100)
      return Math.min(100, rate)
    })

    loadingRevenue.value = false
    loadingBookings.value = false
  }, (error) => {
    console.error('Bookings snapshot error:', error)
    firebaseError.value = 'Bookings could not be loaded from Firebase.'
    loadingRevenue.value = false
    loadingBookings.value = false
  })
}

const barColors = [
  'bg-blue-600', 'bg-teal-500', 'bg-[#1b1947]', 'bg-indigo-600', 
  'bg-teal-600', 'bg-sky-600', 'bg-blue-500', 'bg-emerald-600', 
  'bg-indigo-500', 'bg-[#1b1947]', 'bg-teal-500', 'bg-sky-500'
]

onMounted(() => {
  watchFirebaseData()
})

onUnmounted(() => {
  stopBookingsListener()
  stopRoomsListener()
  stopHotelsListener()
})

const stats = computed(() => [
  {
    title: 'TOTAL REVENUE',
    value: loadingRevenue.value ? 'Loading...' : formattedRevenue.value,
    change: 'Live Firestore',
    changeColor: 'text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full w-fit font-medium text-xs',
    iconBg: 'bg-[#1b1947] text-white',
    iconPath: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  {
    title: 'TOTAL BOOKINGS',
    value: totalBookings.value.toString(),
    change: 'Live reservations',
    changeColor: 'text-[#1b1947] bg-indigo-50 px-2.5 py-0.5 rounded-full w-fit font-medium text-xs',
    iconBg: 'bg-teal-600 text-white',
    iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  
  {
    title: 'TOTAL HOTELS',
    value: totalHotels.value.toString(),
    change: 'Active properties',
    changeColor: 'text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full w-fit font-medium text-xs',
    iconBg: 'bg-amber-600 text-white',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
  },
  {
    title: 'TOTAL ROOMS',
    value: `${totalRooms.value}`,
    change: `${occupiedRooms.value} Occ / ${availableRooms.value} Avail`,
    changeColor: 'text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full w-fit font-medium text-xs',
    iconBg: 'bg-blue-600 text-white',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
  }
])
</script>

<template>
  <div class="space-y-6 font-sans w-full pb-12 text-slate-800">
    <!-- Top Banner with Search -->
    <div class="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">
          Dashboard
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Here is your hotel property overview and real-time statistics.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div class="relative w-full sm:w-72">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search booking data..."
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1b1947] focus:bg-white transition"
          />
        </div>

        <div class="flex items-center gap-2.5 bg-emerald-50 border border-emerald-300 px-4 py-2 rounded-xl w-fit shadow-sm shrink-0">
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-xs font-semibold text-emerald-800">System Online</span>
        </div>
      </div>
    </div>

    <!-- Promo Banner Row -->
    <div class="bg-linear-to-r from-[#1b1947] to-indigo-900 rounded-xl p-4 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="bg-white/20 text-white text-xs px-2.5 py-1 rounded-md font-semibold">★ Live Sync</span>
        <span class="text-sm font-medium">Connected securely to Firebase Firestore.</span>
      </div>
      <span class="text-xs font-semibold bg-black/20 px-3 py-1.5 rounded-lg text-indigo-200">SabayStay Admin Engine</span>
    </div>

    <div v-if="firebaseError" class="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800" role="alert">
      {{ firebaseError }}
    </div>

    <!-- Stat Cards Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <div 
    v-for="stat in stats" 
    :key="stat.title" 
    class="border border-slate-300 rounded-2xl p-6 flex items-center justify-between bg-white shadow-sm hover:border-slate-400 transition-all duration-200"
  >
    <div class="space-y-1.5">
      <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">{{ stat.title }}</span>
      <h3 class="text-3xl font-bold text-slate-900 tracking-tight">{{ stat.value }}</h3>
      <div class="pt-1">
        <span :class="[stat.changeColor]" class="inline-block">{{ stat.change }}</span>
      </div>
    </div>
    <div :class="stat.iconBg" class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-indigo-900">
      <svg class="w-7 h-7 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" :d="stat.iconPath" />
      </svg>
    </div>
  </div>
</div>

    <!-- Occupancy Rate Bar Chart Box -->
    <div class="border border-slate-300 rounded-2xl p-6 bg-white shadow-sm space-y-6">
      <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 class="font-bold text-slate-900 text-lg">Occupancy Rate Overview</h3>
          <p class="text-xs text-slate-500 mt-0.5">Monthly property occupancy percentage based on live Firebase collections</p>
        </div>
        <span class="text-xs font-semibold bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg w-fit border border-slate-300">May - Apr</span>
      </div>

      <!-- Chart Graphics Area -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-300">
        <div class="flex h-64 items-end pt-4 relative px-2">
          <!-- Left Axis Percentage -->
          <div class="flex flex-col justify-between h-full text-[10px] font-semibold text-slate-400 pr-4 border-r border-slate-300 shrink-0 text-right">
            <span>100%</span><span>80%</span><span>60%</span><span>40%</span><span>20%</span><span>0%</span>
          </div>

          <!-- Vertical Grid Lines & Bars Container -->
          <div class="relative flex-1 h-full flex items-end justify-around pl-4">
            <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div v-for="n in 6" :key="n" class="border-b border-slate-200 w-full"></div>
            </div>

            <!-- Individual Bars -->
            <div v-for="(rate, idx) in monthlyOccupancyData" :key="idx" class="relative z-10 flex flex-col items-center group h-full justify-end w-8 sm:w-12">
              <!-- Tooltip Hover Rate -->
              <div class="absolute -top-8 bg-slate-900 text-white border border-slate-700 text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                {{ rate }}%
              </div>
              <div 
                class="w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110 shadow-sm" 
                :class="barColors[idx % barColors.length]"
                :style="{ height: rate > 0 ? `${rate}%` : '4px' }"
              ></div>
              <span class="text-[11px] font-medium text-slate-600 absolute -bottom-7">{{ monthLabels[idx] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Details Table Box -->
    <div class="border border-slate-300 rounded-2xl bg-white shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 class="font-bold text-slate-900 text-lg">Booking Details</h3>
          <p class="text-xs text-slate-500 mt-0.5">Live customer reservations fetched directly from your Firebase bookings collection.</p>
        </div>
        <span class="text-xs font-semibold bg-slate-50 text-slate-700 px-3 py-2 rounded-xl border border-slate-300">
          Showing Records: {{ filteredBookings.length }} / {{ firebaseBookings.length }}
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-300 text-slate-600 font-semibold text-xs uppercase tracking-wider">
              <th class="py-3.5 px-6">Booking Date</th>
              <th class="py-3.5 px-6">Customer</th>
              <th class="py-3.5 px-6">Persons</th>
              <th class="py-3.5 px-6">Phone</th>
              <th class="py-3.5 px-6">Check-in</th>
              <th class="py-3.5 px-6">Check-out</th>
              <th class="py-3.5 px-6 text-center">Payment</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="item in filteredBookings" :key="item.id" class="text-slate-700 hover:bg-slate-50/80 transition-colors">
              <td class="py-4 px-6 font-semibold text-slate-900 text-xs">{{ item.bookingDate }}</td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-300">
                    <img 
                      v-if="item.customerAvatar" 
                      :src="item.customerAvatar" 
                      alt="Customer Avatar" 
                      class="w-full h-full object-cover" 
                    />
                    <span v-else class="text-xs font-bold text-[#1b1947] uppercase">
                      {{ item.customerName.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900 text-sm">{{ item.customerName }}</p>
                    <p v-if="item.customerEmail" class="text-slate-500 text-xs">{{ item.customerEmail }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 text-slate-600 text-xs">{{ item.persons }}</td>
              <td class="py-4 px-6 text-[#1b1947] font-medium text-xs">{{ item.phone }}</td>
              <td class="py-4 px-6 whitespace-pre-line text-slate-600 text-xs">{{ item.checkIn }}</td>
              <td class="py-4 px-6 whitespace-pre-line text-slate-600 text-xs">{{ item.checkOut }}</td>
              <td class="py-4 px-6 text-center">
                <span 
                  :class="[
                    ['received', 'paid', 'confirmed'].includes(normalizeStatus(item.paymentStatus))
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  ]"
                  class="px-3 py-1 rounded-full text-xs font-semibold inline-block text-center shadow-2xs"
                >
                  {{ item.paymentStatus }}
                </span>
              </td>
            </tr>

            <tr v-if="loadingBookings">
              <td colspan="7" class="py-16 text-center text-slate-500 text-xs font-medium">
                <div class="inline-flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full border-2 border-[#1b1947] border-t-transparent animate-spin"></div>
                  Loading Firebase booking records...
                </div>
              </td>
            </tr>

            <tr v-if="!loadingBookings && filteredBookings.length === 0">
              <td colspan="7" class="py-16 text-center text-slate-400 text-xs font-medium">
                No matching booking records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>