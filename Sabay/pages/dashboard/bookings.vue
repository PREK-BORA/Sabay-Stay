<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  collection, 
  doc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where,
  type Firestore 
} from 'firebase/firestore'
import { definePageMeta, useNuxtApp } from '#imports'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'user',
  middleware: 'auth'
})

export interface Booking {
  id: string
  ref?: string
  hotelName?: string
  title?: string
  location?: string
  guestName?: string
  checkIn?: string
  checkOut?: string
  totalPrice?: number
  price?: number
  status: 'Pending' | 'Confirmed' | 'Check-in' | 'Check-out' | 'Cancelled'
}

const bookings = ref<Booking[]>([])
const { user } = useAuth()
const activeTab = ref<'Active' | 'Completed' | 'Cancelled'>('Active')
const loading = ref<boolean>(true)

const activeStatuses = ['Pending', 'Confirmed', 'Check-in'] as const
const completedStatuses = ['Check-out'] as const

let unsubscribe: (() => void) | null = null


const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}


const initFirestoreListener = () => {
  loading.value = true
  const db = getDb()

  if (!db) {
    loading.value = false
    return
  }

  try {
    if (!user.value?.id) {
      bookings.value = []
      loading.value = false
      return
    }

    const q = query(collection(db, 'bookings'), where('userId', '==', user.value.id))
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Booking[] = []
        snapshot.forEach((docSnap) => {
          list.push({
            id: docSnap.id,
            ...docSnap.data()
          } as Booking)
        })
        bookings.value = list
        loading.value = false
      },
      (error) => {
        console.error('Firestore snapshot listener error:', error)
        loading.value = false
      }
    )
  } catch (error) {
    console.error('Error binding Firestore listener:', error)
    loading.value = false
  }
}


const filteredBookings = computed<Booking[]>(() => {
  const currentList = bookings.value || []

  if (activeTab.value === 'Active') {
    return currentList.filter(b => activeStatuses.includes(b?.status as typeof activeStatuses[number]))
  }

  if (activeTab.value === 'Completed') {
    return currentList.filter(b => completedStatuses.includes(b?.status as typeof completedStatuses[number]))
  }

  return currentList.filter(b => b?.status === 'Cancelled')
})


const cancelBooking = async (id: string) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return

  const db = getDb()
  if (!db) return

  try {
    const bookingRef = doc(db, 'bookings', id)
    await updateDoc(bookingRef, { status: 'Cancelled' })
  } catch (error) {
    console.error('Error cancelling booking:', error)
  }
}

onMounted(() => {
  initFirestoreListener()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<template>
  <div class="space-y-6 font-sans">
    
 
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-serif font-bold text-[#1a2b4c] uppercase tracking-wider">
          My Bookings
        </h1>
        <p class="text-slate-500 text-xs sm:text-sm mt-1">
          Manage your upcoming stays and review past experiences.
        </p>
      </div>

     
      <div class="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold w-fit">
        <button 
          v-for="tab in (['Active', 'Completed', 'Cancelled'] as const)" 
          :key="tab"
          @click="activeTab = tab"
          :class="activeTab === tab ? 'bg-[#1a2b4c] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
          class="px-4 py-2 rounded-lg transition-all uppercase tracking-wider"
        >
          {{ tab }}
        </button>
      </div>
    </div>

   
    <div v-if="loading" class="text-center py-16 bg-white rounded-xl border border-slate-200">
      <p class="text-slate-400 text-xs font-medium">Loading your bookings in real-time...</p>
    </div>

    
    <div v-else-if="filteredBookings.length > 0" class="space-y-4">
      <div 
        v-for="b in filteredBookings" 
        :key="b.id" 
        class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
      >
        <div class="flex justify-between items-start gap-4">
          <div>
            <span 
              :class="{
                'bg-emerald-100 text-emerald-800 border-emerald-200': b.status === 'Confirmed',
                'bg-amber-100 text-amber-800 border-amber-200': b.status === 'Pending',
                'bg-indigo-100 text-indigo-800 border-indigo-200': b.status === 'Check-in',
                'bg-slate-100 text-slate-700 border-slate-200': b.status === 'Check-out',
                'bg-rose-100 text-rose-800 border-rose-200': b.status === 'Cancelled'
              }" 
              class="text-[10px] font-bold px-2.5 py-1 rounded-sm border uppercase tracking-wider inline-block mb-2"
            >
              {{ b.status }}
            </span>
            
            <h2 class="text-lg font-serif font-bold text-[#1a2b4c]">
              {{ b.hotelName || b.title || 'Hotel Stay' }}
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              📍 {{ b.location || 'Phnom Penh, Cambodia' }}
            </p>
          </div>

          <div class="text-right">
            <span class="text-[10px] text-slate-400 block uppercase font-semibold">Booking Ref</span>
            <span class="text-xs font-mono font-bold text-slate-700">{{ b.ref || `#${b.id.slice(0, 6)}` }}</span>
          </div>
        </div>

   
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg text-xs text-slate-600 border border-slate-100">
          <div>
            <span class="block text-[10px] uppercase text-slate-400 font-semibold mb-0.5">Dates</span>
            <span class="font-semibold text-slate-800">{{ b.checkIn || 'Oct 15' }} - {{ b.checkOut || 'Oct 22' }}</span>
          </div>
          <div>
            <span class="block text-[10px] uppercase text-slate-400 font-semibold mb-0.5">Guest</span>
            <span class="font-semibold text-slate-800">{{ b.guestName || 'Guest' }}</span>
          </div>
          <div>
            <span class="block text-[10px] uppercase text-slate-400 font-semibold mb-0.5">Total Price</span>
            <span class="font-bold text-[#1a2b4c] text-sm">
              {{ (b.totalPrice || b.price || 0).toLocaleString() }} KHR
            </span>
          </div>
        </div>

        
        <div class="flex justify-end gap-3 pt-1">
          <button 
            v-if="b.status !== 'Cancelled' && b.status !== 'Check-out'"
            @click="cancelBooking(b.id)" 
            class="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition-colors uppercase tracking-wider"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-16 bg-white rounded-xl border border-slate-200">
      <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <p class="text-slate-500 text-sm font-medium">
        No {{ activeTab.toLowerCase() }} bookings found.
      </p>
    </div>

  </div>
</template>