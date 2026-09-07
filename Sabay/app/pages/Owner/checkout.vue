<template>
  <div class="bg-gray-50 min-h-screen py-10 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <NuxtLink to="/" class="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1">
          ← Back to Hotels
        </NuxtLink>
      </div>

      <h1 class="text-3xl font-serif font-bold text-gray-900 mb-6">Complete Your Reservation</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Guest Details Form -->
        <div class="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-lg font-serif font-bold text-gray-900 mb-4">Guest Information</h2>

          <form @submit.prevent="handleBooking" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
              <input v-model="guest.name" type="text" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-950" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                <input v-model="guest.email" type="email" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-950" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Phone Number</label>
                <input v-model="guest.phone" type="tel" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-950" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Check-In</label>
                <input v-model="dates.checkIn" type="date" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-950" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Check-Out</label>
                <input v-model="dates.checkOut" type="date" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-950" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Special Requests</label>
              <textarea v-model="guest.notes" rows="3" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-indigo-950"></textarea>
            </div>

            <button type="submit" class="w-full py-3.5 bg-indigo-950 hover:bg-indigo-900 text-white font-medium rounded-xl text-sm transition-colors shadow-sm">
              Confirm & Book Reservation
            </button>
          </form>
        </div>

        <!-- Price Breakdown -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit space-y-6">
          <h2 class="text-lg font-serif font-bold text-gray-900 border-b border-gray-100 pb-3">Booking Summary</h2>
          <div>
            <div class="text-xs text-indigo-950 font-semibold uppercase tracking-wider">{{ activeHotel?.name }}</div>
            <div class="text-lg font-bold text-gray-900 mt-1">{{ activeRoom?.name }}</div>
          </div>

          <div class="space-y-2 text-sm border-t border-b border-gray-100 py-4">
            <div class="flex justify-between text-gray-600">
              <span>${{ activeRoom?.price }} × {{ nightsCount }} Night(s)</span>
              <span>${{ subtotal }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Taxes (10%)</span>
              <span>${{ taxes }}</span>
            </div>
            <div class="flex justify-between font-bold text-gray-900 text-base pt-2">
              <span>Total Price</span>
              <span class="text-indigo-950">${{ totalPrice }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHotelStore } from '~/stores/hotelStore'

const router = useRouter()
const store = useHotelStore()

const activeHotel = store.hotels[0]
const activeRoom = activeHotel?.rooms[0]

const guest = ref({ name: '', email: '', phone: '', notes: '' })
const dates = ref({ checkIn: '2026-09-05', checkOut: '2026-09-08' })

const nightsCount = computed(() => {
  const diff = Math.abs(new Date(dates.value.checkOut) - new Date(dates.value.checkIn))
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1
})

const subtotal = computed(() => (activeRoom?.price || 0) * nightsCount.value)
const taxes = computed(() => Math.round(subtotal.value * 0.10))
const totalPrice = computed(() => subtotal.value + taxes.value)

const handleBooking = () => {
  const created = store.createBooking({
    hotelId: activeHotel.id,
    hotelName: activeHotel.name,
    roomName: activeRoom.name,
    guestName: guest.value.name,
    guestEmail: guest.value.email,
    guestPhone: guest.value.phone,
    checkIn: dates.value.checkIn,
    checkOut: dates.value.checkOut,
    nights: nightsCount.value,
    totalPrice: totalPrice.value,
    specialRequest: guest.value.notes
  })

  router.push({
    path: '/confirmation',
    query: { ref: created.id, guest: created.guestName, total: created.totalPrice }
  })
}
</script>