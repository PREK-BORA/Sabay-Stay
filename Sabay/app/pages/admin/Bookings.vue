<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  collection, 
  doc, 
  updateDoc, 
  addDoc,
  onSnapshot, 
  query, 
  serverTimestamp,
  type Firestore 
} from 'firebase/firestore'
import { definePageMeta, useNuxtApp } from '#imports'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

export interface Booking {
  id: string
  ref?: string
  hotelName?: string
  title?: string
  guestName?: string
  userId?: string
  checkIn?: string
  checkOut?: string
  totalPrice?: number | string
  price?: number | string
  status: 'Pending' | 'Confirmed' | 'Check-in' | 'Check-out' | 'Cancelled'
}

const bookings = ref<Booking[]>([])
const selectedStatus = ref<string>('All')
const searchQuery = ref<string>('')
const loading = ref<boolean>(true)
const actionLoadingId = ref<string | null>(null)

let unsubscribe: (() => void) | null = null

const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}

const initFirestoreListener = () => {
  loading.value = true
  const db = getDb()
  if (!db) {
    console.error('Firestore instance not found')
    loading.value = false
    return
  }

  try {
    const q = query(collection(db, 'bookings'))
    
    unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Booking[] = []
      snapshot.forEach((docSnap) => {
        const data = docSnap.data()
        list.push({
          ...data,
          id: docSnap.id // យក Firestore Document Key ពិតប្រាកដមកប្រើ
        } as Booking)
      })
      bookings.value = list
      loading.value = false
    }, (error) => {
      console.error('Firestore snapshot listener error:', error)
      loading.value = false
    })
  } catch (error) {
    console.error('Error binding Firestore listener:', error)
    loading.value = false
  }
}

const changeStatus = async (id: string, newStatus: Booking['status']) => {
  const targetId = String(id).trim()
  const db = getDb()

  if (!db) {
    alert('Firebase Database is not connected!')
    return
  }

  if (!targetId) {
    alert('Invalid Booking ID')
    return
  }

  if (!confirm(`Are you sure you want to change status to "${newStatus}"?`)) return

  actionLoadingId.value = targetId

  try {
    const bookingRef = doc(db, 'bookings', targetId)
    
    await updateDoc(bookingRef, { 
      status: newStatus,
      updatedAt: serverTimestamp()
    })
    const booking = bookings.value.find((item) => item.id === targetId)
    const actorId = String((useNuxtApp().$auth as any)?.currentUser?.uid || '')
    if (booking?.userId && actorId) {
      await addDoc(collection(db, 'notifications'), {
        recipientId: booking.userId,
        actorId,
        bookingId: targetId,
        type: 'booking',
        title: `Booking ${newStatus}`,
        message: `Your booking at ${booking.hotelName || 'SabayStay'} is now ${newStatus.toLowerCase()}.`,
        isRead: false,
        createdAt: serverTimestamp()
      })
    }
  } catch (error: any) {
    console.error(`Error updating status:`, error)
    alert(`Failed to update status: ${error.message || error}`)
  } finally {
    actionLoadingId.value = null
  }
}

const formatPrice = (value?: number | string) => {
  const num = Number(value) || 0
  return num.toLocaleString()
}

const filteredBookings = computed(() => {
  let list = bookings.value || []

  if (selectedStatus.value !== 'All') {
    list = list.filter(b => b.status === selectedStatus.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(b =>
      (b.hotelName && String(b.hotelName).toLowerCase().includes(q)) ||
      (b.title && String(b.title).toLowerCase().includes(q)) ||
      (b.guestName && String(b.guestName).toLowerCase().includes(q)) ||
      (b.ref && String(b.ref).toLowerCase().includes(q)) ||
      String(b.id).toLowerCase().includes(q)
    )
  }

  return list
})

onMounted(() => {
  initFirestoreListener()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<template>
  <ClientOnly>
    <div class="space-y-6 font-sans">
      <!-- Header -->
      <div class="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h1 class="text-2xl font-serif font-bold text-[#1a2b4c]">Booking Management</h1>
          <p class="text-slate-500 text-xs mt-0.5">Track guest reservations through pending, confirmed, check-in, check-out, and cancelled states.</p>
        </div>
        <span class="text-xs bg-[#1b1c3e] text-white px-3 py-1.5 rounded-xl font-semibold">
          Total: {{ bookings.length }}
        </span>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by hotel, guest, or ref..."
          class="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1b1c3e]"
        />
        <select
          v-model="selectedStatus"
          class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Check-in">Check-in</option>
          <option value="Check-out">Check-out</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Bookings Table -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-175">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase tracking-wider font-bold">
              <th class="p-4">Ref</th>
              <th class="p-4">Hotel Name</th>
              <th class="p-4">Guest</th>
              <th class="p-4">Dates</th>
              <th class="p-4">Price</th>
              <th class="p-4">Status</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr v-for="b in filteredBookings" :key="b.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-4 font-mono font-bold text-slate-700">{{ b.ref || `#${String(b.id).slice(0, 6)}` }}</td>
              <td class="p-4 font-bold text-[#1a2b4c]">{{ b.hotelName || b.title || 'N/A' }}</td>
              <td class="p-4 text-slate-600 font-medium">{{ b.guestName || 'User Account' }}</td>
              <td class="p-4 text-slate-500 whitespace-nowrap">{{ b.checkIn || 'N/A' }} - {{ b.checkOut || 'N/A' }}</td>
              <td class="p-4 font-bold text-slate-800 whitespace-nowrap">${{ formatPrice(b.totalPrice || b.price) }}</td>
              <td class="p-4">
                <span
                  :class="{
                    'bg-amber-100 text-amber-800 border-amber-200': b.status === 'Pending',
                    'bg-emerald-100 text-emerald-800 border-emerald-200': b.status === 'Confirmed',
                    'bg-indigo-100 text-indigo-800 border-indigo-200': b.status === 'Check-in',
                    'bg-slate-100 text-slate-700 border-slate-200': b.status === 'Check-out',
                    'bg-rose-100 text-rose-800 border-rose-200': b.status === 'Cancelled'
                  }"
                  class="px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-wider inline-block"
                >
                  {{ b.status }}
                </span>
              </td>
              <td class="p-4 text-right space-x-1.5 whitespace-nowrap">
                <!-- Pending Actions -->
                <button
                  v-if="b.status === 'Pending'"
                  :disabled="actionLoadingId === b.id"
                  @click="changeStatus(b.id, 'Confirmed')"
                  class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Approve
                </button>

                <!-- Confirmed Actions -->
                <button
                  v-if="b.status === 'Confirmed'"
                  :disabled="actionLoadingId === b.id"
                  @click="changeStatus(b.id, 'Check-in')"
                  class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Check In
                </button>

                <!-- Check-in Actions -->
                <button
                  v-if="b.status === 'Check-in'"
                  :disabled="actionLoadingId === b.id"
                  @click="changeStatus(b.id, 'Check-out')"
                  class="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Check Out
                </button>

                <!-- Cancel Action -->
                <button
                  v-if="b.status !== 'Cancelled' && b.status !== 'Check-out'"
                  :disabled="actionLoadingId === b.id"
                  @click="changeStatus(b.id, 'Cancelled')"
                  class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
              </td>
            </tr>

            <!-- Loading state -->
            <tr v-if="loading">
              <td colspan="7" class="p-8 text-center text-slate-400 text-xs font-medium">
                Loading real-time bookings from Firestore...
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="!loading && filteredBookings.length === 0">
              <td colspan="7" class="p-8 text-center text-slate-400 text-xs font-medium">
                No bookings found matching your selected filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ClientOnly>
</template>
