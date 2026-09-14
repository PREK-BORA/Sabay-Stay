<script setup lang="ts">
import { definePageMeta } from '#imports'
import { useUserData } from '~/composables/useUserData'

definePageMeta({
  layout: 'user',
  middleware: 'auth'
})

export interface FavoriteItem {
  id: number
  name: string
  location: string
  rating?: number
  reviewsCount?: number
  image?: string
}

const { favorites, toggleFavorite } = useUserData()
const loading = false

const removeFavorite = (id: number) => {
  const item = favorites.value.find((favorite) => favorite.id === id)
  if (item) toggleFavorite(item)
}
</script>

<template>
  <div class="space-y-8 max-w-5xl">
    <!-- Header Section -->
    <div class="flex justify-between items-center border-b border-slate-200 pb-5">
      <div>
        <h1 class="text-3xl font-serif font-bold text-slate-900">Saved Properties</h1>
        <p class="text-slate-500 text-sm mt-1">Curated luxury escapes you've marked for future journeys.</p>
      </div>
      <span class="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
        {{ favorites.length }} Items Saved
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <p class="text-slate-400 text-sm">Loading your saved properties...</p>
    </div>

    <!-- Favorites List -->
    <div v-else-if="favorites.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="item in favorites" 
        :key="item.id" 
        class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center gap-4">
          <!-- Thumbnail / Image -->
          <div class="w-20 h-20 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl font-bold text-indigo-900 shrink-0 overflow-hidden border border-slate-100">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
            <span v-else>🏨</span>
          </div>
          <div>
            <h3 class="font-bold text-slate-800 text-base">{{ item.name }}</h3>
            <p class="text-xs text-slate-500 mt-0.5">📍 {{ item.location }}</p>
            <div class="flex items-center gap-1 mt-2 text-xs font-semibold text-amber-500">
              ★ {{ item.rating ? Number(item.rating).toFixed(1) : '4.8' }} 
              <span class="text-slate-400 font-normal">({{ item.reviewsCount || 12 }} Reviews)</span>
            </div>
          </div>
        </div>

        <!-- Remove Button -->
        <button 
          @click="removeFavorite(item.id)" 
          class="px-3.5 py-1.5 border border-slate-300 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-100 hover:text-rose-600 transition-all shrink-0 cursor-pointer"
        >
          Remove
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <p class="text-slate-400 text-sm">No saved places yet.</p>
    </div>
  </div>
</template>