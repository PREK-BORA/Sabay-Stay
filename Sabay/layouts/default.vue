<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { isLoggedIn, user } = useAuth()
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans bg-white text-slate-800">
    <!-- Header Navigation -->
    <header class="border-b border-slate-100 bg-white sticky top-0 z-50">
      
      <!-- Top Action Bar (KHR / MY BOOKING / NOTIFICATIONS / LOG IN / SIGN UP) -->
      <div class="bg-[#7d7d7d] text-white text-xs py-2 px-6">
        <div class="max-w-7xl mx-auto flex justify-end items-center gap-6 font-medium">
          
          <!-- Currency Selector -->
          <div class="flex items-center gap-1 cursor-pointer hover:text-slate-200">
            <span>KHR</span>
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M9.293 12.95l0.707 0.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>

          <!-- My Booking Link -->
          <NuxtLink to="/dashboard/bookings" class="flex items-center gap-1.5 hover:text-slate-200 uppercase tracking-wider">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
            My Booking
          </NuxtLink>

          <!-- Dynamic User Auth Nav -->
          <template v-if="isLoggedIn">
            <!-- Header Notification Link -->
            <NuxtLink to="/dashboard/notifications" class="relative p-1 hover:text-slate-200 flex items-center justify-center" title="Notifications">
              <svg class="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-0 right-0 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            </NuxtLink>

            <NuxtLink 
              :to="user?.role === 'admin' ? '/admin' : '/dashboard'" 
              class="flex items-center gap-2 hover:text-slate-200 uppercase tracking-wider"
            >
              <div class="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden">
                <img v-if="user?.avatar" :src="user.avatar" alt="Avatar" class="w-full h-full object-cover" />
                <span v-else>{{ user?.name?.charAt(0) || 'U' }}</span>
              </div>
              <span>{{ user?.name || 'Account' }}</span>
            </NuxtLink>
          </template>

          <template v-else>
            <!-- Log In -->
            <NuxtLink to="/auth/login" class="flex items-center gap-1.5 hover:text-slate-200 uppercase tracking-wider">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              Log In
            </NuxtLink>

            <!-- Sign Up -->
            <NuxtLink to="/auth/register" class="flex items-center gap-1.5 hover:text-slate-200 uppercase tracking-wider">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Sign Up
            </NuxtLink>
          </template>

        </div>
      </div>

      <!-- Main Navigation Bar -->
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <!-- Logo -->
        <NuxtLink to="/" class="text-2xl font-serif font-bold text-[#1a2b4c] tracking-tight">
          SabayStay
        </NuxtLink>

        <!-- Main Navigation Links -->
        <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <NuxtLink to="/hotels" class="hover:text-slate-900 transition-colors" active-class="text-slate-900 font-semibold">
            Hotels
          </NuxtLink>
          <NuxtLink to="/destinations" class="hover:text-slate-900 transition-colors" active-class="text-slate-900 font-semibold">
            Destinations
          </NuxtLink>
          <NuxtLink to="/experiences" class="hover:text-slate-900 transition-colors" active-class="text-slate-900 font-semibold">
            Experiences
          </NuxtLink>
          <NuxtLink to="/about" class="hover:text-slate-900 transition-colors" active-class="text-slate-900 font-semibold">
            About
          </NuxtLink>
        </nav>

        <!-- BOOK NOW Button -->
        <div class="flex items-center">
          <NuxtLink 
            to="/hotels" 
            class="px-6 py-3 bg-[#b59a85] hover:bg-[#a38772] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
          >
            Book Now
          </NuxtLink>
        </div>

      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>