<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user, logout } = useAuth()

const navLinks = [
  { 
    name: 'Overview', 
    path: '/admin', 
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' 
  },
  { 
    name: 'Hotels', 
    path: '/admin/hotels', 
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' 
  },
  { 
    name: 'Rooms', 
    path: '/admin/Room', 
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
  },
  { 
    name: 'Bookings', 
    path: '/admin/bookings', 
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' 
  },
  { 
    name: 'Messages', 
    path: '/admin/messages', 
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' 
  },
  { 
    name: 'Guests', 
    path: '/admin/guests', 
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' 
  },
  { 
    name: 'Reports', 
    path: '/admin/reports', 
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' 
  },
  { 
    name: 'Settings', 
    path: '/admin/settings', 
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' 
  }
]
</script>

<template>
  <div class="min-h-screen bg-[#f4f6f9] flex text-slate-800 font-sans">
    
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6 fixed h-full z-20">
      <div>
        <div class="flex items-center gap-2 mb-8">
          <div class="w-9 h-9 bg-[#1a2b4c] text-white flex items-center justify-center font-bold text-lg rounded-xl shadow-sm">
            S
          </div>
          <span class="text-xl font-serif font-bold text-[#1a2b4c]">
            Sabay<span class="text-amber-500">Stay</span>
          </span>
        </div>

        <nav class="space-y-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            exact-active-class="!bg-[#1b1c3e] !text-white shadow-sm font-semibold"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" />
            </svg>
            {{ link.name }}
          </NuxtLink>
        </nav>
      </div>

      <button
        @click="logout"
        class="flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
      >
        <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </aside>

    <!-- Main Section -->
    <div class="flex-1 ml-64 flex flex-col min-h-screen">
      <header class="h-20 bg-[#f4f6f9] px-8 flex items-center justify-between sticky top-0 z-10">
        <div class="w-80">
          <input
            type="text"
            placeholder="Search..."
            class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-400 shadow-sm"
          />
        </div>

        <div class="flex items-center gap-4">
          <!-- Corrected Notification Button -->
          <NuxtLink 
            to="/admin/messages" 
            class="relative w-10 h-10 text-slate-500 hover:text-slate-700 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full"></span>
          </NuxtLink>

          <div class="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <div class="text-right pl-2">
              <p class="text-xs font-bold text-slate-800">{{ user?.name || 'Administrator' }}</p>
              <p class="text-[10px] text-indigo-600 font-semibold uppercase">Super Admin</p>
            </div>
            <div class="w-9 h-9 rounded-full bg-[#1b1c3e] text-white flex items-center justify-center font-bold text-sm">
              {{ user?.name?.charAt(0) || 'A' }}
            </div>
          </div>
        </div>
      </header>

      <main class="p-8 flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>