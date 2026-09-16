<script setup lang="ts">
import {
  User,
  Heart,
  CalendarCheck,
  Star,
  Compass,
  ArrowLeft,
  LogOut,
} from "lucide-vue-next";
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 lg:flex">
    <aside
      class="flex flex-col border-b border-slate-200 bg-white lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r"
    >
      <div class="flex items-center justify-between px-5 py-5 lg:block lg:px-6">
        <NuxtLink
          to="/dashboard"
          class="flex items-center gap-2 font-serif text-xl font-bold text-indigo-950"
        >
          <Compass class="h-6 w-6 text-indigo-600" />
          <span>SabayStay</span>
        </NuxtLink>
        <span class="text-xs text-slate-400 lg:mt-1 lg:block"
          >Your travel space</span
        >
      </div>

      <!-- Navigation Links -->
      <nav
        class="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:flex-1 lg:space-y-1 lg:px-4"
        aria-label="Dashboard navigation"
      >
        <NuxtLink
          to="/dashboard/profile"
          active-class="bg-indigo-50 font-semibold text-indigo-900"
          class="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-indigo-900"
        >
          <User class="h-4 w-4 shrink-0" />
          <span>Profile</span>
        </NuxtLink>
        <NuxtLink
          to="/dashboard/favorites"
          active-class="bg-indigo-50 font-semibold text-indigo-900"
          class="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-indigo-900"
        >
          <Heart class="h-4 w-4 shrink-0" />
          <span>Favorites</span>
        </NuxtLink>
        <NuxtLink
          to="/dashboard/bookings"
          active-class="bg-indigo-50 font-semibold text-indigo-900"
          class="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-indigo-900"
        >
          <CalendarCheck class="h-4 w-4 shrink-0" />
          <span>Bookings</span>
        </NuxtLink>
        <NuxtLink
          to="/dashboard/reviews"
          active-class="bg-indigo-50 font-semibold text-indigo-900"
          class="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-indigo-900"
        >
          <Star class="h-4 w-4 shrink-0" />
          <span>Reviews</span>
        </NuxtLink>
      </nav>

      <!-- Exit to Homepage Button -->
      <div class="border-t border-slate-100 p-4">
        <NuxtLink
          to="/"
          class="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft class="h-4 w-4" />
          <span>Exit to Homepage</span>
        </NuxtLink>
      </div>
    </aside>

    <main class="mx-auto w-full max-w-6xl px-5 py-8 lg:px-8">
      <slot />
    </main>
  </div>
</template>