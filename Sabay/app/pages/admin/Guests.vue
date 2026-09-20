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
  avatar?: string
  photoURL?: string
  image?: string
  profileImage?: string
  photo?: string
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
  <ClientOnly>
    <div class="space-y-6 max-w-7xl mx-auto pb-12 text-slate-200">
      <!-- Header Section -->
      <div class="bg-[#1a1c23] rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Registered Users</h1>
          <p class="text-sm text-slate-400 mt-1">Manage all registered accounts and user activity.</p>
        </div>
        <div class="flex items-center gap-2 text-xs bg-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl shadow-md w-fit">
          <Users class="w-4 h-4" />
          Total: {{ guests.length }} Users
        </div>
      </div>

      <!-- Filters and Search Bar -->
      <div class="flex flex-col md:flex-row md:items-center gap-4 bg-[#1a1c23] p-4 rounded-2xl border border-slate-800 shadow-md">
        <div class="relative flex-1">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search guests by name or email..." 
            class="w-full pl-11 pr-4 py-2.5 bg-[#121318] border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner" 
          />
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <select 
            v-model="selectedStatus"
            class="px-4 py-2.5 bg-[#121318] border border-slate-700/80 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Active</option>
            <option>Blocked</option>
          </select>
          <button 
            @click="fetchGuests" 
            class="flex items-center gap-2 px-4 py-2.5 bg-[#121318] hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            :disabled="loading"
          >
            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" />
            Refresh
          </button>
        </div>
      </div>

      <!-- Users Table Wrapper -->
      <div class="bg-[#1a1c23] rounded-2xl border border-slate-800 shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-150">
            <thead>
              <tr class="bg-[#121318] border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                <th class="py-3.5 px-6">User</th>
                <th class="py-3.5 px-6">Role</th>
                <th class="py-3.5 px-6">Status</th>
                <th class="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-xs">
              <tr v-for="guest in filteredGuests" :key="guest.id" class="hover:bg-[#222530] transition-colors">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <!-- Avatar Circle or Profile Image -->
                    <div class="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center border border-slate-700">
                      <img 
                        v-if="guest.avatar || guest.photoURL || guest.image || guest.profileImage || guest.photo" 
                        :src="guest.avatar || guest.photoURL || guest.image || guest.profileImage || guest.photo" 
                        alt="Guest Avatar" 
                        class="w-full h-full object-cover" 
                      />
                      <span v-else class="text-xs font-bold text-amber-400 uppercase">
                        {{ (guest.name || guest.fullName || guest.email || 'U').charAt(0) }}
                      </span>
                    </div>
                    <!-- User Info -->
                    <div>
                      <p class="font-bold text-white">{{ guest.name || guest.fullName || 'N/A' }}</p>
                      <div class="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
                        <Mail class="w-3 h-3" />
                        {{ guest.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 text-slate-300 font-medium">{{ guest.role || 'Guest' }}</td>
                <td class="py-4 px-6 whitespace-nowrap">
                  <span 
                    :class="{
                      'bg-emerald-950 text-emerald-400 border-emerald-800/60': guest.status === 'Approved' || guest.status === 'Active',
                      'bg-amber-950 text-amber-400 border-amber-800/60': guest.status === 'Pending',
                      'bg-rose-950 text-rose-400 border-rose-800/60': guest.status === 'Blocked'
                    }" 
                    class="px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="{
                      'bg-emerald-400': guest.status === 'Approved' || guest.status === 'Active',
                      'bg-amber-400': guest.status === 'Pending',
                      'bg-rose-400': guest.status === 'Blocked'
                    }"></span>
                    {{ guest.status || 'Active' }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                  <button 
                    v-if="guest.status !== 'Approved'"
                    @click="acceptUser(guest.id)" 
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <UserCheck class="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button 
                    @click="blockUser(guest.id)" 
                    class="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800/60 rounded-lg font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <UserX class="w-3.5 h-3.5" />
                    Block
                  </button>
                </td>
              </tr>

              <!-- Loading State inside Table -->
              <tr v-if="loading">
                <td colspan="4" class="py-16 text-center text-slate-400 text-xs font-medium">
                  <div class="inline-flex items-center gap-2">
                    <div class="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
                    Loading users from Firestore...
                  </div>
                </td>
              </tr>

              <!-- Empty State inside Table -->
              <tr v-if="!loading && filteredGuests.length === 0">
                <td colspan="4" class="py-16 text-center text-slate-500 text-xs font-medium">
                  No matching users found based on your search filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>