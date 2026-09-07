<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-serif font-bold text-gray-900">Bookings & Reservations</h1>
        <p class="text-gray-500 text-sm mt-1">View guest reservations and stay details for your properties.</p>
      </div>
    </div>

    <!-- Status Tabs -->
    <div class="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
      <button 
        v-for="tab in tabs" 
        :key="tab" 
        @click="activeTab = tab"
        :class="activeTab === tab ? 'border-indigo-950 text-indigo-950 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'"
        class="pb-3 px-4 text-sm border-b-2 transition-colors whitespace-nowrap"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Filters & Search Bar -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2">
        <span class="text-gray-400 text-sm">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search guest name, property, or booking ID..." 
          class="w-full text-sm outline-none bg-transparent" 
        />
      </div>
      <select v-model="selectedProperty" class="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 font-medium">
        <option value="">All Properties</option>
        <option value="Villa Azul">Villa Azul</option>
        <option value="The Glasshouse">The Glasshouse</option>
        <option value="Urban Minimalist Studio">Urban Minimalist Studio</option>
      </select>
    </div>

    <!-- Read-Only Bookings Table -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-left border-collapse text-sm">
        <thead>
          <tr class="bg-gray-50 text-xs text-gray-400 border-b border-gray-100 uppercase tracking-wider">
            <th class="py-3 px-4 font-medium">Booking ID</th>
            <th class="py-3 px-4 font-medium">Guest</th>
            <th class="py-3 px-4 font-medium">Property & Room</th>
            <th class="py-3 px-4 font-medium">Check-In / Out</th>
            <th class="py-3 px-4 font-medium">Total Amount</th>
            <th class="py-3 px-4 font-medium">Status</th>
            <th class="py-3 px-4 font-medium text-right">View</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="py-4 px-4 font-mono text-xs text-gray-500 font-semibold">#{{ booking.id }}</td>
            <td class="py-4 px-4 font-medium text-gray-900">
              <div>{{ booking.guest }}</div>
              <div class="text-xs text-gray-400 font-normal">{{ booking.email }}</div>
            </td>
            <td class="py-4 px-4">
              <div class="font-medium text-gray-800">{{ booking.property }}</div>
              <div class="text-xs text-gray-400">{{ booking.roomType }}</div>
            </td>
            <td class="py-4 px-4 text-xs text-gray-600">
              <div>{{ booking.checkIn }} → {{ booking.checkOut }}</div>
              <div class="text-gray-400 mt-0.5">{{ booking.nights }} Nights</div>
            </td>
            <td class="py-4 px-4 font-semibold text-gray-900">${{ booking.totalPrice }}</td>
            <td class="py-4 px-4">
              <span :class="statusBadge(booking.status)" class="px-2.5 py-1 text-xs rounded-full font-medium">
                {{ booking.status }}
              </span>
            </td>
            <td class="py-4 px-4 text-right">
              <button 
                @click="selectedBooking = booking" 
                class="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors"
              >
                View Details
              </button>
            </td>
          </tr>
          <tr v-if="filteredBookings.length === 0">
            <td colspan="7" class="py-8 text-center text-gray-400 text-sm">No bookings found matching your criteria.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- READ-ONLY DETAILS MODAL -->
    <div 
      v-if="selectedBooking" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-4">
        <div class="flex justify-between items-center border-b border-gray-100 pb-3">
          <div>
            <span class="text-xs font-mono text-gray-400 font-bold uppercase">Booking Overview</span>
            <h3 class="text-lg font-serif font-bold text-gray-900">#{{ selectedBooking.id }}</h3>
          </div>
          <button @click="selectedBooking = null" class="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <div class="space-y-3 text-sm">
          <div class="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
            <span class="text-xs text-gray-500 font-semibold uppercase">Status</span>
            <span :class="statusBadge(selectedBooking.status)" class="px-2.5 py-1 text-xs rounded-full font-medium">
              {{ selectedBooking.status }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs border-b border-gray-100 pb-3">
            <div>
              <p class="text-gray-400">Guest Name</p>
              <p class="font-bold text-gray-800 mt-0.5">{{ selectedBooking.guest }}</p>
            </div>
            <div>
              <p class="text-gray-400">Email Address</p>
              <p class="font-bold text-gray-800 mt-0.5">{{ selectedBooking.email }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs border-b border-gray-100 pb-3">
            <div>
              <p class="text-gray-400">Property</p>
              <p class="font-bold text-gray-800 mt-0.5">{{ selectedBooking.property }}</p>
            </div>
            <div>
              <p class="text-gray-400">Room Selected</p>
              <p class="font-bold text-gray-800 mt-0.5">{{ selectedBooking.roomType }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs border-b border-gray-100 pb-3">
            <div>
              <p class="text-gray-400">Dates</p>
              <p class="font-bold text-gray-800 mt-0.5">{{ selectedBooking.checkIn }} - {{ selectedBooking.checkOut }}</p>
            </div>
            <div>
              <p class="text-gray-400">Total Price</p>
              <p class="font-bold text-indigo-950 text-sm mt-0.5">${{ selectedBooking.totalPrice }}</p>
            </div>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button 
            @click="selectedBooking = null" 
            class="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'owner'
})

const activeTab = ref('All')
const tabs = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled']
const searchQuery = ref('')
const selectedProperty = ref('')
const selectedBooking = ref(null)

const bookings = ref([
  { id: 'BK-9021', guest: 'Sarah Jenkins', email: 'sarah.j@example.com', property: 'Villa Azul', roomType: 'Ocean Luxury Suite', checkIn: 'Oct 12, 2026', checkOut: 'Oct 18, 2026', nights: 6, totalPrice: '1,250', status: 'Confirmed' },
  { id: 'BK-9022', guest: 'Michael Chen', email: 'mchen@example.com', property: 'The Glasshouse', roomType: 'Penthouse Loft', checkIn: 'Oct 15, 2026', checkOut: 'Oct 20, 2026', nights: 5, totalPrice: '2,100', status: 'Pending' },
  { id: 'BK-9023', guest: 'Alice Roberts', email: 'aroberts@example.com', property: 'Urban Minimalist Studio', roomType: 'Studio Deluxe', checkIn: 'Oct 01, 2026', checkOut: 'Oct 05, 2026', nights: 4, totalPrice: '850', status: 'Completed' },
  { id: 'BK-9024', guest: 'David & Emma', email: 'david.e@example.com', property: 'Villa Azul', roomType: 'Garden Villa', checkIn: 'Nov 02, 2026', checkOut: 'Nov 06, 2026', nights: 4, totalPrice: '980', status: 'Cancelled' }
])

const filteredBookings = computed(() => {
  return bookings.value.filter(b => {
    const matchesTab = activeTab.value === 'All' || b.status === activeTab.value
    const matchesSearch = b.guest.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          b.property.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesProp = !selectedProperty.value || b.property === selectedProperty.value
    return matchesTab && matchesSearch && matchesProp
  })
})

const statusBadge = (status) => {
  if (status === 'Confirmed') return 'bg-emerald-100 text-emerald-700'
  if (status === 'Pending') return 'bg-amber-100 text-amber-700'
  if (status === 'Completed') return 'bg-indigo-100 text-indigo-700'
  return 'bg-rose-100 text-rose-700'
}
</script>