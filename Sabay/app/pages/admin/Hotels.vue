<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  serverTimestamp,
  type Firestore 
} from 'firebase/firestore'
import { definePageMeta, useNuxtApp } from '#imports'
// Import Lucide Icons
import { 
  PlusCircle, 
  Search, 
  MapPin, 
  DollarSign, 
  Star, 
  Pencil, 
  Trash2, 
  X,
  UploadCloud,
  ImageIcon
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

export interface Hotel {
  id?: string
  hotelId: string
  name: string
  location: string
  region: string
  rooms: number
  price: number
  rating: number
  status: 'Published' | 'Draft'
  imageUrl?: string
  heroImage?: string
  image?: string
  amenities?: string[]
}

const hotels = ref<Hotel[]>([])
const loading = ref<boolean>(true)
const isModalOpen = ref<boolean>(false)
const isEditing = ref<boolean>(false)
const currentEditId = ref<string | null>(null)

// Search & Filter State
const searchQuery = ref<string>('')
const selectedStatus = ref<string>('All Statuses')
const selectedRegion = ref<string>('All Regions')

// Form State
const formData = ref<Omit<Hotel, 'id'>>({
  hotelId: '',
  name: '',
  location: '',
  region: 'Kampot',
  rooms: 10,
  price: 100,
  rating: 4.5,
  status: 'Published',
  imageUrl: '',
  amenities: ['Spa & Wellness']
})

let unsubscribe: (() => void) | null = null

const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}

const initFirestoreListener = () => {
  loading.value = true
  const db = getDb()
  if (!db) {
    loading.value = false
    return
  }

  try {
    const q = query(collection(db, 'hotels'))
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: Hotel[] = []
        snapshot.forEach((docSnap) => {
          const data = docSnap.data()
          fetched.push({
            id: docSnap.id,
            ...data,
            // Dynamic fallback chain to catch any property name used in Firestore
            imageUrl: data.imageUrl || data.heroImage || data.image || ''
          } as Hotel)
        })
        hotels.value = fetched
        loading.value = false
      },
      (error) => {
        console.error('Firestore error:', error)
        loading.value = false
      }
    )
  } catch (error) {
    console.error('Error binding listener:', error)
    loading.value = false
  }
}

onMounted(() => {
  initFirestoreListener()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const filteredHotels = computed(() => {
  const queryText = searchQuery.value.trim().toLowerCase()
  return hotels.value.filter((hotel) => {
    const matchesSearch = !queryText || 
      hotel.name.toLowerCase().includes(queryText) || 
      hotel.location.toLowerCase().includes(queryText)
    const matchesStatus = selectedStatus.value === 'All Statuses' || hotel.status === selectedStatus.value
    const matchesRegion = selectedRegion.value === 'All Regions' || hotel.region === selectedRegion.value
    return matchesSearch && matchesStatus && matchesRegion
  })
})

// File Upload Handler (Converts File to Base64 Data URL)
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Limit file size to 1MB to prevent exceeding Firestore document limits
  if (file.size > 1024 * 1024) {
    alert('Please upload an image smaller than 1MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      formData.value.imageUrl = e.target.result as string
    }
  }
  reader.readAsDataURL(file)
}

const openAddModal = () => {
  isEditing.value = false
  currentEditId.value = null
  formData.value = {
    hotelId: `#HTL-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    location: '',
    region: 'Kampot',
    rooms: 10,
    price: 120,
    rating: 4.5,
    status: 'Published',
    imageUrl: '',
    amenities: ['Infinity Pool']
  }
  isModalOpen.value = true
}

const openEditModal = (hotel: Hotel) => {
  isEditing.value = true
  currentEditId.value = hotel.id || null
  formData.value = {
    hotelId: hotel.hotelId || hotel.id || '',
    name: hotel.name,
    location: hotel.location,
    region: hotel.region,
    rooms: hotel.rooms,
    price: hotel.price || 0,
    rating: hotel.rating,
    status: hotel.status,
    imageUrl: hotel.imageUrl || hotel.heroImage || hotel.image || '',
    amenities: hotel.amenities || []
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveHotel = async () => {
  const db = getDb()
  if (!db) return

  try {
    if (isEditing.value && currentEditId.value) {
      const docRef = doc(db, 'hotels', currentEditId.value)
      await updateDoc(docRef, {
        ...formData.value,
        updatedAt: serverTimestamp()
      })
    } else {
      await addDoc(collection(db, 'hotels'), {
        ...formData.value,
        createdAt: serverTimestamp()
      })
    }
    closeModal()
  } catch (error) {
    console.error('Error saving hotel:', error)
  }
}

const deleteHotel = async (id?: string) => {
  if (!id || !confirm('Are you sure you want to delete this property?')) return
  const db = getDb()
  if (!db) return

  try {
    await deleteDoc(doc(db, 'hotels', id))
  } catch (error) {
    console.error('Error deleting hotel:', error)
  }
}
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12 text-slate-200">
    <!-- Top Header -->
    <div class="bg-[#1a1c23] rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">Hotel Management</h1>
        <p class="text-sm text-slate-400 mt-1">Manage and publish luxury hotel properties in real-time.</p>
      </div>
      <button 
        @click="openAddModal"
        class="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-colors w-fit"
      >
        <PlusCircle class="w-4 h-4" />
        Add New Hotel
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-col md:flex-row md:items-center gap-4 bg-[#1a1c23] p-4 rounded-2xl border border-slate-800 shadow-md relative">
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hidden md:block" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search hotels by name or location..."
          class="w-full px-4 py-2.5 md:pl-11 bg-[#121318] border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
        />
      </div>
      <select v-model="selectedStatus" class="px-4 py-2.5 bg-[#121318] border border-slate-700/80 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-amber-500">
        <option value="All Statuses">All Statuses</option>
        <option value="Published">Published</option>
        <option value="Draft">Draft</option>
      </select>
      <select v-model="selectedRegion" class="px-4 py-2.5 bg-[#121318] border border-slate-700/80 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-amber-500">
        <option value="All Regions">All Regions</option>
        <option value="Kampot">Kampot</option>
        <option value="Siem Reap">Siem Reap</option>
        <option value="Koh Kong">Koh Kong</option>
      </select>
    </div>

    <!-- Hotels Table Container -->
    <div class="bg-[#1a1c23] rounded-2xl border border-slate-800 shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-[#121318] border-b border-slate-800 text-slate-400 font-medium text-xs uppercase tracking-wider">
              <th class="py-3.5 px-6">Hotel</th>
              <th class="py-3.5 px-6">Location</th>
              <th class="py-3.5 px-6">Price / Night</th>
              <th class="py-3.5 px-6">Rating</th>
              <th class="py-3.5 px-6">Status</th>
              <th class="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-for="hotel in filteredHotels" :key="hotel.id" class="text-slate-300 hover:bg-[#222530] transition-colors">
              <td class="py-4 px-6 flex items-center gap-3">
                <div class="w-12 h-12 bg-slate-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-slate-400 font-bold border border-slate-700 relative">
                  <img v-if="hotel.imageUrl" :src="hotel.imageUrl" class="w-full h-full object-cover" />
                  <ImageIcon v-else class="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p class="font-semibold text-white text-sm">{{ hotel.name }}</p>
                  <p class="text-xs text-slate-400">ID: {{ hotel.hotelId || hotel.id }}</p>
                </div>
              </td>
              <td class="py-4 px-6 text-slate-300 font-medium">
                <div class="flex items-center gap-1.5">
                  <MapPin class="w-3.5 h-3.5 text-amber-400" />
                  {{ hotel.location }}
                </div>
              </td>
              <td class="py-4 px-6 font-semibold text-slate-200">
                <div class="flex items-center gap-0.5">
                  <DollarSign class="w-3.5 h-3.5 text-slate-400" />
                  {{ hotel.price || 0 }}
                </div>
              </td>
              <td class="py-4 px-6 font-bold text-amber-400">
                <div class="flex items-center gap-1">
                  <Star class="w-4 h-4 fill-amber-400 text-amber-500" />
                  {{ Number(hotel.rating || 0).toFixed(1) }}
                </div>
              </td>
              <td class="py-4 px-6">
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold border inline-block text-center"
                  :class="hotel.status === 'Published' ? 'bg-emerald-950 text-emerald-400 border-emerald-800/60' : 'bg-slate-800 text-slate-400 border-slate-700'"
                >
                  {{ hotel.status }}
                </span>
              </td>
              <td class="py-4 px-6 text-right space-x-2">
                <button @click="openEditModal(hotel)" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700">
                  <Pencil class="w-3 h-3 text-amber-400" />
                  Edit
                </button>
                <button @click="deleteHotel(hotel.id)" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-400 bg-rose-950/60 rounded-lg hover:bg-rose-900 transition-colors border border-rose-800/60">
                  <Trash2 class="w-3 h-3" />
                  Delete
                </button>
              </td>
            </tr>

            <tr v-if="loading">
              <td colspan="6" class="py-16 text-center text-slate-400 text-xs font-medium">
                <div class="inline-flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
                  Loading hotel properties...
                </div>
              </td>
            </tr>

            <tr v-if="!loading && filteredHotels.length === 0">
              <td colspan="6" class="py-16 text-center text-slate-500 text-xs font-medium">
                No matching hotel records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-[#1a1c23] rounded-3xl p-6 w-full max-w-lg border border-slate-800 shadow-2xl space-y-5 text-slate-200">
        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 class="text-lg font-bold text-white">{{ isEditing ? 'Edit Hotel' : 'Add New Hotel' }}</h3>
          <button @click="closeModal" class="text-slate-400 font-bold hover:text-white transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveHotel" class="space-y-4 text-xs">
          <div>
            <label class="block font-semibold mb-1 text-slate-300">Hotel Name</label>
            <input v-model="formData.name" type="text" required class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Location</label>
              <input v-model="formData.location" type="text" required class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Region</label>
              <select v-model="formData.region" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500">
                <option value="Kampot">Kampot</option>
                <option value="Siem Reap">Siem Reap</option>
                <option value="Koh Kong">Koh Kong</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Price / Night ($)</label>
              <input v-model.number="formData.price" type="number" required class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Rating</label>
              <input v-model.number="formData.rating" type="number" step="0.1" min="1" max="5" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Status</label>
              <select v-model="formData.status" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500">
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <!-- File Upload Input & Image Preview -->
          <div>
            <label class="block font-semibold mb-1 flex items-center gap-1.5 text-slate-300">
              <UploadCloud class="w-4 h-4 text-amber-400" />
              Upload Hotel Image
            </label>
            <input 
              type="file" 
              accept="image/*" 
              @change="handleFileUpload" 
              class="w-full px-3 py-2 border border-slate-700 rounded-xl bg-[#121318] text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-950 file:text-amber-400 hover:file:bg-amber-900 cursor-pointer" 
            />

            <!-- Image Preview Area -->
            <div v-if="formData.imageUrl" class="mt-2 flex items-center gap-3 bg-[#121318] p-2 rounded-xl border border-slate-800">
              <div class="w-16 h-16 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                <img :src="formData.imageUrl" class="w-full h-full object-cover" />
              </div>
              <button type="button" @click="formData.imageUrl = ''" class="flex items-center gap-1 text-xs text-rose-400 font-medium hover:text-rose-300">
                <Trash2 class="w-3 h-3" />
                Remove Image
              </button>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" @click="closeModal" class="flex items-center gap-1.5 px-4 py-2 bg-slate-800 rounded-xl hover:bg-slate-700 text-slate-300 transition-colors">
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button type="submit" class="flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors">
              <PlusCircle class="w-4 h-4" />
              Save Property
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>