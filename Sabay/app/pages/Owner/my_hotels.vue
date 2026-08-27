<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header & Action Button -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-serif font-bold text-gray-900">My Properties</h1>
        <p class="text-gray-500 text-sm mt-1">Manage your registered hotels, villas, and apartments.</p>
      </div>
      <NuxtLink 
        to="/Owner/add_hotels" 
        class="px-4 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
      >
        <span>+ Add New Property</span>
      </NuxtLink>
    </div>

    <!-- Properties Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="hotel in hotels" :key="hotel.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          <!-- Property Image -->
          <div class="h-48 w-full bg-gray-100 relative overflow-hidden">
            <img :src="hotel.image" :alt="hotel.name" class="w-full h-full object-cover" />
            <span :class="statusBadge(hotel.status)" class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
              {{ hotel.status }}
            </span>
          </div>

          <!-- Property Info -->
          <div class="p-5">
            <div class="text-xs text-indigo-950 font-semibold uppercase tracking-wider mb-1">{{ hotel.location }}</div>
            <h3 class="font-serif font-bold text-lg text-gray-900 mb-2">{{ hotel.name }}</h3>
            <div class="flex justify-between items-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
              <div>
                <span class="text-gray-400 block text-xs">Nightly Rate</span>
                <span class="font-bold text-gray-900 text-base">${{ hotel.price }}</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400 block text-xs">Active Bookings</span>
                <span class="font-semibold text-gray-800">{{ hotel.bookings }} Stays</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="p-5 pt-0 flex gap-2">
          <NuxtLink 
            :to="`/Owner/hotel_details?id=${hotel.id}`" 
            class="flex-1 py-2 text-center text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
          >
            View Details
          </NuxtLink>
          <NuxtLink 
            :to="`/Owner/edit_hotel?id=${hotel.id}`" 
            class="flex-1 py-2 text-center text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
          >
            Edit Property
          </NuxtLink>
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

const hotels = ref([
  { 
    id: 1, 
    name: 'Villa Azul', 
    location: 'Ubud, Bali', 
    price: 180, 
    bookings: 12, 
    status: 'Active', 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 2, 
    name: 'The Glasshouse', 
    location: 'Seminyak, Bali', 
    price: 310, 
    bookings: 8, 
    status: 'Active', 
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 3, 
    name: 'Jungle Canopy Retreat', 
    location: 'Ubud, Bali', 
    price: 320, 
    bookings: 0, 
    status: 'Maintenance', 
    image: 'https://afocirmbqdxnkyescnev.supabase.co/storage/v1/object/public/featured-images/8c7511bd-c8f5-424f-bed4-fa6348b35acf/c7a58e18-64d3-488d-b2b9-d00c07f30c10.webp' 
  }
])

const statusBadge = (status) => {
  if (status === 'Active') return 'bg-emerald-500 text-white'
  return 'bg-amber-500 text-white'
}
</script>