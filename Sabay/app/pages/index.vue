<template>
  <div class="p-8 text-center">
    <h1 class="text-2xl font-bold mb-4">Welcome to SabayStay</h1>
    <p class="mb-6 text-gray-600">Choose a page to view:</p>
    <div class="flex justify-center gap-4">
      <NuxtLink to="/owner/owner_dashboard" class="px-4 py-2 bg-indigo-950 text-white rounded">
        Owner Dashboard
      </NuxtLink>
      <NuxtLink to="/owner/my_hotels" class="px-4 py-2 bg-indigo-950 text-white rounded">
        My Properties
      </NuxtLink>
      <NuxtLink to="/owner/room" class="px-4 py-2 bg-indigo-950 text-white rounded">
        Rooms
      </NuxtLink>
      <NuxtLink to="/owner/revenue" class="px-4 py-2 bg-indigo-950 text-white rounded">
        Revenue
      </NuxtLink>
      <NuxtLink to="/owner/bookings" class="px-4 py-2 bg-indigo-950 text-white rounded">
        Bookings
      </NuxtLink>
      <NuxtLink to="/owner/earnings" class="px-4 py-2 bg-indigo-950 text-white rounded">
        Earnings
      </NuxtLink>
    </div>
  </div>
</template>