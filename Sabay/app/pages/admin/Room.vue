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
  BedDouble, 
  Pencil, 
  Trash2, 
  X,
  Building,
  UploadCloud,
  ImageIcon
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
  <div class="space-y-6 max-w-7xl mx-auto pb-12 text-slate-200">
    <!-- Top Header -->
    <div class="bg-[#1a1c23] rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">Room Management</h1>
        <p class="text-sm text-slate-400 mt-1">Manage room inventories, status availability, and pricing in real time.</p>
      </div>
      <button 
        @click="openAddModal"
        class="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-colors w-fit"
      >
        <PlusCircle class="w-4 h-4" />
        Add New Room
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-col md:flex-row md:items-center gap-4 bg-[#1a1c23] p-4 rounded-2xl border border-slate-800 shadow-md relative">
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hidden md:block" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search by title, room number, or hotel..." 
          class="w-full px-4 py-2.5 md:pl-11 bg-[#121318] border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
        />
      </div>
      <select v-model="selectedStatus" class="px-4 py-2.5 bg-[#121318] border border-slate-700/80 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-amber-500">
        <option value="All Statuses">All Statuses</option>
        <option value="Available">Available</option>
        <option value="Occupied">Occupied</option>
        <option value="Maintenance">Maintenance</option>
      </select>
      <select v-model="selectedType" class="px-4 py-2.5 bg-[#121318] border border-slate-700/80 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-amber-500">
        <option value="All Types">All Types</option>
        <option value="Single">Single</option>
        <option value="Double">Double</option>
        <option value="Suite">Suite</option>
        <option value="Deluxe">Deluxe</option>
        <option value="Villa">Villa</option>
      </select>
    </div>

    <!-- Data Table Container -->
    <div class="bg-[#1a1c23] rounded-2xl border border-slate-800 shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-[#121318] border-b border-slate-800 text-slate-400 font-medium text-xs uppercase tracking-wider">
              <th class="py-3.5 px-6">Room</th>
              <th class="py-3.5 px-6">Hotel</th>
              <th class="py-3.5 px-6">Type</th>
              <th class="py-3.5 px-6">Price / Night</th>
              <th class="py-3.5 px-6">Status</th>
              <th class="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-for="room in filteredRooms" :key="room.id" class="text-slate-300 hover:bg-[#222530] transition-colors">
              <td class="py-4 px-6 flex items-center gap-3">
                <div class="w-12 h-12 bg-slate-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-slate-400 font-bold border border-slate-700 relative">
                  <img v-if="room.image" :src="room.image" class="w-full h-full object-cover" />
                  <ImageIcon v-else class="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p class="font-semibold text-white text-sm">{{ room.title }}</p>
                  <p class="text-xs text-slate-400">Room #{{ room.roomNumber }} • Floor {{ room.floor }}</p>
                </div>
              </td>
              <td class="py-4 px-6 text-slate-300 font-medium">
                <div class="flex items-center gap-1.5">
                  <Building class="w-3.5 h-3.5 text-amber-400" />
                  {{ room.hotelName }}
                </div>
              </td>
              <td class="py-4 px-6 text-slate-300">{{ room.type }}</td>
              <td class="py-4 px-6 font-semibold text-slate-200">
                <div class="flex items-center gap-0.5">
                  ${{ room.price }}
                </div>
              </td>
              <td class="py-4 px-6">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold border inline-block text-center"
                  :class="{
                    'bg-emerald-950 text-emerald-400 border-emerald-800/60': room.status === 'Available',
                    'bg-amber-950 text-amber-400 border-amber-800/60': room.status === 'Occupied',
                    'bg-rose-950 text-rose-400 border-rose-800/60': room.status === 'Maintenance'
                  }"
                >
                  {{ room.status }}
                </span>
              </td>
              <td class="py-4 px-6 text-right space-x-2">
                <button @click="openEditModal(room)" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700">
                  <Pencil class="w-3 h-3 text-amber-400" />
                  Edit
                </button>
                <button @click="deleteRoomItem(room.id)" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-400 bg-rose-950/60 rounded-lg hover:bg-rose-900 transition-colors border border-rose-800/60">
                  <Trash2 class="w-3 h-3" />
                  Delete
                </button>
              </td>
            </tr>

            <tr v-if="loading">
              <td colspan="6" class="py-16 text-center text-slate-400 text-xs font-medium">
                <div class="inline-flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
                  Loading room inventories...
                </div>
              </td>
            </tr>

            <tr v-if="!loading && filteredRooms.length === 0">
              <td colspan="6" class="py-16 text-center text-slate-500 text-xs font-medium">
                No matching room records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Dialog -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-[#1a1c23] rounded-3xl p-6 w-full max-w-2xl border border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 text-slate-200">
        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 class="text-lg font-bold text-white">{{ isEditing ? 'Edit Room' : 'Add New Room' }}</h3>
          <button @click="closeModal" class="text-slate-400 font-bold hover:text-white transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveRoom" class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Select Hotel</label>
              <select 
                :value="formData.hotelId" 
                @change="handleHotelChange"
                class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500"
                required
              >
                <option v-for="h in hotels" :key="h.id" :value="h.id">
                  {{ h.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Room Title</label>
              <input v-model="formData.title" type="text" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500" required />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Room Number</label>
              <input v-model="formData.roomNumber" type="text" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500" required />
            </div>
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Floor</label>
              <input v-model.number="formData.floor" type="number" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500" required />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Room Type</label>
              <select v-model="formData.type" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500">
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Price / Night ($)</label>
              <input v-model.number="formData.price" type="number" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500" required />
            </div>
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Status</label>
              <select v-model="formData.status" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500">
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Beds</label>
              <input v-model="formData.beds" type="text" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Room Size</label>
              <input v-model="formData.size" type="text" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label class="block font-semibold mb-1 text-slate-300">Capacity</label>
              <input v-model.number="formData.capacity" type="number" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500" />
            </div>
          </div>

          <!-- File Upload Field -->
          <div>
            <label class="flex items-center gap-1.5 font-semibold mb-1 text-slate-300">
              <UploadCloud class="w-4 h-4 text-amber-400" />
              Upload Room Image
            </label>
            <input 
              type="file" 
              accept="image/*" 
              @change="handleFileUpload" 
              class="w-full px-3 py-2 border border-slate-700 rounded-xl bg-[#121318] text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-950 file:text-amber-400 hover:file:bg-amber-900 cursor-pointer" 
            />

            <div v-if="formData.image" class="mt-2 flex items-center gap-3 bg-[#121318] p-2 rounded-xl border border-slate-800">
              <div class="w-16 h-16 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                <img :src="formData.image" class="w-full h-full object-cover" />
              </div>
              <button type="button" @click="formData.image = ''" class="flex items-center gap-1 text-xs text-rose-400 font-medium hover:text-rose-300">
                <Trash2 class="w-3 h-3" />
                Remove Image
              </button>
            </div>
          </div>

          <div>
            <label class="block font-semibold mb-1 text-slate-300">Amenities</label>
            <input v-model="formData.amenity" type="text" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500" />
          </div>

          <div>
            <label class="block font-semibold mb-1 text-slate-300">Description</label>
            <textarea v-model="formData.description" rows="2" class="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-[#121318] text-slate-200 focus:outline-none focus:border-amber-500"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" @click="closeModal" class="flex items-center gap-1.5 px-4 py-2 bg-slate-800 rounded-xl hover:bg-slate-700 text-slate-300 transition-colors">
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button type="submit" class="flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors">
              <BedDouble class="w-4 h-4" />
              {{ isEditing ? 'Update Room' : 'Save Room' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>