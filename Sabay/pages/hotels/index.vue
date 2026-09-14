<script setup lang="ts">
import { useHotels } from '~/composables/useHotels'
import { useUserData } from '~/composables/useUserData'

const { filteredHotels, searchQuery, selectedRegion } = useHotels()
const { favorites, toggleFavorite } = useUserData()

// ពិនិត្យមើលថា hotel នោះត្រូវ បាន save ហើយ ឬនៅ (មាន Safety Check)
const isFavorite = (hotelId: number | string) => {
  return favorites.value?.some((item: any) => item.id === hotelId) ?? false
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header & Search Controls -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-slate-900">Hotels & Resorts</h1>
        <p class="text-slate-500 text-sm mt-1">Find a comfortable base for your next journey.</p>
      </div>

      <!-- Search & Filter Controls -->
      <div class="flex flex-col sm:flex-row gap-3">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search hotels or location..." 
          class="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
        />
        
        <select 
          v-model="selectedRegion" 
          class="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="All">All Regions</option>
          <option value="Maldives">Maldives</option>
          <option value="Tokyo">Tokyo</option>
          <option value="Bali">Bali</option>
        </select>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!filteredHotels || filteredHotels.length === 0" class="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
      <p class="text-slate-500">No hotels found matching your criteria.</p>
    </div>

    <!-- Hotel Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="hotel in filteredHotels" 
        :key="hotel.id" 
        class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between"
      >
        <div class="relative overflow-hidden">
          <img 
            :src="hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'" 
            :alt="hotel.name" 
            class="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          <!-- Favorite Toggle Button -->
          <button 
            @click="toggleFavorite(hotel)"
            class="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-rose-500 transition-colors shadow-sm cursor-pointer"
            title="Save to favorites"
          >
            <svg 
              class="w-5 h-5" 
              :fill="isFavorite(hotel.id) ? 'currentColor' : 'none'" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex justify-between items-start">
              <h3 class="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">
                {{ hotel.name }}
              </h3>
              <span class="text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-600 rounded-md shrink-0">
                ★ {{ hotel.rating || '4.8' }}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">📍 {{ hotel.location }}</p>
            <p class="text-xs text-slate-500 mt-2 line-clamp-2">{{ hotel.description }}</p>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span class="text-xl font-bold text-slate-900">${{ hotel.price }}</span>
              <span class="text-xs text-slate-400"> / night</span>
            </div>
            <!-- ✅ ប្ដូរពី View Details មកជា BOOK NOW -->
            <NuxtLink 
              :to="`/hotels/${hotel.id}`" 
              class="px-5 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm text-center inline-block cursor-pointer"
            >
              Book Now
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>