<template>
  <div class="p-8 max-w-6xl mx-auto space-y-6">
    <!-- Top Bar -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-serif font-bold text-gray-900">My Properties</h1>
        <p class="text-xs text-gray-500 mt-1">Manage your registered hotels, villas, and apartments.</p>
      </div>
      <button 
        @click="openModal()" 
        class="px-4 py-2.5 text-sm font-medium bg-indigo-950 text-white rounded-xl hover:bg-indigo-900 transition shadow-xs"
      >
        + Add New Property
      </button>
    </div>

    <!-- Loading State Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 3" :key="n" class="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs animate-pulse space-y-3">
        <div class="h-44 bg-gray-200 rounded-xl"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- READ: Hotel List Grid -->
    <div v-else-if="hotels.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="hotel in hotels" 
        :key="hotel.id" 
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
      >
        <div>
          <div class="h-44 bg-gray-200 relative">
            <img 
              :src="hotel.image || fallbackImage" 
              :alt="hotel.name" 
              @error="(e) => e.target.src = fallbackImage"
              class="w-full h-full object-cover" 
            />
            <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-gray-800">
              ★ {{ hotel.rating || '5.0' }}
            </span>
          </div>
          <div class="p-5">
            <span class="text-[10px] font-bold text-indigo-950 uppercase tracking-wider block mb-1">{{ hotel.city || 'Unspecified Location' }}</span>
            <h2 class="text-lg font-bold text-gray-900 mb-2">{{ hotel.name }}</h2>
            <p class="text-xs text-gray-500 line-clamp-2 mb-4">{{ hotel.description || 'No description provided.' }}</p>
          </div>
        </div>

        <div class="p-5 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
          <div>
            <span class="text-lg font-bold text-indigo-950">${{ hotel.pricePerNight || 0 }}</span>
            <span class="text-xs text-gray-500"> / night</span>
          </div>
          <div class="flex items-center gap-3">
            <button @click="openModal(hotel)" class="text-xs font-bold text-amber-600 hover:underline">
              Edit
            </button>
            <NuxtLink 
              :to="`/owner/rooms?hotelId=${hotel.id}`" 
              class="text-xs font-bold text-indigo-950 hover:underline"
            >
              Rooms →
            </NuxtLink>
            <!-- DELETE -->
            <button @click="handleDelete(hotel.id)" class="text-xs font-semibold text-red-600 hover:underline">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
      <p class="text-gray-500 text-sm mb-4">No properties listed yet.</p>
      <button @click="openModal()" class="px-4 py-2 text-xs font-semibold bg-indigo-950 text-white rounded-xl">
        Add Your First Hotel
      </button>
    </div>

    <!-- CREATE & UPDATE: Inline Modal Card -->
    <div 
      v-if="showAddModal" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h2 class="text-xl font-serif font-bold text-gray-900">
              {{ editingId ? 'Edit Property' : 'Add New Property' }}
            </h2>
            <p class="text-xs text-gray-500">Fill out details below to update Firestore.</p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
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
                min="0"
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
              @click="closeModal" 
              class="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting" 
              class="px-5 py-2 text-xs font-bold bg-indigo-950 text-white rounded-xl hover:bg-indigo-900 transition disabled:opacity-50"
            >
              {{ isSubmitting ? 'Saving...' : (editingId ? 'Update Property' : 'Save Property') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFirestoreDB } from '~/composables/useFirestoreDB'

definePageMeta({ layout: 'owner' })

// Destructure updateHotel (or updateDoc wrapper) from your composable
const { getHotels, addHotel, updateHotel, deleteHotel } = useFirestoreDB()

const hotels = ref([])
const loading = ref(true)
const showAddModal = ref(false)
const isSubmitting = ref(false)
const editingId = ref(null)

const fallbackImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'

const initialForm = { name: '', city: '', pricePerNight: '', description: '', image: '' }
const form = ref({ ...initialForm })

const openModal = (hotelToEdit = null) => {
  if (hotelToEdit) {
    editingId.value = hotelToEdit.id
    form.value = {
      name: hotelToEdit.name || '',
      city: hotelToEdit.city || '',
      pricePerNight: hotelToEdit.pricePerNight || '',
      description: hotelToEdit.description || '',
      image: hotelToEdit.image || ''
    }
  } else {
    editingId.value = null
    form.value = { ...initialForm }
  }
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  editingId.value = null
  form.value = { ...initialForm }
}

// READ
const loadHotels = async () => {
  loading.value = true
  try {
    const res = await getHotels()
    hotels.value = res || []
  } catch (err) {
    console.error('Failed to load hotels:', err)
  } finally {
    loading.value = false
  }
}

// CREATE & UPDATE
const handleSubmit = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  const payload = {
    name: form.value.name,
    city: form.value.city,
    pricePerNight: Number(form.value.pricePerNight) || 0,
    description: form.value.description || '',
    image: form.value.image || fallbackImage
  }

  try {
    if (editingId.value) {
      // UPDATE
      if (updateHotel) {
        await updateHotel(editingId.value, payload)
      }
      const index = hotels.value.findIndex(h => h.id === editingId.value)
      if (index !== -1) {
        hotels.value[index] = { ...hotels.value[index], ...payload }
      }
    } else {
      // CREATE
      const newHotelData = { ...payload, rating: 5.0, reviewsCount: 0, createdAt: new Date().toISOString() }
      const docRef = await addHotel(newHotelData)
      hotels.value.unshift({
        id: docRef?.id || Date.now().toString(),
        ...newHotelData
      })
    }

    closeModal()
  } catch (err) {
    console.error('Firestore Action Error:', err)
    alert('Failed to process property: ' + (err.message || 'Check connection.'))
  } finally {
    isSubmitting.value = false
  }
}

// DELETE
const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this property?')) {
    try {
      await deleteHotel(id)
      hotels.value = hotels.value.filter(h => h.id !== id)
    } catch (err) {
      alert('Error deleting property: ' + err.message)
    }
  }
}

onMounted(() => {
  loadHotels()
})
</script>