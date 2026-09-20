<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  collection, 
  doc, 
  updateDoc, 
  addDoc,
  onSnapshot, 
  query, 
  serverTimestamp 
} from 'firebase/firestore'
import { definePageMeta, useNuxtApp } from '#imports'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const bookings = ref([])
const selectedStatus = ref('All')
const searchQuery = ref('')
const loading = ref(true)
const actionLoadingId = ref(null)

let unsubscribe = null

const normalizeStatus = (status) => {
  return String(status || '').trim().toLowerCase()
}

const formatDate = (dateVal) => {
  if (!dateVal) return 'N/A'
  if (typeof dateVal === 'object' && dateVal !== null) {
    if (typeof dateVal.toDate === 'function') {
      return dateVal.toDate().toISOString().split('T')[0]
    }
    if (typeof dateVal.seconds === 'number') {
      return new Date(dateVal.seconds * 1000).toISOString().split('T')[0]
    }
  }
  const parsed = new Date(dateVal)
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0]
  }
  return String(dateVal)
}

const formatPrice = (value) => {
  const num = Number(value) || 0
  return num.toLocaleString()
}

const getDb = () => {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$db || null
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
      const list = []

      snapshot.forEach((docSnap) => {
        const data = docSnap.data()

        const guestName = String(data.guestName || data.userName || data.name || data.fullName || data.customerName || 'Valued Guest')
        const guestEmail = String(data.guestEmail || data.userEmail || data.email || '')
        const guestAvatar = String(data.guestAvatar || data.avatar || data.photoURL || data.image || data.profileImage || '')
        const rawUserId = String(data.userId || data.user_id || data.uid || data.createdBy || data.memberId || data.customerID || '').trim()
        const hotelName = String(data.hotelName || data.title || data.propertyName || 'Hotel Reservation')
        const statusVal = String(data.status || 'pending')
        const refVal = data.ref ? String(data.ref) : undefined

        list.push({
          ...data,
          id: docSnap.id,
          userId: rawUserId,
          guestName,
          guestEmail,
          guestAvatar,
          hotelName,
          status: statusVal,
          ref: refVal,
          totalPrice: Number(data.totalPrice ?? data.total ?? data.amount ?? data.price ?? 0),
          checkIn: formatDate(data.checkIn || data.checkInDate),
          checkOut: formatDate(data.checkOut || data.checkOutDate)
        })
      })

      bookings.value = list
      loading.value = false
    }, (error) => {
      console.error('Firestore listener error:', error)
      loading.value = false
    })
  } catch (error) {
    console.error('Error binding listener:', error)
    loading.value = false
  }
}

const changeStatus = async (id, newStatus) => {
  const targetId = String(id || '').trim()
  const db = getDb()

  if (!db || !targetId) return
  if (!confirm(`Are you sure you want to change the status to "${newStatus}"?`)) return

  actionLoadingId.value = targetId

  try {
    const bookingRef = doc(db, 'bookings', targetId)
    
    await updateDoc(bookingRef, { 
      status: newStatus,
      updatedAt: serverTimestamp()
    })

    const booking = bookings.value.find((item) => item.id === targetId)
    const nuxtApp = useNuxtApp()
    const authUser = nuxtApp.$auth?.currentUser
    const actorId = authUser?.uid || 'admin'
    const targetUserId = booking?.userId || ''
    
    if (targetUserId) {
      await addDoc(collection(db, 'notifications'), {
        recipientId: targetUserId,
        userId: targetUserId,
        actorId,
        bookingId: targetId,
        type: 'booking',
        title: `Booking ${newStatus}`,
        message: `Your booking at ${booking?.hotelName || 'SabayStay'} has been updated to ${newStatus}.`,
        isRead: false,
        createdAt: serverTimestamp()
      })
    }
  } catch (error) {
    console.error('Error updating status:', error)
    alert(`Update failed: ${error.message || error}`)
  } finally {
    actionLoadingId.value = null
  }
}

const filteredBookings = computed(() => {
  let list = bookings.value || []

  if (selectedStatus.value !== 'All') {
    list = list.filter(b => normalizeStatus(b.status) === normalizeStatus(selectedStatus.value))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(b =>
      (b.hotelName && String(b.hotelName).toLowerCase().includes(q)) ||
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
    <div class="space-y-6 max-w-7xl mx-auto pb-12 text-slate-200">
      <!-- Header -->
      <div class="bg-[#1a1c23] rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Booking Management</h1>
          <p class="text-sm text-slate-400 mt-1">Manage room reservations and send updates to guests</p>
        </div>
        <span class="text-xs bg-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl shadow-md w-fit">
          Total Bookings: {{ bookings.length }}
        </span>
      </div>

      <!-- Filters Bar -->
      <div class="flex flex-col md:flex-row md:items-center gap-4 bg-[#1a1c23] p-4 rounded-2xl border border-slate-800 shadow-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by hotel name, guest name, or Ref ID..."
          class="flex-1 px-4 py-2.5 bg-[#121318] border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
        />
        <select
          v-model="selectedStatus"
          class="px-4 py-2.5 bg-[#121318] border border-slate-700/80 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:border-amber-500"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Check-in">Check-in</option>
          <option value="Check-out">Check-out</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Bookings Table Wrapper -->
      <div class="bg-[#1a1c23] rounded-2xl border border-slate-800 shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-175">
            <thead>
              <tr class="bg-[#121318] border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                <th class="py-3.5 px-6">Ref</th>
                <th class="py-3.5 px-6">Hotel Name</th>
                <th class="py-3.5 px-6">Guest</th>
                <th class="py-3.5 px-6">Dates</th>
                <th class="py-3.5 px-6">Price</th>
                <th class="py-3.5 px-6">Status</th>
                <th class="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-xs">
              <tr v-for="b in filteredBookings" :key="b.id" class="hover:bg-[#222530] transition-colors">
                <td class="py-4 px-6 font-mono font-bold text-slate-300">{{ b.ref || `#${String(b.id).slice(0, 6)}` }}</td>
                <td class="py-4 px-6 font-bold text-white">{{ b.hotelName }}</td>
                <td class="py-4 px-6 text-slate-300 font-medium">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center border border-slate-700">
                      <img 
                        v-if="b.guestAvatar" 
                        :src="b.guestAvatar" 
                        alt="Guest Avatar" 
                        class="w-full h-full object-cover" 
                      />
                      <span v-else class="text-xs font-bold text-amber-400">
                        {{ (b.guestName || 'U').charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div>
                      <p class="font-bold text-white">{{ b.guestName }}</p>
                      <p v-if="b.guestEmail" class="mt-0.5 text-[11px] text-slate-400">{{ b.guestEmail }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 text-slate-400 whitespace-nowrap">{{ b.checkIn }} — {{ b.checkOut }}</td>
                <td class="py-4 px-6 font-bold text-slate-200 whitespace-nowrap">${{ formatPrice(b.totalPrice) }}</td>
                <td class="py-4 px-6 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-amber-950 text-amber-400 border-amber-800/60': normalizeStatus(b.status) === 'pending',
                      'bg-emerald-950 text-emerald-400 border-emerald-800/60': normalizeStatus(b.status) === 'confirmed',
                      'bg-indigo-950 text-indigo-400 border-indigo-800/60': normalizeStatus(b.status) === 'check-in',
                      'bg-slate-800 text-slate-300 border-slate-700': normalizeStatus(b.status) === 'check-out',
                      'bg-rose-950 text-rose-400 border-rose-800/60': normalizeStatus(b.status) === 'cancelled'
                    }"
                    class="px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="{
                      'bg-amber-400': normalizeStatus(b.status) === 'pending',
                      'bg-emerald-400': normalizeStatus(b.status) === 'confirmed',
                      'bg-indigo-400': normalizeStatus(b.status) === 'check-in',
                      'bg-slate-400': normalizeStatus(b.status) === 'check-out',
                      'bg-rose-400': normalizeStatus(b.status) === 'cancelled'
                    }"></span>
                    {{ b.status }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                  <button
                    v-if="normalizeStatus(b.status) === 'pending'"
                    :disabled="actionLoadingId === b.id"
                    @click="changeStatus(b.id, 'Confirmed')"
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Approve
                  </button>

                  <button
                    v-if="normalizeStatus(b.status) === 'confirmed'"
                    :disabled="actionLoadingId === b.id"
                    @click="changeStatus(b.id, 'Check-in')"
                    class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Check In
                  </button>

                  <button
                    v-if="normalizeStatus(b.status) === 'check-in'"
                    :disabled="actionLoadingId === b.id"
                    @click="changeStatus(b.id, 'Check-out')"
                    class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Check Out
                  </button>

                  <button
                    v-if="!['cancelled', 'check-out'].includes(normalizeStatus(b.status))"
                    :disabled="actionLoadingId === b.id"
                    @click="changeStatus(b.id, 'Cancelled')"
                    class="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800/60 rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </td>
              </tr>

              <tr v-if="loading">
                <td colspan="7" class="py-16 text-center text-slate-400 text-xs font-medium">
                  <div class="inline-flex items-center gap-2">
                    <div class="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
                    Fetching live booking data from Firestore...
                  </div>
                </td>
              </tr>

              <tr v-if="!loading && filteredBookings.length === 0">
                <td colspan="7" class="py-16 text-center text-slate-500 text-xs font-medium">
                  No booking records match your search criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>