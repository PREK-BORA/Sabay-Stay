<template>
  <div class="p-8 max-w-6xl mx-auto space-y-6">
    <!-- Top Bar -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-serif font-bold text-gray-900">My Properties</h1>
        <p class="text-xs text-gray-500 mt-1">Manage your registered hotels, villas, and apartments.</p>
      </div>
      <button 
        @click="showAddModal = true" 
        class="px-4 py-2.5 text-sm font-medium bg-indigo-950 text-white rounded-xl hover:bg-indigo-900 transition shadow-xs"
      >
        + Add New Property
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16 text-sm text-gray-500">
      Loading properties from Firestore...
    </div>

    <!-- Hotel List Grid -->
    <div v-else-if="hotels.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="hotel in hotels" 
        :key="hotel.id" 
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
      >
        <div>
          <div class="h-44 bg-gray-200 relative">
            <img :src="hotel.image" :alt="hotel.name" class="w-full h-full object-cover" />
            <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-gray-800">
              ★ {{ hotel.rating || '5.0' }}
            </span>
          </div>
          <div class="p-5">
            <span class="text-[10px] font-bold text-indigo-950 uppercase tracking-wider block mb-1">{{ hotel.city }}</span>
            <h2 class="text-lg font-bold text-gray-900 mb-2">{{ hotel.name }}</h2>
            <p class="text-xs text-gray-500 line-clamp-2 mb-4">{{ hotel.description }}</p>
          </div>
        </div>

        <div class="p-5 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
          <div>
            <span class="text-lg font-bold text-indigo-950">${{ hotel.pricePerNight }}</span>
            <span class="text-xs text-gray-500"> / night</span>
          </div>
          <button @click="handleDelete(hotel.id)" class="text-xs font-semibold text-red-600 hover:underline">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
      <p class="text-gray-500 text-sm mb-4">No properties listed yet.</p>
      <button @click="showAddModal = true" class="px-4 py-2 text-xs font-semibold bg-indigo-950 text-white rounded-xl">
        Add Your First Hotel
      </button>
    </div>

    <!-- INLINE MODAL CARD (Overlays on top of My Hotels page) -->
    <div 
      v-if="showAddModal" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h2 class="text-xl font-serif font-bold text-gray-900">Add New Property</h2>
            <p class="text-xs text-gray-500">Fill out details below to publish directly to Firestore.</p>
          </div>
          <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <form @submit.prevent="handleCreateHotel" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Property Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="e.g., Sunset Horizon Villa" 
              required 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950" 
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">City / Location</label>
              <input 
                v-model="form.city" 
                type="text" 
                placeholder="e.g., Siem Reap" 
                required 
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Price / Night ($)</label>
              <input 
                v-model="form.pricePerNight" 
                type="number" 
                placeholder="150" 
                required 
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950" 
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
            <textarea 
              v-model="form.description" 
              rows="3" 
              placeholder="Brief description of property features..." 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Cover Image URL</label>
            <input 
              v-model="form.image" 
              type="url" 
              placeholder="https://images.unsplash.com/..." 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950" 
            />
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button 
              type="button" 
              @click="showAddModal = false" 
              class="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting" 
              class="px-5 py-2 text-xs font-bold bg-indigo-950 text-white rounded-xl hover:bg-indigo-900 transition disabled:opacity-50"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Property' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'owner' })

const { getHotels, addHotel, deleteHotel } = useFirestoreDB()

const hotels = ref([])
const loading = ref(true)
const showAddModal = ref(false)
const isSubmitting = ref(false)

const form = ref({
  name: '',
  city: '',
  pricePerNight: '',
  description: '',
  image: ''
})

const loadHotels = async () => {
  loading.value = true
  try {
    hotels.value = await getHotels()
  } catch (err) {
    console.error('Failed to load hotels:', err)
  } finally {
    loading.value = false
  }
}

const handleCreateHotel = async () => {
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

    // Reset form and close modal overlay
    form.value = { name: '', city: '', pricePerNight: '', description: '', image: '' }
    showAddModal.value = false
    
    // Refresh properties on screen immediately
    await loadHotels()
  } catch (err) {
    alert('Failed to save property: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this property?')) {
    await deleteHotel(id)
    await loadHotels()
  }
}

onMounted(() => {
  loadHotels()
})
</script>