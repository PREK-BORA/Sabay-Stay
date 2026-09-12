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
    

    <!-- Search Input -->
    <div class="max-w-md">
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Search properties by name or location..."
        class="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-950 transition shadow-xs"
      />
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
    <div v-else-if="filteredHotels.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="hotel in filteredHotels" 
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
            <span class="text-[10px] font-bold text-indigo-950 uppercase tracking-wider block mb-1">{{ hotel.city || hotel.location || 'Unspecified Location' }}</span>
            <h2 class="text-lg font-bold text-gray-900 mb-2">{{ hotel.name }}</h2>
            <p class="text-xs text-gray-500 line-clamp-2 mb-4">{{ hotel.description || 'No description provided.' }}</p>
          </div>
        </div>

        <div class="p-5 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
          <div>
          </div>
          <div class="flex items-center gap-3">
            <button @click="openModal(hotel)" class="text-xs font-bold text-amber-600 hover:underline">
              Edit
            </button>
            <NuxtLink 
              :to="`/owner/room?hotelId=${hotel.id}`" 
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
      <p class="text-gray-500 text-sm mb-4">
        {{ searchQuery ? 'No properties matching your search.' : 'No properties listed yet.' }}
      </p>
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
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: 'owner' })

const { getHotels, addHotel, updateHotel, deleteHotel } = useFirestoreDB()

// 1. Initial State: Read immediately from localStorage if available
const hotels = ref([])
const loading = ref(true)

const searchQuery = ref('')
const showAddModal = ref(false)
const isSubmitting = ref(false)
const editingId = ref(null)

const fallbackImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'
const initialForm = { name: '', city: '', pricePerNight: '', description: '', image: '' }
const form = ref({ ...initialForm })

// Helper to keep localStorage synced
const saveLocalHotels = (data) => {
  if (import.meta.client) {
    localStorage.setItem('sabay_hotels_cache', JSON.stringify(data))
  }
}

// Search Filter
const filteredHotels = computed(() => {
  if (!searchQuery.value.trim()) return hotels.value
  const query = searchQuery.value.toLowerCase()
  return hotels.value.filter(hotel => 
    hotel.name?.toLowerCase().includes(query) ||
    (hotel.city || hotel.location)?.toLowerCase().includes(query)
  )
})

const openModal = (hotelToEdit = null) => {
  if (hotelToEdit) {
    editingId.value = hotelToEdit.id
    form.value = {
      name: hotelToEdit.name || '',
      city: hotelToEdit.city || hotelToEdit.location || '',
      pricePerNight: hotelToEdit.pricePerNight || hotelToEdit.price || '',
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

// ⚡ INSTANT LOAD FROM LOCALSTORAGE
const loadHotels = async () => {
  // Load local cache instantly (0ms delay)
  if (import.meta.client) {
    const cached = localStorage.getItem('sabay_hotels_cache')
    if (cached) {
      try {
        hotels.value = JSON.parse(cached)
        loading.value = false // Hide loading skeleton immediately!
      } catch (e) {
        console.error(e)
      }
    }
  }

  // Sync background data from Firestore
  try {
    const res = await getHotels()
    if (res) {
      hotels.value = res
      saveLocalHotels(res)
    }
  } catch (err) {
    console.error('Failed to sync from Firestore:', err)
  } finally {
    loading.value = false
  }
}

// ⚡ INSTANT SAVE & UPDATE
const handleSubmit = async () => {
  const validImage = form.value.image?.trim() ? form.value.image : fallbackImage

  const payload = {
    name: form.value.name,
    city: form.value.city,
    pricePerNight: Number(form.value.pricePerNight) || 0,
    description: form.value.description || '',
    image: validImage
  }

  if (editingId.value) {
    const targetId = editingId.value
    const index = hotels.value.findIndex(h => h.id === targetId)
    if (index !== -1) {
      hotels.value[index] = { ...hotels.value[index], ...payload }
      saveLocalHotels(hotels.value)
    }
    closeModal()
    
    // Background Firestore Update
    updateHotel(targetId, payload).catch(err => console.error('Firestore update failed:', err))
  } else {
    const tempId = 'temp-' + Date.now()
    const newHotel = { id: tempId, ...payload, rating: 5.0, reviewsCount: 0 }
    hotels.value.unshift(newHotel)
    saveLocalHotels(hotels.value)
    closeModal()

    // Background Firestore Add
    addHotel(payload).then(docRef => {
      if (docRef?.id) {
        const item = hotels.value.find(h => h.id === tempId)
        if (item) item.id = docRef.id
        saveLocalHotels(hotels.value)
      }
    }).catch(err => {
      console.error('Firestore add failed:', err)
      hotels.value = hotels.value.filter(h => h.id !== tempId)
      saveLocalHotels(hotels.value)
    })
  }
}

// ⚡ PERMANENT DELETE (Instantly removed from Local Storage + Firestore)
const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this property?')) return

  const backup = [...hotels.value]
  
  // 1. Delete from UI and localStorage instantly
  hotels.value = hotels.value.filter(h => h.id !== id)
  saveLocalHotels(hotels.value)

  // 2. Delete from Firestore completely
  try {
    await deleteHotel(id)
  } catch (err) {
    console.error('Firestore delete failed:', err)
    alert('Failed to delete on server: ' + err.message)
    hotels.value = backup
    saveLocalHotels(backup)
  }
}

onMounted(() => {
  loadHotels()
})
</script>