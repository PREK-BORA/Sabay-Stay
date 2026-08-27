<template>
  <div class="p-6 bg-gray-50 min-h-screen max-w-4xl mx-auto">
    <!-- Navigation Back -->
    <div class="mb-6">
      <NuxtLink to="/Owner/my_hotels" class="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1">
        ← Back to Properties
      </NuxtLink>
    </div>

    <!-- Form Container -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <h1 class="text-2xl font-serif font-bold text-gray-900 mb-2">Add New Property</h1>
      <p class="text-gray-500 text-sm mb-6">Fill in the details below to list your property on SabayStay.</p>

      <form @submit.prevent="submitProperty" class="space-y-6">
        <!-- Property Name -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Property Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            required
            placeholder="e.g., Sunset Horizon Villa" 
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-950 transition-colors" 
          />
        </div>

        <!-- Location & Price Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Location / City</label>
            <input 
              v-model="form.location" 
              type="text" 
              required
              placeholder="e.g., Siem Reap, Cambodia" 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-950 transition-colors" 
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Base Price Per Night ($)</label>
            <input 
              v-model="form.price" 
              type="number" 
              required
              placeholder="150" 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-950 transition-colors" 
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Description</label>
          <textarea 
            v-model="form.description" 
            rows="4" 
            required
            placeholder="Describe your property, unique features, surroundings..." 
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-950 transition-colors"
          ></textarea>
        </div>

        <!-- Image URL -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Cover Image URL</label>
          <input 
            v-model="form.image" 
            type="url" 
            required
            placeholder="https://images.unsplash.com/..." 
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-950 transition-colors" 
          />
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <NuxtLink 
            to="/Owner/my_hotels" 
            class="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors"
          >
            Cancel
          </NuxtLink>
          <button 
            type="submit" 
            class="px-6 py-3 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
          >
            Save Property
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
  location: '',
  price: '',
  description: '',
  image: ''
})

const submitProperty = () => {
  // In a live app, you'd save this to your database/Firebase here.
  alert(`Property "${form.name}" successfully created!`)
  router.push('/Owner/my_hotels')
}
</script>