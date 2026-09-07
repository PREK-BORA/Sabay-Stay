<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header Navigation -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <NuxtLink to="/Owner/my_hotels" class="text-xs text-gray-500 hover:text-gray-900">My Properties</NuxtLink>
          <span class="text-xs text-gray-400">/</span>
          <span class="text-xs text-indigo-950 font-semibold">Villa Azul</span>
        </div>
        <h1 class="text-3xl font-serif font-bold text-gray-900">Room Management</h1>
      </div>
      <button 
        @click="showAddRoomModal = true" 
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
            <th class="py-3 px-6 font-medium">Capacity</th>
            <th class="py-3 px-6 font-medium">Beds</th>
            <th class="py-3 px-6 font-medium">Price / Night</th>
            <th class="py-3 px-6 font-medium">Status</th>
            <th class="py-3 px-6 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="room in rooms" :key="room.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="py-4 px-6 font-medium text-gray-900">
              <div>{{ room.name }}</div>
              <div class="text-xs text-gray-400 font-normal">{{ room.type }}</div>
            </td>
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

    <!-- INLINE ADD ROOM MODAL (Overlays on top of the Room page) -->
    <div 
      v-if="showAddRoomModal" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-lg w-full p-6 space-y-4">
        <div class="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 class="text-lg font-serif font-bold text-gray-900">Add New Room</h3>
          <button @click="showAddRoomModal = false" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form @submit.prevent="handleCreateRoom" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Room Name and Room number</label>
            <input 
              v-model="newRoom.name" 
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
                v-model="newRoom.type" 
                type="text" 
                placeholder="Suite, Villa, Deluxe" 
                required 
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-950" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Capacity (Guests)</label>
              <input 
                v-model="newRoom.capacity" 
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
                v-model="newRoom.beds" 
                type="text" 
                placeholder="1 King Bed" 
                required 
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-950" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Price / Night ($)</label>
              <input 
                v-model="newRoom.price" 
                type="number" 
                placeholder="200" 
                required 
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-950" 
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button 
              type="button" 
              @click="showAddRoomModal = false" 
              class="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting" 
              class="px-5 py-2 text-xs font-bold bg-indigo-950 text-white rounded-xl hover:bg-indigo-900 disabled:opacity-50"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Room' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'owner'
})

const { getRoomsByHotel, addRoom, deleteRoom } = useFirestoreDB()

// Change this to match your actual selected hotel's ID or dynamic query route
const currentHotelId = 'default_hotel_id' 

const rooms = ref([])
const loading = ref(true)
const showAddRoomModal = ref(false)
const isSubmitting = ref(false)

const newRoom = ref({
  name: '',
  type: 'Suite',
  capacity: 2,
  beds: '1 King Bed',
  price: '',
  status: 'Available'
})

const loadRooms = async () => {
  loading.value = true
  try {
    rooms.value = await getRoomsByHotel(currentHotelId)
  } catch (err) {
    console.error('Failed to load rooms:', err)
  } finally {
    loading.value = false
  }
}

const handleCreateRoom = async () => {
  isSubmitting.value = true
  try {
    await addRoom(currentHotelId, {
      ...newRoom.value,
      price: Number(newRoom.price)
    })
    
    // Reset form & hide modal
    newRoom.value = { name: '', type: 'Suite', capacity: 2, beds: '1 King Bed', price: '', status: 'Available' }
    showAddRoomModal.value = false
    
    // Refresh table immediately
    await loadRooms()
  } catch (err) {
    alert('Failed to save room: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteRoom = async (id) => {
  if (confirm('Are you sure you want to delete this room?')) {
    await deleteRoom(id)
    await loadRooms()
  }
}

onMounted(() => {
  loadRooms()
})
</script>