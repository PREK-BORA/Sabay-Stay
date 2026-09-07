<template>
  <div class="bg-gray-50 min-h-screen py-10 px-6">
    <div class="max-w-5xl mx-auto">
      <!-- Top Navigation -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <NuxtLink to="/" class="text-xs text-gray-400 hover:text-gray-900 font-medium">← Back to Search</NuxtLink>
          <h1 class="text-3xl font-serif font-bold text-gray-900 mt-1">My Bookings</h1>
        </div>

        <div class="flex gap-2 bg-white p-1 rounded-xl border border-gray-200 text-xs font-medium">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="activeTab = tab"
            :class="activeTab === tab ? 'bg-indigo-950 text-white' : 'text-gray-600 hover:text-gray-900'"
            class="px-3.5 py-2 rounded-lg transition-colors"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Reservations List -->
      <div v-if="filteredBookings.length > 0" class="space-y-4">
        <div 
          v-for="booking in filteredBookings" 
          :key="booking.id" 
          class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <span class="text-xs font-mono bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-semibold">{{ booking.id }}</span>
              <span 
                :class="{
                  'bg-emerald-100 text-emerald-700': booking.status === 'Confirmed',
                  'bg-amber-100 text-amber-700': booking.status === 'Pending',
                  'bg-rose-100 text-rose-700': booking.status === 'Cancelled'
                }"
                class="px-2.5 py-1 text-xs rounded-full font-medium"
              >
                {{ booking.status }}
              </span>
            </div>

            <div>
              <h3 class="text-xl font-serif font-bold text-gray-900">{{ booking.hotelName }}</h3>
              <p class="text-xs text-gray-500">{{ booking.roomName }} • {{ booking.city }}</p>
            </div>

            <div class="flex items-center gap-4 text-xs text-gray-600 pt-1">
              <span>📅 {{ booking.checkIn }} to {{ booking.checkOut }}</span>
              <span>🌙 {{ booking.nights }} Night(s)</span>
            </div>
          </div>

          <div class="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
            <div class="text-left md:text-right">
              <span class="text-xs text-gray-400 block">Total Price</span>
              <span class="text-xl font-bold text-indigo-950">${{ booking.totalPrice }}</span>
            </div>

            <div class="flex gap-2">
              <NuxtLink 
                :to="`/hotel/${booking.hotelId}`" 
                class="px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium"
              >
                Hotel Info
              </NuxtLink>
              <button 
                v-if="booking.status !== 'Cancelled'"
                @click="cancelReservation(booking.id)"
                class="px-4 py-2 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-medium transition-colors"
              >
                Cancel Stay
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <span class="text-4xl block mb-2">🏨</span>
        <h3 class="text-lg font-serif font-bold text-gray-900">No reservations found</h3>
        <p class="text-xs text-gray-400 mt-1 mb-6">You don't have any {{ activeTab.toLowerCase() }} bookings at the moment.</p>
        <NuxtLink to="/" class="px-5 py-2.5 bg-indigo-950 text-white rounded-xl text-xs font-medium">
          Explore Available Hotels
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('Active')
const tabs = ['Active', 'Cancelled', 'All']

const bookings = ref([
  {
    id: 'BK-99218',
    hotelId: 1,
    hotelName: 'Villa Azul Luxury Resort',
    roomName: 'Ocean Luxury Suite',
    city: 'Cancun, Mexico',
    checkIn: '2026-09-05',
    checkOut: '2026-09-08',
    nights: 3,
    totalPrice: 825,
    status: 'Confirmed'
  },
  {
    id: 'BK-44102',
    hotelId: 2,
    hotelName: 'Grand Horizon Retreat',
    roomName: 'Penthouse Suite',
    city: 'Miami, USA',
    checkIn: '2026-07-10',
    checkOut: '2026-07-12',
    nights: 2,
    totalPrice: 550,
    status: 'Cancelled'
  }
])

const filteredBookings = computed(() => {
  if (activeTab.value === 'All') return bookings.value
  return bookings.value.filter(b => b.status === activeTab.value)
})

const cancelReservation = (id) => {
  if (confirm('Are you sure you want to cancel this reservation?')) {
    const target = bookings.value.find(b => b.id === id)
    if (target) {
      target.status = 'Cancelled'
    }
  }
}
</script>