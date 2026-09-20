<script setup lang="ts">
import { useAuth } from '~/composables/auth/useAuth'

const { user, logout } = useAuth()

const navLinks = [
  {
    name: 'Overview',
    path: '/admin',
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z'
  },
  {
    name: 'Hotels',
    path: '/admin/hotels',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-4 4h1m-1 5h1'
  },
  {
    name: 'Rooms',
    path: '/admin/Room',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3'
  },
  {
    name: 'Bookings',
    path: '/admin/bookings',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    name: 'Guests',
    path: '/admin/guests',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    name: 'Analytics',
    path: '/admin/analytics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2'
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  }
]
</script>

<template>
  <div class="min-h-screen bg-[#0b1120] flex text-slate-100 font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#131b2e] border-r border-slate-800 flex flex-col justify-between p-6 fixed h-full z-20 shadow-xl">
      <div>
        <!-- Logo Area -->
        <div class="flex items-center gap-2 mb-8">
          <div class="w-9 h-9 bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-lg rounded-xl shadow-md">
            S
          </div>
          <span class="text-xl font-serif font-bold text-white tracking-wide">
            Sabay<span class="text-amber-400">Stay</span>
          </span>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-1.5">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            exact-active-class="!bg-amber-500 !text-slate-950 font-bold shadow-lg"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-slate-300 hover:bg-slate-800/80 hover:text-white"
          >
            <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" />
            </svg>
            {{ link.name }}
          </NuxtLink>
        </nav>
      </div>

      <!-- Logout Button -->
      <button
        @click="logout"
        class="flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 rounded-xl text-sm font-semibold transition-colors cursor-pointer border border-transparent hover:border-rose-900/50"
      >
        <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 ml-64 flex flex-col min-h-screen bg-[#0b1120]">
      <!-- Top Header -->
      <header class="h-20 bg-[#0b1120]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10 border-b border-slate-800/60">
        <div class="w-80">
          <input
            type="text"
            placeholder="Search..."
            class="w-full bg-[#131b2e] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-600 shadow-inner"
          />
        </div>

        <div class="flex items-center gap-4">
          <!-- Notification Button -->
          <NuxtLink 
            to="/admin/notifications" 
            class="relative w-10 h-10 text-slate-400 hover:text-white bg-[#131b2e] rounded-xl shadow-md border border-slate-800 flex items-center justify-center transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
          </NuxtLink>

          <!-- User Profile Pill -->
          <div class="flex items-center gap-3 bg-[#131b2e] px-3 py-1.5 rounded-full border border-slate-800 shadow-md">
            <div class="text-right pl-2">
              <p class="text-xs font-bold text-white">Admin</p>
              <p class="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">SUPER ADMIN</p>
            </div>
            <div class="w-9 h-9 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-sm border border-slate-700">
              A
            </div>
          </div>
        </div>
      </header>

      <!-- Page Slot -->
      <main class="p-8 flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>