<template>
  <div class="p-8 max-w-5xl mx-auto space-y-6">
    <!-- Breadcrumb & Back -->
    <div class="flex items-center justify-between">
      <NuxtLink to="/owner/my_hotels" class="text-xs font-semibold text-gray-500 hover:text-indigo-950 flex items-center gap-1">
        ← Back to My Properties
      </NuxtLink>
      <div class="flex items-center gap-3">
        <button @click="openEditModal" class="px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 rounded-xl hover:bg-amber-100 transition">
          Edit Property
        </button>
        <button @click="handleDelete" class="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition">
          Delete
        </button>
      </div>
    </div>

    <!-- Hotel Details Header Card -->
    <div v-if="hotel" class="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div class="p-6 space-y-3">
        <div class="flex items-center gap-2 text-xs">
            <span class="font-bold text-gray-700">Rate:</span>
            <span class="font-semibold text-gray-900">★ {{ hotel.rating || '5.0' }}</span>
        </div>

        <div>
            <span class="text-xs font-bold text-gray-700">City: </span>
            <span class="text-xs font-bold text-indigo-950 uppercase tracking-wider">
            {{ hotel.city || hotel.location || 'Location Not Specified' }}
            </span>
            <h1 class="text-3xl font-serif font-bold text-gray-900 mt-1">{{ hotel.name }}</h1>
        </div>

        <p class="text-sm text-gray-600 leading-relaxed max-w-3xl">
            {{ hotel.description || 'No description added yet for this property.' }}
        </p>

        <!-- Quick Action Link to Rooms -->
        <div class="pt-4 border-t border-gray-100 flex justify-between items-center">
            <div>
            <h3 class="text-sm font-bold text-gray-900">Rooms Management</h3>
            <p class="text-xs text-gray-500">Add or modify room types for this property.</p>
            </div>
            <NuxtLink 
            :to="`/owner/room?hotelId=${hotel.id}`" 
            class="px-4 py-2.5 text-xs font-bold bg-indigo-950 text-white rounded-xl hover:bg-indigo-900 transition"
            >
            Manage Rooms →
            </NuxtLink>
        </div>
        </div>
    </div>

    <div v-else class="text-center py-20 bg-white rounded-2xl border border-gray-100">
      <p class="text-gray-500 text-sm">Loading property details...</p>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-xl w-full p-6 space-y-5">
        <div class="flex justify-between items-center border-b border-gray-100 pb-4">
          <h2 class="text-xl font-serif font-bold text-gray-900">Edit Property Details</h2>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form @submit.prevent="handleUpdate" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Property Name</label>
            <input 
              v-model="editForm.name" 
              type="text" 
              required 
              placeholder="e.g. Sunset Boutique Hotel"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950" 
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">City / Location</label>
            <input 
              v-model="editForm.city" 
              type="text" 
              required 
              placeholder="e.g. Siem Reap"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950" 
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
            <textarea 
              v-model="editForm.description" 
              rows="3" 
              placeholder="Tell guests about the vibe, amenities, and what makes this property special..."
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Cover Image URL</label>
            <input 
              v-model="editForm.image" 
              type="url" 
              placeholder="https://example.com/your-hotel-photo.jpg"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-950" 
            />
            <p class="text-[11px] text-gray-400 mt-1">Leave blank to use a default cover image.</p>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button type="button" @click="showEditModal = false" class="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl">Cancel</button>
            <button type="submit" :disabled="isUpdating" class="px-5 py-2 text-xs font-bold bg-indigo-950 text-white rounded-xl">
              {{ isUpdating ? 'Saving...' : 'Update Property' }}
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

const route = useRoute()
const router = useRouter()
const { getHotels, updateHotel, deleteHotel } = useFirestoreDB()

const hotel = ref(null)
const showEditModal = ref(false)
const isUpdating = ref(false)
const fallbackImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'

const editForm = ref({ name: '', city: '', description: '', image: '' })

const loadHotelData = async () => {
  const hotelId = route.params.id

  if (import.meta.client) {
    const cached = localStorage.getItem('sabay_hotels_cache')
    if (cached) {
      const list = JSON.parse(cached)
      const found = list.find(h => h.id === hotelId)
      if (found) hotel.value = found
    }
  }

  const allHotels = await getHotels()
  if (allHotels) {
    const found = allHotels.find(h => h.id === hotelId)
    if (found) {
      hotel.value = found
    }
  }
}

const openEditModal = () => {
  if (!hotel.value) return
  editForm.value = {
    name: hotel.value.name || '',
    city: hotel.value.city || hotel.value.location || '',
    description: hotel.value.description || '',
    image: hotel.value.image || ''
  }
  showEditModal.value = true
}

const handleUpdate = async () => {
  if (isUpdating.value) return
  isUpdating.value = true

  const payload = {
    name: editForm.value.name,
    city: editForm.value.city,
    description: editForm.value.description || '',
    image: editForm.value.image?.trim() ? editForm.value.image : fallbackImage
  }

  hotel.value = { ...hotel.value, ...payload }
  showEditModal.value = false

  // Update Cache
  if (import.meta.client) {
    const cached = localStorage.getItem('sabay_hotels_cache')
    if (cached) {
      const list = JSON.parse(cached)
      const index = list.findIndex(h => h.id === route.params.id)
      if (index !== -1) {
        list[index] = { ...list[index], ...payload }
        localStorage.setItem('sabay_hotels_cache', JSON.stringify(list))
      }
    }
  }

  try {
    await updateHotel(route.params.id, payload)
  } catch (err) {
    console.error(err)
  } finally {
    isUpdating.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this property?')) return

  const hotelId = route.params.id

  // Remove from cache
  if (import.meta.client) {
    const cached = localStorage.getItem('sabay_hotels_cache')
    if (cached) {
      const list = JSON.parse(cached).filter(h => h.id !== hotelId)
      localStorage.setItem('sabay_hotels_cache', JSON.stringify(list))
    }
  }

  try {
    await deleteHotel(hotelId)
    router.push('/owner/my_hotels')
  } catch (err) {
    alert('Failed to delete: ' + err.message)
  }
}

onMounted(() => {
  loadHotelData()
})
</script>