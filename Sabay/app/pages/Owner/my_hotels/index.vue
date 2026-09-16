<template>
  <div class="p-8 max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-gray-900">My Properties</h1>
        <p class="text-xs text-gray-500 mt-1">Manage your registered hotels, villas, and apartments.</p>
      </div>
      <button 
        @click="openModal()" 
        class="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-indigo-950 text-white rounded-xl hover:bg-indigo-900 transition shadow-xs self-start sm:self-auto"
      >
        <Plus class="w-4 h-4" />
        Add New Property
      </button>
    </div>

    <!-- Search Input -->
    <div class="max-w-md relative">
      <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Search properties by name or location..."
        class="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-950 transition shadow-xs"
      />
    </div>

    <!-- Skeleton Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 3" :key="n" class="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs animate-pulse space-y-3">
        <div class="h-44 bg-gray-200 rounded-xl"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Property Grid -->
    <div v-else-if="filteredHotels.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="hotel in filteredHotels" 
        :key="hotel.id" 
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
        @click="navigateToDetail(hotel.id)"
      >
        <div>
          <div class="h-48 bg-gray-100 relative overflow-hidden">
            <img 
              :src="getHotelImageUrl(hotel.image)" 
              :alt="hotel.name"
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            <span class="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 shadow-xs border border-gray-100">
              <Star class="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              {{ hotel.rating || '5.0' }}
            </span>
          </div>
          <div class="p-5">
            <span class="flex items-center gap-1 text-[10px] font-bold text-indigo-950 uppercase tracking-wider mb-1">
              <MapPin class="w-3 h-3 text-indigo-800" />
              City: {{ hotel.city || hotel.location || 'Unspecified Location' }}
            </span>
            <h2 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-900 transition-colors">
              {{ hotel.name }}
            </h2>
            <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {{ hotel.description || 'No description provided.' }}
            </p>
          </div>
        </div>

        <div class="p-5 pt-3 border-t border-gray-50 flex items-center justify-between mt-auto">
          <span class="text-xs font-semibold text-gray-400 group-hover:text-indigo-950 transition-colors">View Details →</span>
          <div class="flex items-center gap-2" @click.stop>
            <button 
              @click="openEditModal(hotel)" 
              class="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition"
            >
              <Pencil class="w-3 h-3" />
              Edit
            </button>
            <button 
              @click="handleDelete(hotel.id)" 
              class="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
            >
              <Trash2 class="w-3 h-3" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col items-center justify-center">
      <Building2 class="w-12 h-12 text-gray-300 mb-3" />
      <p class="text-gray-500 text-sm mb-4 font-medium">
        {{ searchQuery ? 'No properties matching your search.' : 'No properties listed yet.' }}
      </p>
      <button 
        @click="openModal()" 
        class="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-indigo-950 text-white rounded-xl hover:bg-indigo-900 transition"
      >
        <Plus class="w-3.5 h-3.5" />
        Add Your First Hotel
      </button>
    </div>

    <!-- Add Property Modal -->
    <div 
      v-if="showAddModal" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-xl w-full p-6 space-y-5">
        <div class="flex justify-between items-center border-b border-gray-100 pb-4">
          <h2 class="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
            <Building2 class="w-5 h-5 text-indigo-950" />
            Add New Property
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Property Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              required 
              placeholder="e.g. Sunset Boutique Hotel"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-950 transition" 
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
              <MapPin class="w-3.5 h-3.5 text-gray-400" />
              City / Location
            </label>
            <input 
              v-model="form.city" 
              type="text" 
              required 
              placeholder="e.g. Siem Reap"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-950 transition" 
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
            <textarea 
              v-model="form.description" 
              rows="3" 
              placeholder="Tell guests about the vibe, amenities, and what makes this property special..."
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-950 transition"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
              <UploadCloud class="w-3.5 h-3.5 text-gray-400" />
              Cover Image URL
            </label>
            <input 
              v-model="form.image" 
              type="url" 
              placeholder="https://example.com/your-hotel-photo.jpg"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-950 transition" 
            />
            <p class="text-[11px] text-gray-400 mt-1">Leave blank to use a default cover image.</p>
          </div>
          <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" @click="closeModal" class="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
              <X class="w-3.5 h-3.5" />
              Cancel
            </button>
            <button type="submit" :disabled="isSubmitting" class="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-indigo-950 text-white rounded-xl hover:bg-indigo-900 transition disabled:opacity-60 shadow-xs">
              <Loader2 v-if="isSubmitting" class="w-3.5 h-3.5 animate-spin" />
              <Save v-else class="w-3.5 h-3.5" />
              {{ isSubmitting ? 'Saving...' : 'Save Property' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Property Modal -->
    <div 
      v-if="showEditModal" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" 
      @click.self="closeEditModal"
    >
      <div class="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-xl w-full p-6 space-y-5">
        <div class="flex justify-between items-center border-b border-gray-100 pb-4">
          <h2 class="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
            <Pencil class="w-5 h-5 text-indigo-950" />
            Edit Property Details
          </h2>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleUpdate" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Property Name</label>
            <input 
              v-model="editForm.name" 
              type="text" 
              required 
              placeholder="e.g. Sunset Boutique Hotel"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-950 transition" 
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
              <MapPin class="w-3.5 h-3.5 text-gray-400" />
              City / Location
            </label>
            <input 
              v-model="editForm.city" 
              type="text" 
              required 
              placeholder="e.g. Siem Reap"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-950 transition" 
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
            <textarea 
              v-model="editForm.description" 
              rows="3" 
              placeholder="Tell guests about the vibe, amenities, and what makes this property special..."
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-950 transition"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
              <UploadCloud class="w-3.5 h-3.5 text-gray-400" />
              Cover Image URL
            </label>
            <input 
              v-model="editForm.image" 
              type="url" 
              placeholder="https://example.com/your-hotel-photo.jpg"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-950 transition" 
            />
            <p class="text-[11px] text-gray-400 mt-1">Leave blank to use a default cover image.</p>
          </div>
          <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" @click="closeEditModal" class="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
              <X class="w-3.5 h-3.5" />
              Cancel
            </button>
            <button type="submit" :disabled="isUpdating" class="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-indigo-950 text-white rounded-xl hover:bg-indigo-900 transition disabled:opacity-60 shadow-xs">
              <Loader2 v-if="isUpdating" class="w-3.5 h-3.5 animate-spin" />
              <Save v-else class="w-3.5 h-3.5" />
              {{ isUpdating ? 'Saving...' : 'Update Property' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus, Search, Star, MapPin, Pencil, Trash2, Building2, X, UploadCloud, Save, Loader2 } from 'lucide-vue-next'

definePageMeta({ layout: 'owner' })
const router = useRouter()
const { getHotels, addHotel, updateHotel, deleteHotel } = useFirestoreDB()

const hotels = ref([])
const loading = ref(true)
const searchQuery = ref('')

const showAddModal = ref(false)
const isSubmitting = ref(false)

const showEditModal = ref(false)
const isUpdating = ref(false)
const editingId = ref(null)
const editForm = ref({ name: '', city: '', description: '', image: '' })

const fallbackImageUrl = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'
const initialForm = { name: '', city: '', description: '', image: '' }
const form = ref({ ...initialForm })

const getHotelImageUrl = (imageUrl) => {
  if (imageUrl?.trim()) {
    return imageUrl
  }
  return fallbackImageUrl
}

const navigateToDetail = (id) => {
  router.push(`/owner/my_hotels/${id}`)
}

const saveLocalHotels = (data) => {
  if (import.meta.client) {
    localStorage.setItem('sabay_hotels_cache', JSON.stringify(data))
  }
}

const filteredHotels = computed(() => {
  if (!searchQuery.value.trim()) return hotels.value
  const query = searchQuery.value.toLowerCase()
  return hotels.value.filter(h => 
    h.name?.toLowerCase().includes(query) || (h.city || h.location)?.toLowerCase().includes(query)
  )
})

const openModal = () => {
  form.value = { ...initialForm }
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
}

const openEditModal = (hotel) => {
  editingId.value = hotel.id
  editForm.value = {
    name: hotel.name || '',
    city: hotel.city || hotel.location || '',
    description: hotel.description || '',
    image: hotel.image || ''
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingId.value = null
}

const loadHotels = async () => {
  if (import.meta.client) {
    const cached = localStorage.getItem('sabay_hotels_cache')
    if (cached) {
      try {
        hotels.value = JSON.parse(cached)
        loading.value = false
      } catch (e) { 
        console.error(e) 
      }
    }
  }
  try {
    const res = await getHotels()
    if (res) {
      hotels.value = res
      saveLocalHotels(res)
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleUpdate = async () => {
  if (isUpdating.value || !editingId.value) return
  isUpdating.value = true

  const payload = {
    name: editForm.value.name,
    city: editForm.value.city,
    description: editForm.value.description || '',
    image: editForm.value.image?.trim() ? editForm.value.image : ''
  }

  const idx = hotels.value.findIndex(h => h.id === editingId.value)
  if (idx !== -1) {
    hotels.value[idx] = { ...hotels.value[idx], ...payload }
    saveLocalHotels(hotels.value)
  }

  const idToUpdate = editingId.value
  closeEditModal()

  try {
    await updateHotel(idToUpdate, payload)
  } catch (err) {
    console.error(err)
  } finally {
    isUpdating.value = false
  }
}

const handleDelete = async (hotelId) => {
  if (!confirm('Are you sure you want to delete this property?')) return

  try {
    await deleteHotel(hotelId)

    hotels.value = hotels.value.filter(h => h.id !== hotelId)
    saveLocalHotels(hotels.value)
  } catch (err) {
    alert('Failed to delete: ' + err.message)
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  const payload = {
    name: form.value.name,
    city: form.value.city,
    description: form.value.description || '',
    image: form.value.image?.trim() ? form.value.image : ''
  }

  const tempId = 'temp-' + Date.now()
  const newHotel = { id: tempId, ...payload, rating: 5.0 }
  hotels.value.unshift(newHotel)
  saveLocalHotels(hotels.value)
  closeModal()

  try {
    const docRef = await addHotel(payload)
    if (docRef?.id) {
      const item = hotels.value.find(h => h.id === tempId)
      if (item) item.id = docRef.id
      saveLocalHotels(hotels.value)
    }
  } catch (e) {
    console.error(e)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => { 
  loadHotels() 
})
</script>