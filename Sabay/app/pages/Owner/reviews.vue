<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-serif font-bold text-gray-900">Reviews & Ratings</h1>
        <p class="text-sm text-gray-500 mt-1">Monitor guest feedback and manage property reputation.</p>
      </div>

      <!-- Property Selector -->
      <div>
        <select v-model="selectedProperty" class="bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-950">
          <option value="All">All Properties</option>
          <option value="Villa Azul">Villa Azul</option>
          <option value="Grand Horizon Resort">Grand Horizon Resort</option>
        </select>
      </div>
    </div>

    <!-- Rating Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average Rating</span>
        <div class="flex items-baseline gap-2 mt-2">
          <span class="text-3xl font-serif font-bold text-gray-900">4.8</span>
          <span class="text-xs text-emerald-600 font-medium">★ Excellent</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Reviews</span>
        <div class="text-3xl font-serif font-bold text-gray-900 mt-2">128</div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Response Rate</span>
        <div class="text-3xl font-serif font-bold text-gray-900 mt-2">94%</div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Replies</span>
        <div class="text-3xl font-serif font-bold text-indigo-950 mt-2">{{ pendingRepliesCount }}</div>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="space-y-4">
      <div v-for="rev in filteredReviews" :key="rev.id" class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center gap-3">
              <h3 class="font-bold text-gray-900 text-base">{{ rev.guestName }}</h3>
              <span class="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">{{ rev.roomName }}</span>
            </div>
            <div class="text-xs text-gray-400 mt-1">{{ rev.hotelName }} • {{ rev.date }}</div>
          </div>
          <div class="flex items-center gap-1 bg-amber-50 text-amber-700 font-semibold px-3 py-1 rounded-full text-xs">
            ★ {{ rev.rating }}.0
          </div>
        </div>

        <p class="text-sm text-gray-700 leading-relaxed mb-4">{{ rev.comment }}</p>

        <!-- Owner Response Section -->
        <div v-if="rev.reply" class="bg-gray-50 border-l-4 border-indigo-950 p-4 rounded-r-xl text-xs space-y-1">
          <div class="font-semibold text-indigo-950">Property Owner Response:</div>
          <p class="text-gray-600">{{ rev.reply }}</p>
        </div>

        <div v-else class="pt-2">
          <div v-if="activeReplyId === rev.id" class="space-y-3">
            <textarea 
              v-model="replyText" 
              placeholder="Write a polite response to the guest..." 
              rows="3"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 outline-none focus:border-indigo-950"
            ></textarea>
            <div class="flex justify-end gap-2">
              <button 
                @click="activeReplyId = null" 
                class="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                @click="submitReply(rev)" 
                class="px-4 py-1.5 text-xs bg-indigo-950 hover:bg-indigo-900 text-white font-medium rounded-lg"
              >
                Post Reply
              </button>
            </div>
          </div>
          <button 
            v-else 
            @click="activeReplyId = rev.id" 
            class="text-xs font-semibold text-indigo-950 hover:underline flex items-center gap-1"
          >
            💬 Reply to guest
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'owner'
})

const selectedProperty = ref('All')
const activeReplyId = ref(null)
const replyText = ref('')

const reviews = ref([
  {
    id: 1,
    guestName: 'Sarah Jenkins',
    hotelName: 'Villa Azul',
    roomName: 'Ocean Luxury Suite',
    rating: 5,
    date: '2026-08-20',
    comment: 'The view was absolutely breathtaking! Clean rooms, friendly staff, and peaceful environment. Highly recommended!',
    reply: 'Thank you Sarah! We are thrilled to hear you loved the ocean view. Looking forward to hosting you again!'
  },
  {
    id: 2,
    guestName: 'David Kim',
    hotelName: 'Villa Azul',
    roomName: 'Garden Villa Room',
    rating: 4,
    date: '2026-08-15',
    comment: 'Great stay overall. The room was spacious and clean. Wi-Fi was slightly slow in the afternoon, but everything else was perfect.',
    reply: null
  },
  {
    id: 3,
    guestName: 'Emma Watson',
    hotelName: 'Grand Horizon Resort',
    roomName: 'Penthouse Suite',
    rating: 5,
    date: '2026-08-10',
    comment: 'Top tier service! Everything exceeded our expectations. Will definitely come back next year.',
    reply: null
  }
])

const filteredReviews = computed(() => {
  if (selectedProperty.value === 'All') return reviews.value
  return reviews.value.filter(r => r.hotelName === selectedProperty.value)
})

const pendingRepliesCount = computed(() => {
  return reviews.value.filter(r => !r.reply).length
})

const submitReply = (rev) => {
  if (!replyText.value.trim()) return
  rev.reply = replyText.value
  replyText.value = ''
  activeReplyId.value = null
}
</script>