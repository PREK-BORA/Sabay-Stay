<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 lg:flex">
    <aside
      class="border-b border-slate-200 bg-white lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r"
    >
      <div class="flex items-center justify-between px-5 py-5 lg:block lg:px-6">
        <NuxtLink
          to="/dashboard"
          class="font-serif text-xl font-bold text-indigo-950"
        >
          SabayStay
        </NuxtLink>
        <span class="text-xs text-slate-400 lg:mt-1 lg:block"
          >Your travel space</span
        >
      </div>
      <nav
        class="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-1 lg:px-4"
        aria-label="Dashboard navigation"
      >
        <NuxtLink
          to="/dashboard/profile"
          active-class="bg-indigo-50 font-semibold text-indigo-900"
          class="block shrink-0 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-indigo-900"
        >
          Profile
        </NuxtLink>
        <NuxtLink
          to="/dashboard/favorites"
          active-class="bg-indigo-50 font-semibold text-indigo-900"
          class="block shrink-0 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-indigo-900"
        >
          Favorites
        </NuxtLink>
        <NuxtLink
          to="/dashboard/bookings"
          active-class="bg-indigo-50 font-semibold text-indigo-900"
          class="block shrink-0 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-indigo-900"
        >
          Bookings
        </NuxtLink>
        <NuxtLink
          to="/dashboard/reviews"
          active-class="bg-indigo-50 font-semibold text-indigo-900"
          class="block shrink-0 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-indigo-900"
        >
          Reviews
        </NuxtLink>
      </nav>
    </aside>
    <main class="mx-auto w-full max-w-6xl px-5 py-8 lg:px-8">
      <slot />
    </main>
  </div>
</template>
