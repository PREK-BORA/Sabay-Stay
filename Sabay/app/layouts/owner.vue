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
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors group"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            <LayoutDashboard class="w-5 h-5 transition-colors group-[.bg-indigo-950]:text-white text-gray-500" />
            Overview
          </NuxtLink>

          <NuxtLink 
            to="/owner/my_hotels" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors group"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            <Building2 class="w-5 h-5 transition-colors group-[.bg-indigo-950]:text-white text-gray-500" />
            My Properties
          </NuxtLink>
          
          <NuxtLink 
            :to="roomTargetLink" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors group"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            <BedDouble class="w-5 h-5 transition-colors group-[.bg-indigo-950]:text-white text-gray-500" />
            Rooms
          </NuxtLink>

          <NuxtLink 
            to="/owner/bookings" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors group"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            <CalendarCheck class="w-5 h-5 transition-colors group-[.bg-indigo-950]:text-white text-gray-500" />
            Bookings
          </NuxtLink>

          <NuxtLink 
            to="/owner/revenue" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors group"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            <TrendingUp class="w-5 h-5 transition-colors group-[.bg-indigo-950]:text-white text-gray-500" />
            Revenue
          </NuxtLink>

          <NuxtLink 
            to="/owner/reviews" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors group"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            <Star class="w-5 h-5 transition-colors group-[.bg-indigo-950]:text-white text-gray-500" />
            Reviews
          </NuxtLink>

          <NuxtLink 
            to="/owner/earnings" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors group"
            active-class="bg-indigo-950 !text-white font-semibold"
          >
            <Wallet class="w-5 h-5 transition-colors group-[.bg-indigo-950]:text-white text-gray-500" />
            Earnings
          </NuxtLink>
        </nav>
      </div>
      <!-- Exit / Logout Button Section -->
      <div class="pt-4 border-t border-gray-100">
        <button 
          @click="handleExit" 
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut class="w-5 h-5 text-red-500" />
          Exit
        </button>
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
import { 
  LayoutDashboard, 
  Building2, 
  BedDouble, 
  CalendarCheck, 
  TrendingUp, 
  Star, 
  Wallet,
  LogOut 
} from 'lucide-vue-next'

const route = useRoute()

// Smart dynamic link for Rooms
const roomTargetLink = computed(() => {
  if (route.query.hotelId) {
    return `/owner/room?hotelId=${route.query.hotelId}`
  }

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