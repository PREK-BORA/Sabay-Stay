<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useUserData } from '~/composables/useUserData'

definePageMeta({
  layout: 'user',
  middleware: 'auth'
})

const { user } = useAuth()
const { rewardPoints, totalBookings, totalFavorites } = useUserData()
</script>

<template>
  <div class="space-y-8">

    <div>
      <h1 class="text-3xl font-serif font-bold text-slate-900">
        Welcome back, {{ user?.name || 'Traveler' }}.
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        Here is a summary of your recent travels and upcoming adventures.
      </p>
    </div>


    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</p>
          <p class="text-3xl font-bold text-slate-900 mt-3">{{ totalBookings ?? 0 }}</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </div>
      </div>

      
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saved Places</p>
          <p class="text-3xl font-bold text-slate-900 mt-3">{{ totalFavorites ?? 0 }}</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
          </svg>
        </div>
      </div>

     
      <div class="bg-indigo-950 p-6 rounded-2xl text-white shadow-md flex flex-col justify-between">
        <div>
          <p class="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Member Points</p>
          <p class="text-3xl font-bold mt-3">{{ (rewardPoints ?? 0).toLocaleString() }}</p>
        </div>
        <p class="text-xs text-indigo-300 mt-4 font-medium">SabayStay Elite Tier</p>
      </div>
    </div>
  </div>
</template>