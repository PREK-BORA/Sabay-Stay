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
    UploadCloud,
    ImageIcon,
    Building,
    Users,
    DollarSign
  } from 'lucide-vue-next'

  definePageMeta({
    layout: 'admin',
    middleware: 'admin'
  })

  export interface Room {
    id?: string
    roomNumber: string
    hotelName: string
    type: string
    price: number
    capacity: number
    status: 'Available' | 'Booked' | 'Maintenance'
    description: string
    image: string
  }

  const rooms = ref<Room[]>([])
  const loading = ref<boolean>(true)
  const isModalOpen = ref<boolean>(false)
  const isEditing = ref<boolean>(false)
  const currentEditId = ref<string | null>(null)

  // Filters
  const searchQuery = ref<string>('')
  const statusFilter = ref<string>('All')

  // Form State
  const defaultForm: Omit<Room, 'id'> = {
    roomNumber: '',
    hotelName: 'SabayStay Grand Hotel',
    type: 'Deluxe Suite',
    price: 120,
    capacity: 2,
    status: 'Available',
    description: 'A spacious room with modern amenities, a king-size bed, and a city view.',
    image: ''
  }

  const formData = ref<Omit<Room, 'id'>>({ ...defaultForm })

  let unsubscribeRooms: (() => void) | null = null

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
            roomNumber: data.roomNumber || '',
            hotelName: data.hotelName || '',
            type: data.type || '',
            price: data.price || 0,
            capacity: data.capacity || 1,
            status: data.status || 'Available',
            description: data.description || '',
            image: cleanImageUrl(data.image || data.imageUrl || '')
          })
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

  const filteredRooms = computed(() => {
    return rooms.value.filter((room) => {
      const matchesSearch =
        room.roomNumber?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        room.hotelName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        room.type?.toLowerCase().includes(searchQuery.value.toLowerCase())

      const matchesStatus = statusFilter.value === 'All' || room.status === statusFilter.value

      return matchesSearch && matchesStatus
    })
  })

  const openAddModal = () => {
    isEditing.value = false
    currentEditId.value = null
    formData.value = { ...defaultForm }
    isModalOpen.value = true
  }

  const openEditModal = (room: Room) => {
    if (!room.id) return
    isEditing.value = true
    currentEditId.value = room.id
    formData.value = {
      roomNumber: room.roomNumber || '',
      hotelName: room.hotelName || '',
      type: room.type || 'Deluxe Suite',
      price: room.price || 0,
      capacity: room.capacity || 2,
      status: room.status || 'Available',
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

  // Confirmation alert removed here
  const deleteRoomItem = async (id?: string) => {
    if (!id) return
    const db = getDb()
    if (!db) return

    try {
      await deleteDoc(doc(db, 'rooms', id))
    } catch (error) {
      console.error('Error deleting room:', error)
    }
  }

  onMounted(() => {
    initRoomsListener()
  })

  onUnmounted(() => {
    if (unsubscribeRooms) unsubscribeRooms()
  })
  </script>

  <template>
    <div class="space-y-6 max-w-7xl mx-auto pb-12 text-slate-800 bg-white min-h-screen p-6 border border-slate-300 rounded-2xl shadow-xs">
      <!-- Top Header -->
      <div class="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight font-serif">Room Management</h1>
          <p class="text-sm text-slate-500 mt-1">Manage hotel rooms, room types, pricing, capacity, and availability in real time.</p>
        </div>
        <button 
          @click="openAddModal"
          class="flex items-center gap-2 px-5 py-2.5 bg-[#1d1b4b] hover:bg-[#15133c] text-white font-semibold rounded-xl text-sm shadow-xs transition-colors w-fit cursor-pointer"
        >
          <PlusCircle class="w-4 h-4" />
          Add New Room
        </button>
      </div>

      <!-- Filters Bar -->
      <div class="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-300 shadow-sm relative">
        <div class="relative flex-1">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hidden md:block" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search by room number, hotel, or room type..." 
            class="w-full px-4 py-2.5 md:pl-11 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 shadow-inner"
          />
        </div>

        <div class="w-full md:w-48">
          <select 
            v-model="statusFilter"
            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-slate-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <!-- Data Table Container -->
      <div class="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-300 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <th class="py-3.5 px-6">Room / Hotel</th>
                <th class="py-3.5 px-6">Type & Guests</th>
                <th class="py-3.5 px-6">Price / Night</th>
                <th class="py-3.5 px-6">Status</th>
                <th class="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="room in filteredRooms" :key="room.id" class="text-slate-700 hover:bg-slate-50 transition-colors">
                <td class="py-4 px-6 flex items-center gap-3">
                  <div class="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-slate-400 font-bold border border-slate-300 relative">
                    <img v-if="room.image" :src="room.image" class="w-full h-full object-cover" />
                    <ImageIcon v-else class="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <BedDouble class="w-4 h-4 text-[#1d1b4b] inline-block" />
                      Room {{ room.roomNumber }}
                    </p>
                    <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building class="w-3 h-3 text-slate-400" />
                      {{ room.hotelName }}
                    </p>
                  </div>
                </td>
                <td class="py-4 px-6 text-slate-600 font-medium">
                  <div>
                    <span class="font-semibold text-slate-800 block text-xs">{{ room.type }}</span>
                    <div class="flex items-center gap-1 text-slate-500 text-[11px] mt-0.5">
                      <Users class="w-3 h-3 text-slate-400" />
                      Max {{ room.capacity }} {{ room.capacity > 1 ? 'Guests' : 'Guest' }}
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 font-bold text-slate-900">
                  ${{ room.price }} <span class="text-[10px] text-slate-400 font-normal">/ night</span>
                </td>
                <td class="py-4 px-6">
                  <span 
                    :class="{
                      'bg-emerald-50 text-emerald-700 border-emerald-300': room.status === 'Available',
                      'bg-amber-50 text-amber-700 border-amber-300': room.status === 'Booked',
                      'bg-rose-50 text-rose-700 border-rose-300': room.status === 'Maintenance'
                    }"
                    class="px-2.5 py-1 rounded-lg text-xs font-semibold border inline-block"
                  >
                    {{ room.status }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right space-x-2">
                  <button @click="openEditModal(room)" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors border border-slate-300 cursor-pointer">
                    <Pencil class="w-3 h-3 text-[#1d1b4b]" />
                    Edit
                  </button>
                  <button @click="deleteRoomItem(room.id)" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors border border-slate-300 cursor-pointer">
                    <Trash2 class="w-3 h-3" />
                    Delete
                  </button>
                </td>
              </tr>

              <tr v-if="loading">
                <td colspan="5" class="py-16 text-center text-slate-400 text-xs font-medium">
                  <div class="inline-flex items-center gap-2">
                    <div class="w-4 h-4 rounded-full border-2 border-slate-800 border-t-transparent animate-spin"></div>
                    Loading room records...
                  </div>
                </td>
              </tr>

              <tr v-if="!loading && filteredRooms.length === 0">
                <td colspan="5" class="py-16 text-center text-slate-400 text-xs font-medium">
                  No matching room records found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Dialog -->
      <div v-if="isModalOpen" class="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-6 w-full max-w-2xl border border-slate-300 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 text-slate-800">
          <div class="flex justify-between items-center border-b border-slate-300 pb-3">
            <h3 class="text-lg font-bold text-slate-900 font-serif">{{ isEditing ? 'Edit Room' : 'Add New Room' }}</h3>
            <button @click="closeModal" class="text-slate-400 font-bold hover:text-slate-700 transition-colors cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="saveRoom" class="space-y-4 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold mb-1 text-slate-700">Room Number / Identifier</label>
                <input v-model="formData.roomNumber" type="text" placeholder="e.g. 101, A-202" class="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:border-slate-500" required />
              </div>
              <div>
                <label class="block font-semibold mb-1 text-slate-700">Hotel Name</label>
                <input v-model="formData.hotelName" type="text" placeholder="e.g. SabayStay Phnom Penh" class="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:border-slate-500" required />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block font-semibold mb-1 text-slate-700">Room Type</label>
                <select v-model="formData.type" class="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:border-slate-500">
                  <option value="Single Room">Single Room</option>
                  <option value="Double Room">Double Room</option>
                  <option value="Deluxe Suite">Deluxe Suite</option>
                  <option value="Executive Suite">Executive Suite</option>
                  <option value="Family Room">Family Room</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold mb-1 text-slate-700">Price Per Night ($)</label>
                <input v-model.number="formData.price" type="number" min="0" step="1" class="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:border-slate-500" required />
              </div>
              <div>
                <label class="block font-semibold mb-1 text-slate-700">Max Guests</label>
                <input v-model.number="formData.capacity" type="number" min="1" max="10" class="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:border-slate-500" required />
              </div>
            </div>

            <div>
              <label class="block font-semibold mb-1 text-slate-700">Availability Status</label>
              <select v-model="formData.status" class="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:border-slate-500">
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <!-- File Upload Field -->
            <div>
              <label class="flex items-center gap-1.5 font-semibold mb-1 text-slate-700">
                <UploadCloud class="w-4 h-4 text-[#1d1b4b]" />
                Upload Room Image
              </label>
              <input 
                type="file" 
                accept="image/*" 
                @change="handleFileUpload" 
                class="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-[#1d1b4b] hover:file:bg-indigo-100 cursor-pointer" 
              />

              <div v-if="formData.image" class="mt-2 flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-300">
                <div class="w-16 h-16 rounded-lg overflow-hidden border border-slate-300 shrink-0">
                  <img :src="formData.image" class="w-full h-full object-cover" />
                </div>
                <button type="button" @click="formData.image = ''" class="flex items-center gap-1 text-xs text-rose-600 font-medium hover:text-rose-700 cursor-pointer">
                  <Trash2 class="w-3 h-3" />
                  Remove Image
                </button>
              </div>
            </div>

            <div>
              <label class="block font-semibold mb-1 text-slate-700">Room Description & Amenities</label>
              <textarea v-model="formData.description" rows="3" class="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:border-slate-500"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-3 border-t border-slate-300">
              <button type="button" @click="closeModal" class="flex items-center gap-1.5 px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 text-slate-700 transition-colors border border-slate-300 cursor-pointer">
                <X class="w-4 h-4" />
                Cancel
              </button>
              <button type="submit" class="flex items-center gap-1.5 px-5 py-2 bg-[#1d1b4b] hover:bg-[#15133c] text-white font-bold rounded-xl transition-colors cursor-pointer">
                <BedDouble class="w-4 h-4" />
                {{ isEditing ? 'Update Room' : 'Save Room' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>