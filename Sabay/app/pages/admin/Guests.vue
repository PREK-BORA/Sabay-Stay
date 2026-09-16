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
import { definePageMeta, useNuxtApp } from '#imports'
// Import Lucide Icons
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  RefreshCw,
  Mail
} from 'lucide-vue-next'

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
  <div class="space-y-6 p-6">
    <!-- Header Section -->
    <div class="flex justify-between items-center gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-slate-950 md:text-4xl">Registered Guests</h1>
        <p class="text-slate-600 text-base mt-1.5">Manage all registered accounts and user activity.</p>
      </div>
      <div class="flex items-center gap-2.5 text-sm font-semibold bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl shadow-inner border border-indigo-100">
        <Users class="w-5 h-5" />
        Total: {{ guests.length }} Users
      </div>
    </div>

    <!-- Filters and Search Bar -->
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
      <Search class="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hidden md:block" />
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Search guests by name or email..." 
        class="w-full md:w-96 px-4 py-2.5 md:pl-11 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900 transition" 
      />
      <div class="flex items-center gap-3 w-full md:w-auto">
        <select 
          v-model="selectedStatus"
          class="flex-1 md:flex-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-900 transition"
        >
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Active</option>
          <option>Blocked</option>
        </select>
        <button 
          @click="fetchGuests" 
          class="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
          :disabled="loading"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs uppercase tracking-wider">
          <tr>
            <th class="p-5">User</th>
            <th class="p-5">Role</th>
            <th class="p-5">Status</th>
            <th class="p-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-slate-800">
          <tr v-for="guest in filteredGuests" :key="guest.id" class="hover:bg-indigo-50/50 transition-colors">
            <td class="p-5 flex items-center gap-4">
              <!-- Avatar Circle -->
              <div class="w-12 h-12 rounded-full bg-indigo-100 text-indigo-950 flex items-center justify-center font-extrabold text-base shadow-inner border border-indigo-200 shrink-0 uppercase">
                {{ (guest.name || guest.fullName || guest.email || 'U').charAt(0) }}
              </div>
              <!-- User Info -->
              <div class="flex-1">
                <p class="font-bold text-slate-950 text-base">{{ guest.name || guest.fullName || 'N/A' }}</p>
                <div class="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                    <Mail class="w-3.5 h-3.5" />
                    {{ guest.email }}
                </div>
              </div>
            </td>
            <td class="p-5 text-slate-700 font-semibold">{{ guest.role || 'Guest' }}</td>
            <td class="p-5">
              <span 
                :class="{
                  'bg-emerald-100 text-emerald-800 border-emerald-200': guest.status === 'Approved' || guest.status === 'Active',
                  'bg-amber-100 text-amber-800 border-amber-200': guest.status === 'Pending',
                  'bg-rose-100 text-rose-800 border-rose-200': guest.status === 'Blocked'
                }" 
                class="px-3 py-1 rounded-full text-xs font-semibold border"
              >
                {{ guest.status || 'Active' }}
              </span>
            </td>
            <td class="p-5 text-right space-x-2">
              <button 
                v-if="guest.status !== 'Approved'"
                @click="acceptUser(guest.id)" 
                class="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
              >
                <UserCheck class="w-4 h-4" />
                Accept User
              </button>
              <button 
                @click="blockUser(guest.id)" 
                class="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 transition"
              >
                <UserX class="w-4 h-4" />
                Block
              </button>
            </td>
          </tr>

          <!-- Loading State inside Table -->
          <tr v-if="loading">
            <td colspan="4" class="p-10 text-center text-slate-500">
              <div class="flex flex-col items-center gap-3">
                <RefreshCw class="w-8 h-8 animate-spin text-indigo-500" />
                <span>Loading users from Firestore...</span>
              </div>
            </td>
          </tr>

          <!-- Empty State inside Table -->
          <tr v-if="!loading && filteredGuests.length === 0">
            <td colspan="4" class="p-12 text-center text-slate-500">
              <div class="flex flex-col items-center gap-4">
                <Users class="w-12 h-12 text-slate-300" />
                <span class="text-base font-medium">No matching users found.</span>
                <p class="text-sm text-slate-400">Try adjusting your search or filters.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>