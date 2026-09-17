<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { collectionGroup, query, where, onSnapshot, type Firestore, type Unsubscribe } from 'firebase/firestore'
import { useRoute, navigateTo, useNuxtApp } from '#imports'
import { useAuth } from '~/composables/useAuth'

const { user, logout } = useAuth()
const isMobileMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)
const isNotificationOpen = ref(false)
const route = useRoute()

const unreadCount = ref<number>(0)
let unsubscribe: Unsubscribe | null = null

watch(() => route.fullPath, () => {
  isMobileMenuOpen.value = false
  isProfileMenuOpen.value = false
  isNotificationOpen.value = false
})

const userName = computed(() => user.value?.name || user.value?.displayName || 'User Account')
const userInitial = computed(() => userName.value.trim().charAt(0).toUpperCase() || 'U')

const dropdownRef = ref<HTMLElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isProfileMenuOpen.value = false
    isNotificationOpen.value = false
  }
}

const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}

const listenUnreadMessages = () => {
  const db = getDb()
  const currentUserId = user.value?.id || user.value?.uid

  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
  }

  if (!db || !currentUserId) {
    unreadCount.value = 0
    return
  }

  try {
    const q = query(
      collectionGroup(db, 'messages'),
      where('receiverId', '==', currentUserId),
      where('read', '==', false)
    )

    unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        unreadCount.value = snapshot.size
      }, 
      (error) => {
        console.warn('CollectionGroup query fallback triggered:', error)
        listenChatDocumentFallback(db, currentUserId)
      }
    )
  } catch (err) {
    console.error('Listener setup error:', err)
    listenChatDocumentFallback(db, currentUserId)
  }
}

const listenChatDocumentFallback = (db: Firestore, currentUserId: string) => {
  try {
    const q = query(
      collectionGroup(db, 'chats'),
      where('userId', '==', currentUserId),
      where('unreadByCustomer', '==', true)
    )
    unsubscribe = onSnapshot(q, (snapshot) => {
      unreadCount.value = snapshot.size
    })
  } catch (e) {
    console.error('Firestore fallback listener error:', e)
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

watch(
  () => user.value, 
  (newUser) => {
    if (newUser) {
      listenUnreadMessages()
    } else {
      unreadCount.value = 0
      if (unsubscribe) unsubscribe()
    }
  }, 
  { immediate: true }
)

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (unsubscribe) unsubscribe()
})

const handleExitDashboard = async () => {
  try {
    isProfileMenuOpen.value = false
    isMobileMenuOpen.value = false
    isNotificationOpen.value = false
    if (logout) {
      await logout()
    }
    await navigateTo('/')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}

const navigationItems = [
  { 
    name: 'Overview', 
    path: '/dashboard', 
    exact: true,
    icon: 'M3.75 3v18h16.5V3H3.75zm15 16.5H5.25V4.5h13.5v15zM7.5 15h2.25v3H7.5v-3zm3.75-4.5h2.25v7.5h-2.25v-7.5zm3.75-3H17.25v10.5h-2.25V7.5z' 
  },
  { 
    name: 'Bookings', 
    path: '/dashboard/bookings', 
    exact: false,
    icon: 'M19.5 21a3 3 0 003-3V6a3 3 0 00-3-3H4.5A3 3 0 001.5 6v12a3 3 0 003 3h15zm-15-1.5a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v12a1.5 1.5 0 01-1.5 1.5H4.5z' 
  },
  { 
    name: 'Messages', 
    path: '/dashboard/message', 
    exact: false,
    hasBadge: true,
    icon: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z' 
  },
  { 
    name: 'Favorites', 
    path: '/dashboard/favorites', 
    exact: false,
    icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' 
  },
  { 
    name: 'Reviews', 
    path: '/dashboard/reviews', 
    exact: false,
    icon: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' 
  },
  { 
    name: 'Profile', 
    path: '/dashboard/profile', 
    exact: false,
    icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' 
  }
]
</script>

<template>
  <div class="min-h-screen bg-slate-50/80 flex flex-col font-sans antialiased text-slate-800">
    <header class="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div class="w-full px-4 sm:px-6 h-20 flex items-center justify-between">
        
        <div class="flex items-center gap-4">
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="Toggle Navigation Menu"
            class="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            <span class="text-xl">☰</span>
          </button>
          
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <div class="w-9 h-9 rounded-xl bg-indigo-950 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <span class="text-2xl font-serif font-bold text-indigo-950 tracking-tight">
              Sabay<span class="text-amber-600">Stay</span>
            </span>
          </NuxtLink>
        </div>

        <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <NuxtLink to="/hotels" class="hover:text-indigo-950 transition-colors">Hotels</NuxtLink>
          <NuxtLink to="/destinations" class="hover:text-indigo-950 transition-colors">Destinations</NuxtLink>
          <NuxtLink to="/experiences" class="hover:text-indigo-950 transition-colors">Experiences</NuxtLink>
          <NuxtLink to="/about" class="hover:text-indigo-950 transition-colors">About</NuxtLink>
        </nav>

        <div class="flex items-center gap-3" ref="dropdownRef">
          <div class="relative flex items-center justify-center">
            <button 
              @click="isNotificationOpen = !isNotificationOpen; isProfileMenuOpen = false"
              class="relative w-10 h-10 text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl border border-slate-200/60 flex items-center justify-center transition-all cursor-pointer focus:outline-none"
              title="Notifications"
            >
              <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              
              <span 
                v-if="unreadCount > 0" 
                class="absolute -top-1 -right-1 z-10 bg-rose-500 text-white font-bold text-[10px] leading-none px-1.5 py-0.5 rounded-full ring-2 ring-white min-w-[18px] text-center shadow-sm"
              >
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </span>
            </button>

            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div 
                v-if="isNotificationOpen" 
                class="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 z-50"
              >
                <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 class="text-xs font-bold text-slate-800">Notifications</h4>
                  <span 
                    :class="unreadCount > 0 ? 'text-rose-600 bg-rose-50' : 'text-slate-400 bg-slate-100'" 
                    class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  >
                    {{ unreadCount }} New
                  </span>
                </div>
                
                <div class="mt-3 space-y-2">
                  <NuxtLink 
                    v-if="unreadCount > 0"
                    to="/dashboard/message" 
                    @click="isNotificationOpen = false"
                    class="block p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs"
                  >
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                      <p class="font-semibold text-slate-800">New Messages</p>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-1 pl-4">You have {{ unreadCount }} unread message(s).</p>
                  </NuxtLink>

                  <div v-else class="py-4 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="relative">
            <button 
              @click="isProfileMenuOpen = !isProfileMenuOpen; isNotificationOpen = false"
              class="flex items-center gap-3 bg-slate-100/80 hover:bg-slate-200/80 transition-colors pl-3 pr-1.5 py-1.5 rounded-full border border-slate-200/60 shadow-inner cursor-pointer"
            >
              <div class="text-right hidden sm:block px-1">
                <span class="text-xs font-semibold text-slate-800 block leading-tight">
                  {{ userName }}
                </span>
                <span class="text-[10px] font-medium text-amber-600 block leading-tight">Genius Level 1</span>
              </div>
              <div class="w-8 h-8 rounded-full bg-indigo-950 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm shrink-0 overflow-hidden">
                <img v-if="user?.avatar || user?.photoURL" :src="user?.avatar || user?.photoURL" alt="User avatar" class="w-full h-full object-cover" />
                <span v-else>{{ userInitial }}</span>
              </div>
            </button>

            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div 
                v-if="isProfileMenuOpen" 
                class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 overflow-hidden"
              >
                <div class="px-4 py-3 border-b border-slate-100 sm:hidden">
                  <p class="text-sm font-bold text-slate-900">{{ userName }}</p>
                  <p class="text-xs text-amber-600 font-semibold mt-0.5">Genius Level 1</p>
                </div>

                <NuxtLink 
                  v-for="item in navigationItems" 
                  :key="item.path"
                  :to="item.path"
                  :exact="item.exact"
                  @click="isProfileMenuOpen = false"
                  class="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-950 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 fill-current text-slate-500" viewBox="0 0 24 24">
                      <path :d="item.icon" />
                    </svg>
                    <span>{{ item.name }}</span>
                  </div>
                  <span 
                    v-if="item.hasBadge && unreadCount > 0" 
                    class="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold"
                  >
                    {{ unreadCount > 99 ? '99+' : unreadCount }}
                  </span>
                </NuxtLink>

                <div class="border-t border-slate-100 mt-1 pt-1">
                  <button 
                    @click="handleExitDashboard()"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                    </svg>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>

        </div>

      </div>
    </header>

    <div class="w-full flex-1 flex flex-col md:flex-row px-4 sm:px-6 py-8 gap-8">
      
      <aside 
        class="w-full md:w-64 shrink-0 transition-all duration-300 ml-0"
        :class="isMobileMenuOpen ? 'block' : 'hidden md:block'"
      >
        <div class="bg-white rounded-3xl border border-slate-200/70 p-4 space-y-1.5 sticky top-28 shadow-sm">
          
          <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-4 py-2">
            User Menu
          </p>

          <NuxtLink 
            v-for="item in navigationItems" 
            :key="item.path"
            :to="item.path" 
            :exact="item.exact"
            @click="isMobileMenuOpen = false"
            class="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-all group"
            exact-active-class="!bg-indigo-950 !text-white !font-semibold shadow-md shadow-indigo-950/20"
            active-class="!bg-indigo-950 !text-white !font-semibold shadow-md shadow-indigo-950/20"
          >
            <div class="flex items-center gap-3.5">
              <svg class="w-5 h-5 fill-current shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path :d="item.icon" />
              </svg>
              <span>{{ item.name }}</span>
            </div>

            <span 
              v-if="item.hasBadge && unreadCount > 0"
              :class="[
                'px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors',
                route.path === item.path 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-rose-100 text-rose-600'
              ]"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </NuxtLink>

          <div class="pt-3 mt-3 border-t border-slate-100">
            <button 
              @click="handleExitDashboard()" 
              class="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer group"
            >
              <svg class="w-5 h-5 fill-current shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </aside>

      <main class="flex-1 min-w-0 rounded-3xl">
        <slot />
      </main>

    </div>
  </div>
</template>