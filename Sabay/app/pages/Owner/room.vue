<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header Navigation -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <NuxtLink to="/Owner/my_hotels" class="text-xs text-gray-500 hover:text-gray-900">My Properties</NuxtLink>
          <span class="text-xs text-gray-400">/</span>
          <span class="text-xs text-indigo-950 font-semibold">Villa Azul</span>
        </div>
        <h1 class="text-3xl font-serif font-bold text-gray-900">Room Management</h1>
      </div>
      <NuxtLink 
        to="/Owner/add_room" 
        class="px-4 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
      >
        + Add New Room
      </NuxtLink>
    </div>

    <!-- Rooms Table / List -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-left border-collapse text-sm">
        <thead>
          <tr class="bg-gray-50 text-xs text-gray-400 border-b border-gray-100 uppercase tracking-wider">
            <th class="py-3 px-6 font-medium">Room Name</th>
            <th class="py-3 px-6 font-medium">Capacity</th>
            <th class="py-3 px-6 font-medium">Beds</th>
            <th class="py-3 px-6 font-medium">Price / Night</th>
            <th class="py-3 px-6 font-medium">Status</th>
            <th class="py-3 px-6 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="room in rooms" :key="room.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="py-4 px-6 font-medium text-gray-900">
              <div>{{ room.name }}</div>
              <div class="text-xs text-gray-400 font-normal">{{ room.type }}</div>
            </td>
            <td class="py-4 px-6 text-gray-600">{{ room.capacity }} Guests</td>
            <td class="py-4 px-6 text-gray-600">{{ room.beds }}</td>
            <td class="py-4 px-6 font-semibold text-gray-900">${{ room.price }}</td>
            <td class="py-4 px-6">
              <span :class="room.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'" class="px-2.5 py-1 text-xs rounded-full font-medium">
                {{ room.status }}
              </span>
            </td>
            <td class="py-4 px-6 text-right space-x-2">
              <NuxtLink 
                :to="`/Owner/edit_room?id=${room.id}`" 
                class="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium"
              >
                Edit
              </NuxtLink>
              <button 
                @click="deleteRoom(room.id)" 
                class="px-3 py-1.5 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md font-medium transition-colors"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'owner'
})

const rooms = ref([
  { id: 101, name: 'Ocean Luxury Suite', type: 'Suite', capacity: 2, beds: '1 King Bed', price: 250, status: 'Available' },
  { id: 102, name: 'Garden Villa Room', type: 'Villa', capacity: 4, beds: '2 Queen Beds', price: 180, status: 'Available' },
  { id: 103, name: 'Deluxe Poolside Room', type: 'Deluxe', capacity: 2, beds: '1 Queen Bed', price: 210, status: 'Booked' }
])

const deleteRoom = (id) => {
  if (confirm('Are you sure you want to delete this room?')) {
    rooms.value = rooms.value.filter(r => r.id !== id)
  }
}
</script>