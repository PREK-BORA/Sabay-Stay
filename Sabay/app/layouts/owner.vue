<template>
  <div class="min-h-screen flex bg-gray-50 text-gray-800">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 hidden md:flex">
      <div>
        <!-- Brand Logo -->
        <NuxtLink to="/owner/owner_dashboard" class="text-2xl font-serif font-bold text-indigo-950 block mb-8">
          SabayStay
        </NuxtLink>

        <!-- Navigation Links -->
        <nav class="space-y-1">
          <NuxtLink 
            to="/owner/owner_dashboard" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            Overview
          </NuxtLink>

          <NuxtLink 
            to="/owner/my_hotels" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            My Properties
          </NuxtLink>
          
          <NuxtLink 
            :to="roomTargetLink" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            Rooms
          </NuxtLink>

          <NuxtLink 
            to="/owner/bookings" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            Bookings
          </NuxtLink>

          <NuxtLink 
            to="/owner/revenue" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            Revenue
          </NuxtLink>

          <NuxtLink 
            to="/owner/reviews" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            Reviews
          </NuxtLink>

          <NuxtLink 
            to="/owner/earnings" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            Earnings
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const route = useRoute()

// Smart dynamic link for Rooms
const roomTargetLink = computed(() => {
  // 1. If URL has hotelId query, keep it
  if (route.query.hotelId) {
    return `/owner/room?hotelId=${route.query.hotelId}`
  }

  // 2. Otherwise fall back to cached hotel ID if available
  if (import.meta.client) {
    const cachedHotels = localStorage.getItem('sabay_hotels_cache')
    if (cachedHotels) {
      try {
        const parsed = JSON.parse(cachedHotels)
        if (parsed.length > 0 && parsed[0].id) {
          return `/owner/room?hotelId=${parsed[0].id}`
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  return '/owner/room'
})
</script>