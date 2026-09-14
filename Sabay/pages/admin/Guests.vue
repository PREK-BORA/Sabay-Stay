<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  type Firestore 
} from 'firebase/firestore'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface GuestUser {
  id: string
  name?: string
  fullName?: string
  email: string
  role?: string
  status?: string
  createdAt?: any
}


const guests = ref<GuestUser[]>([])
const loading = ref<boolean>(true)
const searchQuery = ref<string>('')
const selectedStatus = ref<string>('All Statuses')


const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}


const fetchGuests = async () => {
  loading.value = true
  const db = getDb()
  if (!db) {
    loading.value = false
    return
  }

  try {
    const q = query(collection(db, 'user'))
    const querySnapshot = await getDocs(q)
    const list: GuestUser[] = []

    querySnapshot.forEach((docSnap) => {
      list.push({
        id: docSnap.id,
        ...docSnap.data()
      } as GuestUser)
    })

    guests.value = list
  } catch (error) {
    console.error('Error fetching registered guests:', error)
  } finally {
    loading.value = false
  }
}


const acceptUser = async (userId: string) => {
  const db = getDb()
  if (!db) return

  try {
    const userRef = doc(db, 'user', userId)
    await updateDoc(userRef, { status: 'Approved' })
    await fetchGuests()
  } catch (error) {
    console.error('Error approving user:', error)
  }
}


const blockUser = async (userId: string) => {
  const db = getDb()
  if (!db) return

  try {
    const userRef = doc(db, 'user', userId)
    await updateDoc(userRef, { status: 'Blocked' })
    await fetchGuests()
  } catch (error) {
    console.error('Error blocking user:', error)
  }
}


const filteredGuests = computed(() => {
  return guests.value.filter((guest) => {
    const name = (guest.name || guest.fullName || '').toLowerCase()
    const email = (guest.email || '').toLowerCase()
    const matchesSearch = name.includes(searchQuery.value.toLowerCase()) || email.includes(searchQuery.value.toLowerCase())
    
    const currentStatus = guest.status || 'Active'
    const matchesStatus = selectedStatus.value === 'All Statuses' || currentStatus === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

onMounted(() => {
  fetchGuests()
})
</script>

<template>
  <div class="space-y-6">

    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-serif font-bold text-slate-900">Registered Guests</h1>
        <p class="text-slate-500 text-sm mt-1">Manage all registered accounts and user activity.</p>
      </div>
      <div class="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
        Total: {{ guests.length }} Users
      </div>
    </div>

   
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Search guests by name or email..." 
        class="w-80 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900" 
      />
      <div class="flex items-center gap-3">
        <select 
          v-model="selectedStatus"
          class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none"
        >
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Active</option>
          <option>Blocked</option>
        </select>
        <button 
          @click="fetchGuests" 
          class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>

    
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
          <tr>
            <th class="p-4">User</th>
            <th class="p-4">Role</th>
            <th class="p-4">Status</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="guest in filteredGuests" :key="guest.id" class="hover:bg-slate-50 transition-colors">
            <td class="p-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-sm">
                {{ (guest.name || guest.fullName || guest.email || 'U').charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="font-bold text-slate-800">{{ guest.name || guest.fullName || 'N/A' }}</p>
                <p class="text-xs text-slate-400">{{ guest.email }}</p>
              </div>
            </td>
            <td class="p-4 text-slate-600 font-medium">{{ guest.role || 'Guest' }}</td>
            <td class="p-4">
              <span 
                :class="{
                  'bg-emerald-100 text-emerald-700': guest.status === 'Approved' || guest.status === 'Active',
                  'bg-amber-100 text-amber-700': guest.status === 'Pending',
                  'bg-rose-100 text-rose-700': guest.status === 'Blocked'
                }" 
                class="px-3 py-1 rounded-full text-xs font-semibold"
              >
                {{ guest.status || 'Active' }}
              </span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button 
                v-if="guest.status !== 'Approved'"
                @click="acceptUser(guest.id)" 
                class="text-xs font-semibold text-emerald-600 hover:underline"
              >
                Accept User
              </button>
              <button 
                @click="blockUser(guest.id)" 
                class="text-xs font-semibold text-rose-600 hover:underline"
              >
                Block
              </button>
            </td>
          </tr>

          
          <tr v-if="loading">
            <td colspan="4" class="p-8 text-center text-slate-400">
              Loading users from Firestore...
            </td>
          </tr>

          
          <tr v-if="!loading && filteredGuests.length === 0">
            <td colspan="4" class="p-8 text-center text-slate-400">
              No matching users found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>