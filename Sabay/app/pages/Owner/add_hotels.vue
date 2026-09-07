<template>
  <div class="p-8 max-w-4xl mx-auto">
    <NuxtLink to="/Owner/my_hotels" class="text-sm text-gray-500 hover:text-gray-800 mb-6 inline-block">
      ← Back to Properties
    </NuxtLink>

    <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
      <div>
        <h1 class="text-2xl font-serif font-bold text-gray-900">Add New Property</h1>
        <p class="text-xs text-gray-500 mt-1">Fill in the details below to list your property on SabayStay.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Property Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            placeholder="e.g., Sunset Horizon Villa" 
            required 
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-950" 
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Location / City</label>
            <input 
              v-model="form.city" 
              type="text" 
              placeholder="e.g., Siem Reap, Cambodia" 
              required 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-950" 
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Base Price Per Night ($)</label>
            <input 
              v-model="form.pricePerNight" 
              type="number" 
              placeholder="150" 
              required 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-950" 
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
          <textarea 
            v-model="form.description" 
            rows="4" 
            placeholder="Describe your property, unique features, surroundings..." 
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-950"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Cover Image URL</label>
          <input 
            v-model="form.image" 
            type="url" 
            placeholder="https://images.unsplash.com/..." 
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-950" 
          />
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <NuxtLink to="/Owner/my_hotels" class="px-5 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
            Cancel
          </NuxtLink>
          <button 
            type="submit" 
            :disabled="isSubmitting" 
            class="px-6 py-2.5 text-xs font-bold bg-indigo-950 text-white rounded-xl hover:bg-indigo-900 transition disabled:opacity-50"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Property' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'owner' })

const router = useRouter()
const { addHotel } = useFirestoreDB()

const isSubmitting = ref(false)
const form = ref({
  name: '',
  city: '',
  pricePerNight: '',
  description: '',
  image: ''
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const defaultImage = form.value.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'
    
    await addHotel({
      name: form.value.name,
      city: form.value.city,
      pricePerNight: Number(form.value.pricePerNight),
      description: form.value.description,
      image: defaultImage,
      rating: 5.0,
      reviewsCount: 0
    })

    router.push('/Owner/my_hotels')
  } catch (err) {
    console.error('Error saving hotel:', err)
    alert('Failed to save property. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>