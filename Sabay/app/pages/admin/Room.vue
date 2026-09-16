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
  BaggageClaim, 
  BedDouble, 
  MapPin, 
  Pencil, 
  Trash2, 
  X,
  Building,
  UploadCloud,
  ChevronDown
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

export interface Hotel {
  id: string
  name: string
  imageUrl?: string
  image?: string
}

export interface Room {
  id?: string
  hotelId: string
  hotelName: string
  roomNumber: string
  title: string
  type: 'Single' | 'Double' | 'Suite' | 'Deluxe' | 'Villa'
  price: number
  status: 'Available' | 'Occupied' | 'Maintenance'
  floor: number
  beds: string
  size: string
  capacity: number
  amenity: string
  description: string
  image: string
}

const rooms = ref<Room[]>([])
const hotels = ref<Hotel[]>([])
const loading = ref<boolean>(true)
const isModalOpen = ref<boolean>(false)
const isEditing = ref<boolean>(false)
const currentEditId = ref<string | null>(null)

// Filters
const searchQuery = ref<string>('')
const selectedStatus = ref<string>('All Statuses')
const selectedType = ref<string>('All Types')

// Form State
const defaultForm: Omit<Room, 'id'> = {
  hotelId: '',
  hotelName: '',
  roomNumber: '',
  title: '',
  type: 'Deluxe',
  price: 180,
  status: 'Available',
  floor: 1,
  beds: '1 King Bed',
  size: '32m²',
  capacity: 2,
  amenity: 'Free WiFi, Air Conditioning',
  description: 'A spacious room with scenic views.',
  image: ''
}

const formData = ref<Omit<Room, 'id'>>({ ...defaultForm })

let unsubscribeRooms: (() => void) | null = null
let unsubscribeHotels: (() => void) | null = null

const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}

const cleanImageUrl = (url?: string): string => {
  if (!url) return ''
  return url.replace(/[\[\]"']/g, '').trim()
}

// File Upload Handler (Converts File to Base64)
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  if (file.size > 1024 * 1024) {
    alert('Please upload an image smaller than 1MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      formData.value.image = e.target.result as string
    }
  }
  reader.readAsDataURL(file)
}

// Fetch Realtime Hotels from Firestore
const initHotelsListener = () => {
  const db = getDb()
  if (!db) return

  const q = query(collection(db, 'hotels'))
  unsubscribeHotels = onSnapshot(q, (snapshot) => {
    const fetched: Hotel[] = []
    snapshot.forEach((docSnap) => {
      const data = docSnap.data()
      fetched.push({
        id: docSnap.id,
        name: data.name || 'Unnamed Hotel',
        imageUrl: cleanImageUrl(data.imageUrl || data.image || '')
      })
    })
    hotels.value = fetched

    if (fetched.length > 0 && !formData.value.hotelId && fetched[0]) {
      formData.value.hotelId = fetched[0].id
      formData.value.hotelName = fetched[0].name
    }
  })
}

// Fetch Realtime Rooms from Firestore
const initRoomsListener = () => {
  loading.value = true
  const db = getDb()
  if (!db) {
    loading.value = false
    return
  }

  const q = query(collection(db, 'rooms'))
  unsubscribeRooms = onSnapshot(
    q,
    (snapshot) => {
      const fetched: Room[] = []
      snapshot.forEach((docSnap) => {
        const data = docSnap.data()
        fetched.push({
          id: docSnap.id,
          ...data,
          image: cleanImageUrl(data.image)
        } as Room)
      })
      rooms.value = fetched
      loading.value = false
    },
    (error) => {
      console.error('Firestore listener error:', error)
      loading.value = false
    }
  )
}

const handleHotelChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const selected = hotels.value.find((h) => h.id === target.value)
  if (selected) {
    formData.value.hotelId = selected.id
    formData.value.hotelName = selected.name
  }
}

const filteredRooms = computed(() => {
  return rooms.value.filter((room) => {
    const matchesSearch =
      room.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      room.roomNumber?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      room.hotelName?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus =
      selectedStatus.value === 'All Statuses' || room.status === selectedStatus.value

    const matchesType =
      selectedType.value === 'All Types' || room.type === selectedType.value

    return matchesSearch && matchesStatus && matchesType
  })
})

const openAddModal = () => {
  isEditing.value = false
  currentEditId.value = null
  const firstHotel = hotels.value[0]
  formData.value = {
    ...defaultForm,
    hotelId: firstHotel ? firstHotel.id : '',
    hotelName: firstHotel ? firstHotel.name : ''
  }
  isModalOpen.value = true
}

const openEditModal = (room: Room) => {
  if (!room.id) return
  isEditing.value = true
  currentEditId.value = room.id
  formData.value = {
    hotelId: room.hotelId || (hotels.value[0]?.id ?? ''),
    hotelName: room.hotelName || (hotels.value[0]?.name ?? ''),
    roomNumber: room.roomNumber || '',
    title: room.title || '',
    type: room.type || 'Deluxe',
    price: room.price || 0,
    status: room.status || 'Available',
    floor: room.floor || 1,
    beds: room.beds || '',
    size: room.size || '',
    capacity: room.capacity || 1,
    amenity: room.amenity || '',
    description: room.description || '',
    image: cleanImageUrl(room.image)
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveRoom = async () => {
  const db = getDb()
  if (!db) return

  try {
    if (isEditing.value && currentEditId.value) {
      await updateDoc(doc(db, 'rooms', currentEditId.value), {
        ...formData.value
      })
    } else {
      await addDoc(collection(db, 'rooms'), {
        ...formData.value,
        createdAt: serverTimestamp()
      })
    }
    closeModal()
  } catch (error) {
    console.error('Error saving room:', error)
  }
}

const deleteRoomItem = async (id?: string) => {
  if (!id || !confirm('Are you sure you want to delete this room?')) return
  const db = getDb()
  if (!db) return

  try {
    await deleteDoc(doc(db, 'rooms', id))
  } catch (error) {
    console.error('Error deleting room:', error)
  }
}

onMounted(() => {
  initHotelsListener()
  initRoomsListener()
})

onUnmounted(() => {
  if (unsubscribeRooms) unsubscribeRooms()
  if (unsubscribeHotels) unsubscribeHotels()
})
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Room Management</h1>
        <p class="text-slate-500 text-sm mt-1">Manage room inventories, status availability, and pricing in real time.</p>
      </div>
      <button 
        @click="openAddModal"
        class="bg-indigo-900 hover:bg-indigo-950 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition flex items-center gap-2"
      >
        <PlusCircle class="w-4 h-4" />
        Add New Room
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center justify-between relative shadow-sm">
      <Search class="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hidden sm:block" />
      <div class="flex-1 min-w-[240px]">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search by title, room number, or hotel..." 
          class="w-full border border-slate-300 rounded-lg sm:pl-10 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div class="flex gap-3">
        <select v-model="selectedStatus" class="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
          <option>All Statuses</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <select v-model="selectedType" class="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
          <option>All Types</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Suite">Suite</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Villa">Villa</option>
        </select>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div v-if="loading" class="p-8 text-center text-slate-500">Loading rooms...</div>
      <div v-else-if="filteredRooms.length === 0" class="p-8 text-center text-slate-500">No room records found.</div>
      <table v-else class="w-full text-left text-sm border-collapse">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
          <tr>
            <th class="p-4">Room</th>
            <th class="p-4">Hotel</th>
            <th class="p-4">Type</th>
            <th class="p-4">Price / Night</th>
            <th class="p-4">Status</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-slate-700">
          <tr v-for="room in filteredRooms" :key="room.id" class="hover:bg-slate-50 transition">
            <td class="p-4 flex items-center gap-3">
              <img :src="room.image" alt="Room preview" class="w-12 h-12 rounded-lg object-cover bg-slate-100" />
              <div>
                <div class="font-semibold text-slate-900">{{ room.title }}</div>
                <div class="text-xs text-slate-400">Room #{{ room.roomNumber }} • Floor {{ room.floor }}</div>
              </div>
            </td>
            <td class="p-4 font-medium text-slate-800">
              <div class="flex items-center gap-1.5">
                <Building class="w-3.5 h-3.5 text-slate-400" />
                {{ room.hotelName }}
              </div>
            </td>
            <td class="p-4">{{ room.type }}</td>
            <td class="p-4 font-semibold text-slate-900">
              <div class="flex items-center gap-0.5">
                ${{ room.price }}
              </div>
            </td>
            <td class="p-4">
              <span 
                class="px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="{
                  'bg-emerald-100 text-emerald-700': room.status === 'Available',
                  'bg-amber-100 text-amber-700': room.status === 'Occupied',
                  'bg-rose-100 text-rose-700': room.status === 'Maintenance'
                }"
              >
                {{ room.status }}
              </span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button @click="openEditModal(room)" class="text-indigo-600 hover:text-indigo-900 font-medium text-xs flex items-center gap-1">
                <Pencil class="w-3 h-3" />
                Edit
              </button>
              <button @click="deleteRoomItem(room.id)" class="text-rose-600 hover:text-rose-800 font-medium text-xs flex items-center gap-1">
                <Trash2 class="w-3 h-3" />
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Dialog -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div class="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-4 border border-slate-100">
        <div class="flex items-center justify-between pb-3 border-b">
          <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Edit Room' : 'Add New Room' }}</h2>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 font-bold">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveRoom" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Select Hotel</label>
              <select 
                :value="formData.hotelId" 
                @change="handleHotelChange"
                class="w-full border rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              >
                <option v-for="h in hotels" :key="h.id" :value="h.id">
                  {{ h.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Room Title</label>
              <input v-model="formData.title" type="text" class="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" required />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Room Number</label>
              <input v-model="formData.roomNumber" type="text" class="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" required />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Floor</label>
              <input v-model.number="formData.floor" type="number" class="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" required />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Room Type</label>
              <select v-model="formData.type" class="w-full border rounded-lg p-2.5 text-sm bg-white focus:outline-none">
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Price / Night ($)</label>
              <input v-model.number="formData.price" type="number" class="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" required />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select v-model="formData.status" class="w-full border rounded-lg p-2.5 text-sm bg-white focus:outline-none">
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Beds</label>
              <input v-model="formData.beds" type="text" class="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Room Size</label>
              <input v-model="formData.size" type="text" class="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Capacity</label>
              <input v-model.number="formData.capacity" type="number" class="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>

          <!-- File Upload Field -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
              <UploadCloud class="w-4 h-4 text-indigo-500" />
              Upload Room Image
            </label>
            <input 
              type="file" 
              accept="image/*" 
              @change="handleFileUpload" 
              class="w-full px-3 py-2 border rounded-lg bg-slate-50 text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
            />

            <div v-if="formData.image" class="mt-2 flex items-center gap-3">
              <div class="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                <img :src="formData.image" class="w-full h-full object-cover" />
              </div>
              <button type="button" @click="formData.image = ''" class="text-xs text-rose-600 font-medium hover:underline flex items-center gap-1">
                <Trash2 class="w-3 h-3" />
                Remove Image
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Amenities</label>
            <input v-model="formData.amenity" type="text" class="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea v-model="formData.description" rows="2" class="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600 flex items-center gap-1.5">
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 bg-indigo-900 text-white rounded-lg text-sm font-semibold hover:bg-indigo-950 transition flex items-center gap-1.5">
              <BedDouble class="w-4 h-4" />
              {{ isEditing ? 'Update Room' : 'Save Room' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>