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
  rating: number
  status: 'Published' | 'Draft'
  imageUrl?: string
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
  rooms: 0,
  rating: 5.0,
  status: 'Published',
  imageUrl: ''
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
          fetched.push({
            id: docSnap.id,
            ...docSnap.data()
          } as Hotel)
        })
        hotels.value = fetched
        loading.value = false
      },
      (error) => {
        console.error('Firestore snapshot listener error:', error)
        loading.value = false
      }
    )
  } catch (error) {
    console.error('Error binding Firestore listener:', error)
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


const openAddModal = () => {
  isEditing.value = false
  currentEditId.value = null
  formData.value = {
    hotelId: `#HTL-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    location: '',
    region: 'Kampot',
    rooms: 10,
    rating: 4.5,
    status: 'Published',
    imageUrl: ''
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
    rating: hotel.rating,
    status: hotel.status,
    imageUrl: hotel.imageUrl || ''
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
  if (!id || !confirm('Are you sure you want to delete this hotel property?')) return

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
  <div class="space-y-6">
    
    <div class="flex justify-between items-center gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-slate-900">Hotel Management</h1>
        <p class="text-xs text-slate-500 mt-1">Manage and publish luxury hotel properties in real-time.</p>
      </div>
      <button 
        @click="openAddModal"
        class="px-5 py-2.5 bg-indigo-900 text-white font-medium rounded-xl text-sm shadow-sm hover:bg-indigo-800 transition-colors"
      >
        + Add New Hotel
      </button>
    </div>

   
    <div class="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search hotels by name or location..."
        class="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
      <select v-model="selectedStatus" class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none">
        <option value="All Statuses">All Statuses</option>
        <option value="Published">Published</option>
        <option value="Draft">Draft</option>
      </select>
      <select v-model="selectedRegion" class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none">
        <option value="All Regions">All Regions</option>
        <option value="Kampot">Kampot</option>
        <option value="Siem Reap">Siem Reap</option>
        <option value="Koh Kong">Koh Kong</option>
      </select>
    </div>

    <
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
          <tr>
            <th class="p-4">Hotel</th>
            <th class="p-4">Location</th>
            <th class="p-4">Rooms</th>
            <th class="p-4">Rating</th>
            <th class="p-4">Status</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="hotel in filteredHotels" :key="hotel.id" class="hover:bg-slate-50/50 transition-colors">
            <td class="p-4 flex items-center gap-3">
              <div class="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-slate-400 font-bold border border-slate-200">
                <img v-if="hotel.imageUrl" :src="hotel.imageUrl" class="w-full h-full object-cover" />
                <span v-else>{{ hotel.name.charAt(0) }}</span>
              </div>
              <div>
                <p class="font-bold text-slate-800">{{ hotel.name }}</p>
                <p class="text-xs text-slate-400">ID: {{ hotel.hotelId || hotel.id }}</p>
              </div>
            </td>
            <td class="p-4 text-slate-600 font-medium">{{ hotel.location }}</td>
            <td class="p-4 font-semibold text-slate-700">{{ hotel.rooms }} Rooms</td>
            <td class="p-4 font-bold" :class="hotel.rating >= 4.7 ? 'text-amber-500' : 'text-slate-400'">
              ★ {{ Number(hotel.rating || 0).toFixed(1) }}
            </td>
            <td class="p-4">
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold border"
                :class="hotel.status === 'Published'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'"
              >
                {{ hotel.status }}
              </span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button 
                @click="openEditModal(hotel)" 
                class="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button 
                @click="deleteHotel(hotel.id)" 
                class="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
              >
                Delete
              </button>
            </td>
          </tr>

          
          <tr v-if="loading">
            <td colspan="6" class="p-8 text-center text-slate-400 text-xs font-medium">
              Loading hotels from database...
            </td>
          </tr>

         
          <tr v-if="!loading && filteredHotels.length === 0">
            <td colspan="6" class="p-8 text-center text-slate-500 text-xs font-medium">
              No hotels match your filters or database is empty.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    
    <div v-if="isModalOpen" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 w-full max-w-lg border border-slate-100 shadow-2xl space-y-5">
        <div class="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 class="text-lg font-bold text-slate-900">
            {{ isEditing ? 'Edit Hotel Property' : 'Add New Hotel Property' }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
        </div>

        <form @submit.prevent="saveHotel" class="space-y-4 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Hotel Name</label>
            <input v-model="formData.name" type="text" required class="w-full px-3 py-2 border rounded-xl bg-slate-50" placeholder="e.g. Sabay Horizon Lodge" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Location</label>
              <input v-model="formData.location" type="text" required class="w-full px-3 py-2 border rounded-xl bg-slate-50" placeholder="e.g. Siem Reap, Cambodia" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Region</label>
              <select v-model="formData.region" class="w-full px-3 py-2 border rounded-xl bg-slate-50">
                <option value="Kampot">Kampot</option>
                <option value="Siem Reap">Siem Reap</option>
                <option value="Koh Kong">Koh Kong</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Total Rooms</label>
              <input v-model.number="formData.rooms" type="number" required class="w-full px-3 py-2 border rounded-xl bg-slate-50" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Rating</label>
              <input v-model.number="formData.rating" type="number" step="0.1" min="1" max="5" class="w-full px-3 py-2 border rounded-xl bg-slate-50" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Status</label>
              <select v-model="formData.status" class="w-full px-3 py-2 border rounded-xl bg-slate-50">
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Image URL (Optional)</label>
            <input v-model="formData.imageUrl" type="url" class="w-full px-3 py-2 border rounded-xl bg-slate-50" placeholder="https://example.com/image.jpg" />
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 bg-indigo-900 text-white font-semibold rounded-xl hover:bg-indigo-800 transition-colors">
              {{ isEditing ? 'Update Property' : 'Save Property' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>