<template>
  <div class="min-h-screen flex bg-gray-50 text-gray-800">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 hidden md:flex">
      <div>
        <!-- Brand Logo -->
        <NuxtLink to="/Owner/owner_dashboard" class="text-2xl font-serif font-bold text-indigo-950 block mb-8">
          SabayStay
        </NuxtLink>

        <!-- Navigation Links -->
        <nav class="space-y-1">
          <NuxtLink 
            to="/Owner/owner_dashboard" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             Overview
          </NuxtLink>

          <NuxtLink 
            to="/Owner/my_hotels" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             My Properties
          </NuxtLink>
          
           <NuxtLink 
            to="/Owner/room" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             Rooms
          </NuxtLink>

          <NuxtLink 
            to="/Owner/bookings" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             Bookings
          </NuxtLink>

          <NuxtLink 
            to="/Owner/revenue" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             Revenue
          </NuxtLink>

          <NuxtLink 
            to="/Owner/reviews" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             Reviews
          </NuxtLink>

          <NuxtLink 
            to="/Owner/earnings" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             Earnings
          </NuxtLink>
         
        </nav>
      </div>
     
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Navbar (Owner Header) -->

      <!-- Page Content Insertion Point -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>