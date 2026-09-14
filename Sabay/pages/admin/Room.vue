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

export interface Room {
  id?: string
  roomNumber: string
  hotelName: string
  type: 'Single' | 'Double' | 'Suite' | 'Deluxe' | 'Villa'
  pricePerNight: number
  status: 'Available' | 'Occupied' | 'Maintenance'
  floor: number
}

const rooms = ref<Room[]>([])
const loading = ref<boolean>(true)
const isModalOpen = ref<boolean>(false)
const isEditing = ref<boolean>(false)
const currentEditId = ref<string | null>(null)

// Filters
const searchQuery = ref<string>('')
const selectedStatus = ref<string>('All Statuses')
const selectedType = ref<string>('All Types')

// Form State
const formData = ref<Omit<Room, 'id'>>({
  roomNumber: '',
  hotelName: 'Sabay Horizon Lodge',
  type: 'Double',
  pricePerNight: 50,
  status: 'Available',
  floor: 1
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
    const q = query(collection(db, 'rooms'))
    unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const fetched: Room[] = []
        snapshot.forEach((docSnap) => {
          fetched.push({
            id: docSnap.id,
            ...docSnap.data()
          } as Room)
        })
        rooms.value = fetched
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

// Filter Logic
const filteredRooms = computed(() => {
  const queryText = searchQuery.value.trim().toLowerCase()

  return rooms.value.filter((room) => {
    const matchesSearch = !queryText || 
      room.roomNumber.toLowerCase().includes(queryText) || 
      room.hotelName.toLowerCase().includes(queryText)
    const matchesStatus = selectedStatus.value === 'All Statuses' || room.status === selectedStatus.value
    const matchesType = selectedType.value === 'All Types' || room.type === selectedType.value

    return matchesSearch && matchesStatus && matchesType
  })
})

// Modal Actions
const openAddModal = () => {
  isEditing.value = false
  currentEditId.value = null
  formData.value = {
    roomNumber: `${Math.floor(100 + Math.random() * 899)}`,
    hotelName: 'Sabay Horizon Lodge',
    type: 'Double',
    pricePerNight: 65,
    status: 'Available',
    floor: 1
  }
  isModalOpen.value = true
}

const openEditModal = (room: Room) => {
  isEditing.value = true
  currentEditId.value = room.id || null
  formData.value = {
    roomNumber: room.roomNumber,
    hotelName: room.hotelName,
    type: room.type,
    pricePerNight: room.pricePerNight,
    status: room.status,
    floor: room.floor
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// 2. Save or Update Room
const saveRoom = async () => {
  const db = getDb()
  if (!db) return

  try {
    if (isEditing.value && currentEditId.value) {
      const docRef = doc(db, 'rooms', currentEditId.value)
      await updateDoc(docRef, {
        ...formData.value,
        updatedAt: serverTimestamp()
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

// 3. Delete Room
const deleteRoom = async (id?: string) => {
  if (!id || !confirm('Are you sure you want to delete this room?')) return

  const db = getDb()
  if (!db) return

  try {
    await deleteDoc(doc(db, 'rooms', id))
  } catch (error) {
    console.error('Error deleting room:', error)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-slate-900">Room Management</h1>
        <p class="text-xs text-slate-500 mt-1">Manage individual rooms, pricing, and live availability statuses.</p>
      </div>
      <button 
        @click="openAddModal"
        class="px-5 py-2.5 bg-indigo-900 text-white font-medium rounded-xl text-sm shadow-sm hover:bg-indigo-800 transition-colors"
      >
        + Add New Room
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by room number or hotel name..."
        class="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
      <select v-model="selectedStatus" class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none">
        <option>All Statuses</option>
        <option>Available</option>
        <option>Occupied</option>
        <option>Maintenance</option>
      </select>
      <select v-model="selectedType" class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none">
        <option>All Types</option>
        <option>Single</option>
        <option>Double</option>
        <option>Suite</option>
        <option>Deluxe</option>
        <option>Villa</option>
      </select>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
          <tr>
            <th class="p-4">Room No.</th>
            <th class="p-4">Hotel</th>
            <th class="p-4">Type</th>
            <th class="p-4">Floor</th>
            <th class="p-4">Price / Night</th>
            <th class="p-4">Status</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="room in filteredRooms" :key="room.id" class="hover:bg-slate-50/50 transition-colors">
            <td class="p-4 font-bold text-slate-900">
              Room {{ room.roomNumber }}
            </td>
            <td class="p-4 text-slate-600 font-medium">{{ room.hotelName }}</td>
            <td class="p-4 text-slate-700 font-semibold">{{ room.type }}</td>
            <td class="p-4 text-slate-500">Floor {{ room.floor }}</td>
            <td class="p-4 font-bold text-slate-900">${{ room.pricePerNight }}</td>
            <td class="p-4">
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold border"
                :class="{
                  'bg-emerald-50 text-emerald-700 border-emerald-200': room.status === 'Available',
                  'bg-amber-50 text-amber-700 border-amber-200': room.status === 'Occupied',
                  'bg-rose-50 text-rose-700 border-rose-200': room.status === 'Maintenance'
                }"
              >
                {{ room.status }}
              </span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button 
                @click="openEditModal(room)" 
                class="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button 
                @click="deleteRoom(room.id)" 
                class="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
              >
                Delete
              </button>
            </td>
          </tr>

          <!-- Loading State -->
          <tr v-if="loading">
            <td colspan="7" class="p-8 text-center text-slate-400 text-xs font-medium">
              Loading rooms from database...
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="!loading && filteredRooms.length === 0">
            <td colspan="7" class="p-8 text-center text-slate-500 text-xs font-medium">
              No rooms match your filters or database is empty.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form for Add/Edit -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 w-full max-w-lg border border-slate-100 shadow-2xl space-y-5">
        <div class="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 class="text-lg font-bold text-slate-900">
            {{ isEditing ? 'Edit Room Details' : 'Add New Room' }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
        </div>

        <form @submit.prevent="saveRoom" class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Room Number</label>
              <input v-model="formData.roomNumber" type="text" required class="w-full px-3 py-2 border rounded-xl bg-slate-50" placeholder="e.g. 101" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Floor</label>
              <input v-model.number="formData.floor" type="number" required min="1" class="w-full px-3 py-2 border rounded-xl bg-slate-50" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Hotel Name</label>
            <input v-model="formData.hotelName" type="text" required class="w-full px-3 py-2 border rounded-xl bg-slate-50" placeholder="e.g. Sabay Horizon Lodge" />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Room Type</label>
              <select v-model="formData.type" class="w-full px-3 py-2 border rounded-xl bg-slate-50">
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Price / Night ($)</label>
              <input v-model.number="formData.pricePerNight" type="number" required min="0" class="w-full px-3 py-2 border rounded-xl bg-slate-50" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Status</label>
              <select v-model="formData.status" class="w-full px-3 py-2 border rounded-xl bg-slate-50">
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 bg-indigo-900 text-white font-semibold rounded-xl hover:bg-indigo-800 transition-colors">
              {{ isEditing ? 'Update Room' : 'Save Room' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>