<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Search, Loader2 } from 'lucide-vue-next'
import { useAuth } from '~/composables/auth/useAuth'

definePageMeta({
  layout: 'owner',
  middleware: ['owner']
})

const { user } = useAuth()
const { getHotels, getBookings, updateBookingStatus } = useFirestoreDB()

const activeTab = ref('All')
const tabs = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled']
const searchQuery = ref('')
const selectedProperty = ref('')
const selectedBooking = ref(null)

const propertiesList = ref([])
const bookings = ref([])
const loading = ref(true)
const updatingStatus = ref(false)

const getGuestName = (b) => b?.guest || b?.guestName || b?.userName || 'Guest'
const getGuestEmail = (b) => b?.email || b?.guestEmail || b?.userEmail || 'No email provided'
const getPropertyName = (b) => b?.property || b?.hotelName || 'Property'
const getRoomName = (b) => b?.roomType || b?.roomName || 'Standard Room'

const formatDate = (dateVal) => {
  if (!dateVal) return '-'
  try {
    const d = new Date(dateVal)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateVal
  }
}

const calculateNights = (inDate, outDate) => {
  if (!inDate || !outDate) return 1
  const start = new Date(inDate)
  const end = new Date(outDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays
}

const statusBadge = (status) => {
  const s = status?.toLowerCase()
  if (s === 'confirmed') return 'bg-emerald-100 text-emerald-700'
  if (s === 'pending') return 'bg-amber-100 text-amber-700'
  if (s === 'completed') return 'bg-indigo-100 text-indigo-700'
  if (s === 'cancelled') return 'bg-rose-100 text-rose-700'
  return 'bg-gray-100 text-gray-700'
}

const filteredBookings = computed(() => {
  return bookings.value.filter(b => {
    const status = b.status || 'Pending'
    const matchesTab = activeTab.value === 'All' || status.toLowerCase() === activeTab.value.toLowerCase()
    
    const query = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !query || 
      getGuestName(b).toLowerCase().includes(query) || 
      getPropertyName(b).toLowerCase().includes(query) || 
      b.id?.toLowerCase().includes(query)

    const matchesProp = !selectedProperty.value || getPropertyName(b) === selectedProperty.value
    return matchesTab && matchesSearch && matchesProp
  })
})

const loadData = async () => {
  loading.value = true
  try {
    const currentUid = user.value?.id || user.value?.uid
    const isAdmin = user.value?.role === 'admin'

    const hotels = await getHotels()
    if (hotels) {
      propertiesList.value = isAdmin ? hotels : hotels.filter(h => h.ownerId === currentUid)
    }

    const allBookings = await getBookings()
    if (allBookings) {
      if (isAdmin) {
        bookings.value = allBookings
      } else {
        const ownerHotelIds = propertiesList.value.map(h => h.id)
        const ownerHotelNames = propertiesList.value.map(h => h.name?.toLowerCase())

        bookings.value = allBookings.filter(b => {
          const isDirectOwner = b.ownerId === currentUid
          const matchesHotelId = ownerHotelIds.includes(b.hotelId)
          const matchesHotelName = ownerHotelNames.includes(getPropertyName(b).toLowerCase())
          return isDirectOwner || matchesHotelId || matchesHotelName
        })
      }
    }
  } catch (err) {
    console.error('Error loading booking data:', err)
  } finally {
    loading.value = false
  }
}

const handleStatusUpdate = async (bookingId, newStatus) => {
  if (updatingStatus.value) return
  updatingStatus.value = true

  try {
    await updateBookingStatus(bookingId, newStatus)
    const target = bookings.value.find(b => b.id === bookingId)
    if (target) target.status = newStatus
    if (selectedBooking.value) selectedBooking.value.status = newStatus
  } catch (err) {
    alert('Failed to update booking status: ' + err.message)
  } finally {
    updatingStatus.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold font-serif text-indigo-950 mb-6">Owner Bookings</h1>
    
    <div v-if="loading" class="flex justify-center items-center py-20">
      <Loader2 class="w-8 h-8 animate-spin text-indigo-900" />
    </div>

    <div v-else>
      <!-- Filter Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', activeTab === tab ? 'bg-indigo-950 text-white' : 'bg-white text-gray-600 hover:bg-gray-100']"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Bookings List Table / Cards -->
      <div v-if="filteredBookings.length === 0" class="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
        No bookings found.
      </div>

      <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div v-for="b in filteredBookings" :key="b.id" class="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p class="font-semibold text-gray-800">{{ getGuestName(b) }}</p>
            <p class="text-xs text-gray-500">{{ getPropertyName(b) }} • {{ getRoomName(b) }}</p>
          </div>
          <span :class="['px-3 py-1 rounded-full text-xs font-semibold', statusBadge(b.status)]">
            {{ b.status || 'Pending' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>