<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  collection, 
  getDocs,
  doc, 
  updateDoc, 
  query, 
  where,
  serverTimestamp,
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

interface PendingUser {
  id: string
  name?: string
  fullName?: string
  email: string
  role?: string
  status: 'Pending' | 'Approved' | 'Rejected'
  createdAt?: any
}

const pendingUsers = ref<PendingUser[]>([])
const loadingUsers = ref<boolean>(true)
const totalRevenueAmount = ref<number>(0)
const loadingRevenue = ref<boolean>(true)

const totalRooms = ref<number>(0)
const occupiedRooms = ref<number>(0)
const totalBookings = ref<number>(0)
let stopBookingsListener = () => {}
let stopRoomsListener = () => {}

const availableRooms = computed(() => Math.max(0, totalRooms.value - occupiedRooms.value))
const occupancyRate = computed(() => {
  if (totalRooms.value === 0) return '0.0%'
  return ((occupiedRooms.value / totalRooms.value) * 100).toFixed(1) + '%'
})

const formattedRevenue = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(totalRevenueAmount.value)
})

const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}

const fetchTotalRevenue = async () => {
  loadingRevenue.value = true
  const db = getDb()
  if (!db) {
    loadingRevenue.value = false
    return
  }

  try {
    stopBookingsListener = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      totalBookings.value = snapshot.size
      totalRevenueAmount.value = snapshot.docs.reduce((sum, docSnap) => {
        const data = docSnap.data()
        const status = String(data.status || '').toLowerCase()
        return ['paid', 'confirmed', 'completed', 'check-in', 'check-out'].includes(status)
          ? sum + Number(data.totalPrice || data.total || data.amount || data.price || 0)
          : sum
      }, 0)
      loadingRevenue.value = false
    }, () => { loadingRevenue.value = false })
  } catch (error) {
    console.error('Error calculating total revenue:', error)
  } finally {
    loadingRevenue.value = false
  }
}

const watchRooms = () => {
  const db = getDb()
  if (!db) return
  stopRoomsListener = onSnapshot(collection(db, 'rooms'), (snapshot) => {
    totalRooms.value = snapshot.size
    occupiedRooms.value = snapshot.docs.filter((item) => ['occupied', 'maintenance'].includes(String(item.data().status || '').toLowerCase())).length
  })
}

const fetchPendingUsers = async () => {
  loadingUsers.value = true
  const db = getDb()
  if (!db) {
    loadingUsers.value = false
    return
  }

  try {
    const q = query(collection(db, 'user'), where('status', '==', 'Pending'))
    const querySnapshot = await getDocs(q)
    const list: PendingUser[] = []
    
    querySnapshot.forEach((docSnap) => {
      list.push({
        id: docSnap.id,
        ...docSnap.data()
      } as PendingUser)
    })
    
    pendingUsers.value = list
  } catch (error) {
    console.error('Error fetching pending users:', error)
  } finally {
    loadingUsers.value = false
  }
}

const acceptUser = async (userId: string) => {
  const db = getDb()
  if (!db) return

  try {
    const userRef = doc(db, 'user', userId)
    await updateDoc(userRef, {
      status: 'Approved',
      approvedAt: serverTimestamp()
    })
    await fetchPendingUsers()
  } catch (error) {
    console.error('Error accepting user:', error)
  }
}

const rejectUser = async (userId: string) => {
  const db = getDb()
  if (!db) return

  try {
    const userRef = doc(db, 'user', userId)
    await updateDoc(userRef, {
      status: 'Rejected',
      rejectedAt: serverTimestamp()
    })
    await fetchPendingUsers()
  } catch (error) {
    console.error('Error rejecting user:', error)
  }
}

onMounted(() => {
  fetchPendingUsers()
  fetchTotalRevenue()
  watchRooms()
})

onUnmounted(() => {
  stopBookingsListener()
  stopRoomsListener()
})

const stats = computed(() => [
  {
    title: 'TOTAL REVENUE',
    value: loadingRevenue.value ? 'Loading...' : formattedRevenue.value,
    change: 'Live Firestore Data',
    changeColor: 'text-emerald-600',
    iconPath: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-600'
  },
  {
    title: 'PENDING APPROVALS',
    value: pendingUsers.value.length.toString(),
    change: 'Requires Admin Action',
    changeColor: 'text-amber-600',
    iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600'
  },
  {
    title: 'TOTAL BOOKINGS',
    value: totalBookings.value.toString(),
    change: 'Live guest reservations',
    changeColor: 'text-indigo-600',
    iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600'
  },
  {
    title: 'TOTAL ROOMS',
    value: `${totalRooms.value}`,
    change: `${occupiedRooms.value} Occupied / ${availableRooms.value} Avail`,
    changeColor: 'text-indigo-600',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600'
  },
  {
    title: 'OCCUPANCY RATE',
    value: occupancyRate.value,
    change: 'Real-time property metric',
    changeColor: 'text-emerald-600',
    iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600'
  }
])
</script>

<template>
  <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8 font-sans">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Welcome back, {{ user?.name || user?.email || 'Administrator' }}
        </h1>
        <p class="text-xs text-slate-500 mt-1 font-medium">
          Here is your hotel property overview and pending user approval requests.
        </p>
      </div>
      <div class="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/60 w-fit">
        <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
        <span class="text-xs font-semibold text-slate-700">System Online</span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div 
        v-for="stat in stats" 
        :key="stat.title" 
        class="border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between bg-white shadow-sm"
      >
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{{ stat.title }}</span>
          <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ stat.value }}</h3>
          <p :class="[stat.changeColor]" class="text-xs font-semibold mt-1">{{ stat.change }}</p>
        </div>
        <div :class="[stat.bgColor, stat.textColor]" class="w-12 h-12 rounded-2xl flex items-center justify-center">
          <svg class="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" :d="stat.iconPath" />
          </svg>
        </div>
      </div>
    </div>

    <div class="border border-slate-200/80 rounded-2xl p-6 bg-white shadow-sm space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-900 text-base">Pending User Approval Requests</h3>
          <p class="text-xs text-slate-500 mt-1">Review user account sign-ups and accept or reject their system access.</p>
        </div>
        <button 
          @click="fetchPendingUsers"
          class="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
        >
          Refresh List
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <th class="pb-3">User Details</th>
              <th class="pb-3">Requested Role</th>
              <th class="pb-3">Status</th>
              <th class="pb-3 text-right">Acceptance Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in pendingUsers" :key="item.id" class="text-slate-700 hover:bg-slate-50/50 transition-colors">
              <td class="py-3.5">
                <p class="font-bold text-slate-900">{{ item.name || item.fullName || 'N/A' }}</p>
                <p class="text-slate-400 text-[11px]">{{ item.email }}</p>
              </td>
              <td class="py-3.5 font-semibold text-slate-700">
                {{ item.role || 'User' }}
              </td>
              <td class="py-3.5">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-3.5 text-right space-x-2">
                <button
                  @click="acceptUser(item.id)"
                  class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Accept User
                </button>
                <button
                  @click="rejectUser(item.id)"
                  class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-semibold transition-colors"
                >
                  Reject
                </button>
              </td>
            </tr>

            <tr v-if="loadingUsers">
              <td colspan="4" class="py-8 text-center text-slate-400">
                Loading pending user requests...
              </td>
            </tr>

            <tr v-if="!loadingUsers && pendingUsers.length === 0">
              <td colspan="4" class="py-8 text-center text-slate-400">
                No pending user requests to accept right now.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
