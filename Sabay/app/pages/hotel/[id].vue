<template>
  <div class="bg-gray-50 min-h-screen pb-16">
    <!-- Navigation Back -->
    <div class="max-w-6xl mx-auto px-6 py-4">
      <NuxtLink to="/" class="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1">
        ← Back to Search
      </NuxtLink>
    </div>

    <!-- Hotel Hero Header -->
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="md:col-span-2 h-80 rounded-2xl overflow-hidden bg-gray-200">
        <img :src="hotel.image" :alt="hotel.name" class="w-full h-full object-cover" />
      </div>
      <div class="space-y-4 flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <span class="text-xs font-semibold text-indigo-950 uppercase tracking-wider">{{ hotel.city }}</span>
          <h1 class="text-2xl font-serif font-bold text-gray-900 mt-1">{{ hotel.name }}</h1>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full">★ {{ hotel.rating }}</span>
            <span class="text-xs text-gray-400">({{ hotel.reviewsCount }} verified guest reviews)</span>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-4">
          <div class="text-xs text-gray-400">Address</div>
          <div class="text-sm font-medium text-gray-700 mt-0.5">{{ hotel.address }}</div>
        </div>
      </div>
    </div>

    <!-- Available Rooms Listing -->
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-2xl font-serif font-bold text-gray-900 mb-6">Available Room Types</h2>

      <div class="space-y-4">
        <div v-for="room in hotel.rooms" :key="room.id" class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div class="space-y-2">
            <span class="text-xs bg-indigo-50 text-indigo-950 font-semibold px-2.5 py-1 rounded-md">{{ room.type }}</span>
            <h3 class="text-xl font-bold text-gray-900">{{ room.name }}</h3>
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span>👥 Max {{ room.capacity }} Guests</span>
              <span>🛏️ {{ room.beds }}</span>
            </div>
          </div>

          <div class="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
            <div class="text-right">
              <div class="text-2xl font-bold text-indigo-950">${{ room.price }}</div>
              <div class="text-xs text-gray-400">per night</div>
            </div>
            <NuxtLink 
              :to="`/checkout?hotelId=${hotel.id}&roomId=${room.id}`" 
              class="px-6 py-3 bg-indigo-950 hover:bg-indigo-900 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
            >
              Book Now
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hotel = ref({
  id: 1,
  name: 'Villa Azul Luxury Resort',
  city: 'Cancun, Mexico',
  address: 'Blvd. Kukulcan Km 16.5, Hotel Zone, Cancun',
  rating: 4.8,
  reviewsCount: 128,
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
  rooms: [
    { id: 101, name: 'Ocean Luxury Suite', type: 'Suite', capacity: 2, beds: '1 King Bed', price: 250 },
    { id: 102, name: 'Garden Villa Room', type: 'Villa', capacity: 4, beds: '2 Queen Beds', price: 180 },
    { id: 103, name: 'Deluxe Poolside Room', type: 'Deluxe', capacity: 2, beds: '1 Queen Bed', price: 210 }
  ]
})
</script>