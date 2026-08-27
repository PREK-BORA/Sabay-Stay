<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Top Back Navigation & Actions -->
    <div class="flex justify-between items-center mb-6">
      <NuxtLink to="/Owner/bookings" class="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1">
        ← Back to Bookings
      </NuxtLink>
      <div class="flex gap-3">
        <button @click="booking.status = 'Cancelled'" class="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-medium">
          Cancel Booking
        </button>
        <button @click="booking.status = 'Confirmed'" class="px-4 py-2 bg-indigo-950 text-white hover:bg-indigo-900 rounded-lg text-sm font-medium">
          Confirm Reservation
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Details -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Summary Header -->
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-serif font-bold text-gray-900">Booking #{{ booking.id }}</h1>
              <span :class="statusBadge(booking.status)" class="px-2.5 py-0.5 text-xs rounded-full font-medium">
                {{ booking.status }}
              </span>
            </div>
            <p class="text-sm text-gray-500">Booked on {{ booking.bookedOn }}</p>
          </div>
          <div class="text-right">
            <span class="text-xs text-gray-400 block">Payout Value</span>
            <span class="text-2xl font-serif font-bold text-indigo-950">${{ booking.totalPrice }}</span>
          </div>
        </div>

        <!-- Stay & Room Overview -->
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 class="font-serif font-bold text-lg text-gray-900 mb-4 border-b pb-3 border-gray-100">Stay Overview</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span class="text-gray-400 block mb-1">Property</span>
              <span class="font-semibold text-gray-800 text-sm">{{ booking.property }}</span>
            </div>
            <div>
              <span class="text-gray-400 block mb-1">Room Type</span>
              <span class="font-semibold text-gray-800 text-sm">{{ booking.roomType }}</span>
            </div>
            <div>
              <span class="text-gray-400 block mb-1">Check-In</span>
              <span class="font-semibold text-gray-800 text-sm">{{ booking.checkIn }}</span>
            </div>
            <div>
              <span class="text-gray-400 block mb-1">Check-Out</span>
              <span class="font-semibold text-gray-800 text-sm">{{ booking.checkOut }}</span>
            </div>
          </div>
        </div>

        <!-- Price Breakdown Table -->
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 class="font-serif font-bold text-lg text-gray-900 mb-4 border-b pb-3 border-gray-100">Payment Breakdown</h2>
          <div class="space-y-3 text-xs">
            <div class="flex justify-between text-gray-600">
              <span>Nightly Rate (${{ booking.nightlyRate }} × {{ booking.nights }} nights)</span>
              <span class="font-medium text-gray-900">${{ booking.nightlyRate * booking.nights }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Cleaning Fee</span>
              <span class="font-medium text-gray-900">${{ booking.cleaningFee }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Service Fee</span>
              <span class="font-medium text-gray-900">${{ booking.serviceFee }}</span>
            </div>
            <div class="border-t pt-3 flex justify-between text-sm font-bold text-gray-900">
              <span>Total Revenue</span>
              <span class="text-indigo-950">${{ booking.totalPrice }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Guest Details Sidebar -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 class="font-serif font-bold text-lg text-gray-900 mb-4 border-b pb-3 border-gray-100">Guest Information</h2>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-indigo-950 text-white font-bold text-lg flex items-center justify-center">
              {{ booking.guest.charAt(0) }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ booking.guest }}</h3>
              <p class="text-xs text-gray-400">Guest since 2024</p>
            </div>
          </div>
          <div class="space-y-3 text-xs border-t pt-4 border-gray-100">
            <div>
              <span class="text-gray-400 block">Email</span>
              <span class="font-medium text-gray-800">{{ booking.email }}</span>
            </div>
            <div>
              <span class="text-gray-400 block">Phone</span>
              <span class="font-medium text-gray-800">{{ booking.phone }}</span>
            </div>
            <div>
              <span class="text-gray-400 block">Total Guests</span>
              <span class="font-medium text-gray-800">{{ booking.guestsCount }} Adults</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'owner'
})

const booking = ref({
  id: 'BK-9021',
  guest: 'Sarah Jenkins',
  email: 'sarah.j@example.com',
  phone: '+1 (555) 019-2834',
  guestsCount: 2,
  property: 'Villa Azul',
  roomType: 'Ocean Luxury Suite',
  checkIn: 'Oct 12, 2026',
  checkOut: 'Oct 18, 2026',
  bookedOn: 'Sep 28, 2026',
  nights: 6,
  nightlyRate: 180,
  cleaningFee: 90,
  serviceFee: 80,
  totalPrice: '1,250',
  status: 'Confirmed'
})

const statusBadge = (status) => {
  if (status === 'Confirmed') return 'bg-emerald-100 text-emerald-700'
  if (status === 'Pending') return 'bg-amber-100 text-amber-700'
  if (status === 'Completed') return 'bg-indigo-100 text-indigo-700'
  return 'bg-rose-100 text-rose-700'
}
</script>