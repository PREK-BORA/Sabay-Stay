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
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             Overview
          </NuxtLink>

          <NuxtLink 
            to="/owner/my_hotels" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             My Properties
          </NuxtLink>
          
           <NuxtLink 
            to="/owner/room" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             Rooms
          </NuxtLink>

          <NuxtLink 
            to="/owner/bookings" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             Bookings
          </NuxtLink>

          <NuxtLink 
            to="/owner/revenue" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             Revenue
          </NuxtLink>

          <NuxtLink 
            to="/owner/reviews" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             Reviews
          </NuxtLink>

          <NuxtLink 
            to="/owner/earnings" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            active-class="bg-indigo-950 text-white font-semibold"
          >
             Earnings
          </NuxtLink>
         
        </nav>
      </div>

      <!-- Settings at Bottom -->
      <div>
        <NuxtLink to="/owner/settings" class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-900">
          ⚙️ Settings
        </NuxtLink>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Navbar (Owner Header) -->
      <header class="bg-white border-b border-gray-100 px-8 py-6 h-20 flex justify-between items-center">
        <div class="text-xs text-gray-400 font-medium">
          SabayStay Owner Portal
        </div>
        <div class="flex items-center gap-4">
          <button class="text-sm text-gray-500">🔔</button>
          <div class="flex items-center gap-3 border-l pl-4">
            <div class="w-8 h-8 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold text-xs">
              E
            </div>
            <span class="text-sm font-semibold text-gray-800">Eleanor</span>
          </div>
        </div>
      </header>

      <!-- Page Content Insertion Point -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-100 px-8 py-6 h-20 text-xs text-gray-400 flex justify-between items-center">
        <div>© 2026 SabayStay Premium Travel. All rights reserved.</div>
        <div class="flex gap-4">
          <a href="#" class="hover:underline">Privacy Policy</a>
          <a href="#" class="hover:underline">Terms of Service</a>
          <a href="#" class="hover:underline">Contact Us</a>
        </div>
      </footer>
    </div>
  </div>
</template>