<template>
  <div class="p-6 bg-gray-50 min-h-screen max-w-3xl mx-auto">
    <!-- Back Link -->
    <div class="mb-6">
      <NuxtLink to="/Owner/room" class="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1">
        ← Back to Rooms
      </NuxtLink>
    </div>

    <!-- Form Container -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <h1 class="text-2xl font-serif font-bold text-gray-900 mb-2">Add New Room</h1>
      <p class="text-gray-500 text-sm mb-6">Create a room type and set guest capacity and pricing.</p>

      <form @submit.prevent="submitRoom" class="space-y-6">
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Room Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            required 
            placeholder="e.g., Executive Ocean Suite" 
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-950 transition-colors"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Room Type</label>
            <select v-model="form.type" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-950">
              <option value="Single">Single</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Villa">Villa</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Price Per Night ($)</label>
            <input 
              v-model="form.price" 
              type="number" 
              required 
              placeholder="180" 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-950"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Max Capacity (Guests)</label>
            <input 
              v-model="form.capacity" 
              type="number" 
              required 
              placeholder="2" 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-950"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Beds Description</label>
            <input 
              v-model="form.beds" 
              type="text" 
              required 
              placeholder="e.g., 1 King Bed, 1 Sofa" 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-950"
            />
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <NuxtLink to="/Owner/room" class="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium">
            Cancel
          </NuxtLink>
          <button type="submit" class="px-6 py-3 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-sm font-medium shadow-sm">
            Save Room
          </button>
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
  name: '',
  type: 'Deluxe',
  price: '',
  capacity: 2,
  beds: ''
})

const submitRoom = () => {
  alert(`Room "${form.name}" added successfully!`)
  router.push('/Owner/room')
}
</script>