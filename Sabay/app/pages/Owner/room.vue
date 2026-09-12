<template>
  <div class="p-6 bg-gray-50 min-h-screen">
   
    <!-- Header Navigation -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <NuxtLink to="/owner/my_hotels" class="text-xs text-gray-500 hover:text-gray-900">My Properties</NuxtLink>
          <span class="text-xs text-gray-400">/</span>
          <span class="text-xs text-indigo-950 font-semibold">Rooms</span>
        </div>
        <h1 class="text-3xl font-serif font-bold text-gray-900">Room Management</h1>

         <!-- Search Input -->
    <div class="max-w-md mb-4 mt-3">
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Search rooms by name or type..."
        class="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-950 transition shadow-xs"
      />
    </div>
      </div>
      
      <button 
        @click="openModal()" 
        class="px-4 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
      >
        + Add New Room
      </button>
    </div>

    <!-- Rooms Table / List -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div v-if="loading" class="text-center py-10 text-sm text-gray-500">
        Loading rooms from Firestore...
      </div>
      <table v-else-if="rooms.length > 0" class="w-full text-left border-collapse text-sm">
        <thead>
          <tr class="bg-gray-50 text-xs text-gray-400 border-b border-gray-100 uppercase tracking-wider">
            <th class="py-3 px-6 font-medium">Room Name</th>
            <th class="py-3 px-6 font-medium">City</th>
            <th class="py-3 px-6 font-medium">Capacity</th>
            <th class="py-3 px-6 font-medium">Beds</th>
            <th class="py-3 px-6 font-medium">Price / Night</th>
            <th class="py-3 px-6 font-medium">Status</th>
            <th class="py-3 px-6 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="room in filteredRooms" :key="room.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="py-4 px-6 font-medium text-gray-900">
              <div>{{ room.name }}</div>
              <div class="text-xs text-gray-400 font-normal">{{ room.type }}</div>
            </td>
            <td class="py-4 px-6 text-gray-600">{{ room.city }}</td>
            <td class="py-4 px-6 text-gray-600">{{ room.capacity }} Guests</td>
            <td class="py-4 px-6 text-gray-600">{{ room.beds }}</td>
            <td class="py-4 px-6 font-semibold text-gray-900">${{ room.price }}</td>
            <td class="py-4 px-6">
              <span :class="room.status === 'Booked' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'" class="px-2.5 py-1 text-xs rounded-full font-medium">
                {{ room.status || 'Available' }}
              </span>
            </td>
            <td class="py-4 px-6 text-right space-x-2">
              <button 
                @click="openModal(room)" 
                class="px-3 py-1.5 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-md font-medium transition-colors"
              >
                Edit
              </button>
              <button 
                @click="handleDeleteRoom(room.id)" 
                class="px-3 py-1.5 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md font-medium transition-colors"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center py-12 text-sm text-gray-500">
        No rooms added yet. Click "+ Add New Room" above to create one.
      </div>
    </div>

    <!-- INLINE ADD / EDIT ROOM MODAL -->
    <div 
      v-if="showAddRoomModal" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-lg w-full p-6 space-y-4">
        <div class="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 class="text-lg font-serif font-bold text-gray-900">
            {{ editingId ? 'Edit Room' : 'Add New Room' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form @submit.prevent="handleSubmitRoom" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Room Name and Room number</label>
            <input 
              v-model="roomForm.name" 
              type="text" 
              placeholder="e.g. Ocean Luxury Suite Room-101" 
              required 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-950" 
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Room Type</label>
              <input 
                v-model="roomForm.type" 
                type="text" 
                placeholder="Suite, Villa, Deluxe" 
                required 
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-950" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Capacity (Guests)</label>
              <input 
                v-model="roomForm.capacity" 
                type="number" 
                placeholder="2" 
                required 
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-950" 
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Beds</label>
              <input 
                v-model="roomForm.beds" 
                type="text" 
                placeholder="1 King Bed" 
                required 
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-950" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Price / Night ($)</label>
              <input 
                v-model="roomForm.price" 
                type="number" 
                placeholder="200" 
                required 
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-950" 
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
            <select 
              v-model="roomForm.status" 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-950"
            >
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
            </select>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button 
              type="button" 
              @click="closeModal" 
              class="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting" 
              class="px-5 py-2 text-xs font-bold bg-indigo-950 text-white rounded-xl hover:bg-indigo-900 disabled:opacity-50"
            >
              {{ isSubmitting ? 'Saving...' : (editingId ? 'Update Room' : 'Save Room') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'

definePageMeta({ layout: 'owner' })

const route = useRoute()
const router = useRouter()
const { getHotels, getRoomsByHotel, addRoom, updateRoom, deleteRoom } = useFirestoreDB()

const rooms = ref([])
const loading = ref(true)
const showAddRoomModal = ref(false)
const isSubmitting = ref(false)
const editingId = ref(null)
const searchQuery = ref('')

const initialForm = {
  name: '',
  type: 'Suite',
  capacity: 2,
  beds: '1 King Bed',
  price: '',
  status: 'Available'
}

const roomForm = ref({ ...initialForm })

// Helper to save to local cache
const saveLocalRooms = (hotelId, data) => {
  if (import.meta.client && hotelId) {
    localStorage.setItem(`sabay_rooms_${hotelId}`, JSON.stringify(data))
  }
}

const openModal = (roomToEdit = null) => {
  if (roomToEdit) {
    editingId.value = roomToEdit.id
    roomForm.value = { ...roomToEdit }
  } else {
    editingId.value = null
    roomForm.value = { ...initialForm }
  }
  showAddRoomModal.value = true
}

const closeModal = () => {
  showAddRoomModal.value = false
  editingId.value = null
  roomForm.value = { ...initialForm }
}

// ⚡ FAST LOAD WITH LOCAL STORAGE + AUTO HOTEL FALLBACK
const loadRooms = async () => {
  let currentHotelId = route.query.hotelId

  // If no hotel ID in URL (e.g. user clicked sidebar link), auto-select first available hotel
  if (!currentHotelId) {
    try {
      // Check cached hotels first
      const cachedHotels = localStorage.getItem('sabay_hotels_cache')
      let hotelsList = cachedHotels ? JSON.parse(cachedHotels) : []

      if (!hotelsList.length) {
        hotelsList = await getHotels()
      }

      if (hotelsList && hotelsList.length > 0) {
        currentHotelId = hotelsList[0].id
        // Update URL query without page reload
        router.replace({ query: { ...route.query, hotelId: currentHotelId } })
      } else {
        rooms.value = []
        loading.value = false
        return
      }
    } catch (e) {
      console.error('Error fetching fallback hotel:', e)
    }
  }

  // Read local cache immediately (0ms delay)
  if (import.meta.client && currentHotelId) {
    const cached = localStorage.getItem(`sabay_rooms_${currentHotelId}`)
    if (cached) {
      try {
        rooms.value = JSON.parse(cached)
        loading.value = false // Hide skeleton immediately
      } catch (e) {
        console.error(e)
      }
    }
  }

  // Sync latest from Firestore in background
  try {
    const res = await getRoomsByHotel(currentHotelId)
    if (res) {
      rooms.value = res
      saveLocalRooms(currentHotelId, res)
    }
  } catch (err) {
    console.error('Failed to load rooms:', err)
  } finally {
    loading.value = false
  }
}

// ⚡ INSTANT SAVE & UPDATE (0ms Modal Delay)
const handleSubmitRoom = async () => {
  const currentHotelId = route.query.hotelId || 'default'

  const payload = {
    name: roomForm.value.name,
    type: roomForm.value.type || 'Suite',
    capacity: Number(roomForm.value.capacity) || 1,
    beds: roomForm.value.beds || '1 Bed',
    price: Number(roomForm.value.price) || 0,
    status: roomForm.value.status || 'Available',
    hotelId: currentHotelId
  }

  if (editingId.value) {
    const targetId = editingId.value
    const index = rooms.value.findIndex(r => r.id === targetId)
    if (index !== -1) {
      rooms.value[index] = { ...rooms.value[index], ...payload }
      saveLocalRooms(currentHotelId, rooms.value)
    }
    closeModal()
    updateRoom(targetId, payload).catch(err => console.error('Firestore update error:', err))
  } else {
    // Optimistic insert
    const tempId = 'temp-' + Date.now()
    const newRoom = { id: tempId, ...payload }
    rooms.value.unshift(newRoom)
    saveLocalRooms(currentHotelId, rooms.value)
    closeModal()

    addRoom(currentHotelId, payload).then(docRef => {
      if (docRef?.id) {
        const item = rooms.value.find(r => r.id === tempId)
        if (item) item.id = docRef.id
        saveLocalRooms(currentHotelId, rooms.value)
      }
    }).catch(err => {
      console.error('Firestore add error:', err)
      rooms.value = rooms.value.filter(r => r.id !== tempId)
      saveLocalRooms(currentHotelId, rooms.value)
      alert('Failed to save room on server')
    })
  }
}

// ⚡ INSTANT DELETE
const handleDeleteRoom = async (id) => {
  if (!confirm('Are you sure you want to delete this room?')) return

  const currentHotelId = route.query.hotelId
  const backup = [...rooms.value]

  rooms.value = rooms.value.filter(r => r.id !== id)
  saveLocalRooms(currentHotelId, rooms.value)

  try {
    await deleteRoom(id)
  } catch (err) {
    console.error('Error deleting room:', err)
    alert('Error deleting room on server: ' + err.message)
    rooms.value = backup
    saveLocalRooms(currentHotelId, backup)
  }
}

const filteredRooms = computed(() => {
  if (!searchQuery.value.trim()) return rooms.value
  const query = searchQuery.value.toLowerCase()
  return rooms.value.filter(room => 
    room.name?.toLowerCase().includes(query) ||
    room.type?.toLowerCase().includes(query)
  )
})

watch(() => route.query.hotelId, () => {
  loadRooms()
})

onMounted(() => {
  loadRooms()
})
</script>