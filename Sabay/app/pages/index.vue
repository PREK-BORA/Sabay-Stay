<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Hero & Search Section -->
    <div class="bg-indigo-950 text-white py-16 px-6">
      <div class="max-w-5xl mx-auto text-center space-y-4">
        <h1 class="text-4xl md:text-5xl font-serif font-bold">Find Your Perfect Stay</h1>
        <p class="text-gray-300 text-sm md:text-base max-w-xl mx-auto">
          Discover luxury suites, beachfront villas, and cozy rooms for your next destination.
        </p>

        <!-- Search Bar -->
        <div class="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 text-gray-800 grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 text-left">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Destination</label>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Where are you going?" 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-950"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Check-In</label>
            <input 
              v-model="checkInDate" 
              type="date" 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-950"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Check-Out</label>
            <input 
              v-model="checkOutDate" 
              type="date" 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-950"
            />
          </div>
          <div class="flex items-end">
            <button class="w-full bg-indigo-950 hover:bg-indigo-900 text-white font-medium py-2.5 rounded-xl text-sm transition-colors shadow-sm">
              Search Hotels
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hotel Results Listing -->
    <div class="max-w-6xl mx-auto px-6 py-12">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-serif font-bold text-gray-900">Featured Properties</h2>
        <NuxtLink to="/Owner/my_hotels" class="text-xs font-semibold text-indigo-950 hover:underline">
          Switch to Owner View →
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="store.loading" class="text-center py-12 text-gray-500 text-sm">
        Loading hotels from server...
      </div>

      <!-- Hotels Grid -->
      <div v-else-if="filteredHotels.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="hotel in filteredHotels" 
          :key="hotel.id" 
          class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          <div>
            <div class="h-48 bg-gray-200 relative">
              <img :src="hotel.image" :alt="hotel.name" class="w-full h-full object-cover" />
              <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-800">
                ★ {{ hotel.rating }}
              </span>
            </div>
            <div class="p-5">
              <div class="text-xs text-indigo-950 font-semibold uppercase tracking-wider mb-1">{{ hotel.city }}</div>
              <h3 class="text-xl font-bold font-serif text-gray-900 mb-2">{{ hotel.name }}</h3>
              <p class="text-xs text-gray-500 line-clamp-2 mb-4">{{ hotel.description }}</p>
            </div>
          </div>

          <div class="p-5 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
            <div>
              <span class="text-xs text-gray-400 block">Starting from</span>
              <span class="text-lg font-bold text-indigo-950">${{ hotel.pricePerNight }}</span>
              <span class="text-xs text-gray-500"> / night</span>
            </div>
            <NuxtLink 
              :to="`/hotel/${hotel.id}`" 
              class="px-4 py-2 text-xs bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl font-medium transition-colors"
            >
              View Hotel
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 text-gray-400 text-sm">
        No hotels found matching your search.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHotelStore } from '~/stores/hotelStore'

const store = useHotelStore()

const searchQuery = ref('')
const checkInDate = ref('2026-09-05')
const checkOutDate = ref('2026-09-08')

onMounted(() => {
  store.fetchHotels()
})

const filteredHotels = computed(() => {
  if (!searchQuery.value) return store.hotels
  return store.hotels.filter(h => 
    h.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    h.city.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>