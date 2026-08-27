<template>
  <div class="p-6 bg-gray-50 min-h-screen max-w-3xl mx-auto">
    <div class="mb-6">
      <NuxtLink to="/Owner/room" class="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1">
        ← Back to Rooms
      </NuxtLink>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <h1 class="text-2xl font-serif font-bold text-gray-900 mb-2">Edit Room Details</h1>
      <p class="text-gray-500 text-sm mb-6">Modify price, availability, or capacity for this room.</p>

      <form @submit.prevent="updateRoom" class="space-y-6">
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Room Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            required 
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-950"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Price Per Night ($)</label>
            <input 
              v-model="form.price" 
              type="number" 
              required 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-950"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Status</label>
            <select v-model="form.status" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-950">
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <!-- Form Buttons -->
        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
          <button 
            type="button" 
            @click="deleteRoom" 
            class="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-sm font-medium transition-colors"
          >
            Delete Room
          </button>
          <div class="flex gap-4">
            <NuxtLink to="/Owner/room" class="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium">
              Cancel
            </NuxtLink>
            <button type="submit" class="px-6 py-3 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-sm font-medium shadow-sm">
              Update Room
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'owner'
})

const router = useRouter()

const form = reactive({
  name: 'Ocean Luxury Suite',
  price: 250,
  status: 'Available'
})

const updateRoom = () => {
  alert('Room updated successfully!')
  router.push('/Owner/room')
}

const deleteRoom = () => {
  if (confirm('Are you sure you want to delete this room?')) {
    alert('Room deleted successfully!')
    router.push('/Owner/room')
  }
}
</script>