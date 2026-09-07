<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-serif font-bold text-gray-900">Good Morning, Eleanor</h1>
        <p class="text-gray-500 text-sm mt-1">Here is the overview of your properties today.</p>
      </div>
     
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-start mb-2">
          <span class="text-xs text-gray-500 font-medium">Total Revenue</span>
          <span class="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12.5%</span>
        </div>
        <h3 class="text-2xl font-serif font-bold text-gray-900">$45,280</h3>
      </div>

      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-start mb-2">
          <span class="text-xs text-gray-500 font-medium">Occupancy Rate</span>
          <span class="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+5.2%</span>
        </div>
        <h3 class="text-2xl font-serif font-bold text-gray-900">82%</h3>
        <div class="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div class="bg-indigo-950 h-full w-[82%]"></div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <span class="text-xs text-gray-500 font-medium block mb-2">Pending Bookings</span>
        <h3 class="text-2xl font-serif font-bold text-gray-900">14</h3>
        <p class="text-[11px] text-gray-400 mt-1">Needs approval within 24h</p>
      </div>

      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <span class="text-xs text-gray-500 font-medium block mb-2">Average Rating</span>
        <div class="flex items-baseline gap-2">
          <h3 class="text-2xl font-serif font-bold text-gray-900">4.9</h3>
          <span class="text-xs text-yellow-500">★★★★★</span>
          <span class="text-xs text-gray-400">(128 reviews)</span>
        </div>
      </div>
    </div>

    <!-- Main Section: Chart & Next 48h -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Revenue Performance -->
      <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-serif text-lg font-bold text-gray-900">Revenue Performance</h2>
          <span class="text-xs bg-gray-100 px-3 py-1 rounded-md text-gray-600 font-medium">This Year</span>
        </div>
        <div class="h-56 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
          <span class="text-xs text-gray-400">[Line Chart Visualization: Monthly Earnings]</span>
        </div>
      </div>

      <!-- Next 48h -->
      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-serif text-lg font-bold text-gray-900">Next 48h</h2>
          <a href="#" class="text-xs text-gray-500 hover:text-gray-900">View All</a>
        </div>
        <div class="space-y-4">
          <div v-for="item in next48h" :key="item.name" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
            <div>
              <p class="text-sm font-semibold text-gray-800">{{ item.name }}</p>
              <p class="text-xs text-gray-400">{{ item.hotel }} • Check-in: {{ item.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Bookings Table -->
    <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-serif text-lg font-bold text-gray-900">Recent Bookings</h2>
        <button class="text-xs border px-3 py-1.5 rounded-md text-gray-600 flex items-center gap-1">Filter ⚡</button>
      </div>
      <table class="w-full text-left border-collapse text-sm">
        <thead>
          <tr class="text-xs text-gray-400 border-b border-gray-100">
            <th class="py-3 font-medium">Guest</th>
            <th class="py-3 font-medium">Property</th>
            <th class="py-3 font-medium">Stay Dates</th>
            <th class="py-3 font-medium">Status</th>
            <th class="py-3 font-medium text-right">Payout</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in recentBookings" :key="booking.id" class="border-b border-gray-50 text-gray-700">
            <td class="py-3.5 font-medium flex items-center gap-2">
              <span class="w-7 h-7 bg-indigo-900 text-white rounded-full text-xs flex items-center justify-center">{{ booking.initials }}</span>
              {{ booking.guest }}
            </td>
            <td class="py-3.5">{{ booking.property }}</td>
            <td class="py-3.5 text-xs text-gray-500">{{ booking.dates }}</td>
            <td class="py-3.5">
              <span :class="statusBadge(booking.status)" class="px-2.5 py-1 text-[11px] rounded-full font-medium">
                {{ booking.status }}
              </span>
            </td>
            <td class="py-3.5 text-right font-medium text-gray-900">${{ booking.payout }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const next48h = ref([
  { name: 'Sarah Jenkins', hotel: 'Villa Azul', time: '2:00 PM' },
  { name: 'Michael Chen', hotel: 'The Glasshouse', time: '3:30 PM' },
  { name: 'David & Emma', hotel: 'Oceanview Loft', time: 'Tomorrow' }
])

const recentBookings = ref([
  { id: 1, guest: 'Sarah Jenkins', initials: 'SJ', property: 'Villa Azul', dates: 'Oct 12 - Oct 18', status: 'Confirmed', payout: '1,250' },
  { id: 2, guest: 'Michael Chen', initials: 'MC', property: 'The Glasshouse', dates: 'Oct 15 - Oct 20', status: 'Upcoming', payout: '2,100' },
  { id: 3, guest: 'Alice Roberts', initials: 'AR', property: 'Urban Minimalist Studio', dates: 'Oct 01 - Oct 05', status: 'Completed', payout: '850' }
])

const statusBadge = (status) => {
  if (status === 'Confirmed') return 'bg-emerald-100 text-emerald-700'
  if (status === 'Upcoming') return 'bg-indigo-100 text-indigo-700'
  return 'bg-gray-100 text-gray-600'
}

definePageMeta({
  layout: 'owner'
})
</script>