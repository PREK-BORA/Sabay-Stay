<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  collection, 
  doc, 
  getDoc,
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  type Firestore 
} from 'firebase/firestore'
import { definePageMeta, useNuxtApp } from '#imports'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'user',
  middleware: 'auth'
})

export interface ReviewItem {
  id: string
  hotelName?: string
  location?: string
  rating: number
  comment: string
  createdAt?: string
}

const reviews = ref<ReviewItem[]>([])
const loading = ref<boolean>(true)
const { user } = useAuth()

let unsubscribe: (() => void) | null = null


const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}

// 1. Set up real-time listener for user reviews
const initFirestoreListener = () => {
  loading.value = true
  const db = getDb()

  if (!db) {
    loading.value = false
    return
  }

  if (!user.value?.id) {
    reviews.value = []
    loading.value = false
    return
  }

  try {
    const q = query(collection(db, 'reviews'), where('userId', '==', user.value.id))
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: ReviewItem[] = []
        snapshot.forEach((docSnap) => {
          list.push({
            id: docSnap.id,
            ...docSnap.data()
          } as ReviewItem)
        })
        reviews.value = list
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


const deleteReview = async (id: string) => {
  if (!confirm('Are you sure you want to delete this review?')) return

  const db = getDb()
  if (!db) return

  try {
    if (!user.value?.id) return

    const reviewRef = doc(db, 'reviews', id)
    const reviewSnapshot = await getDoc(reviewRef)
    if (reviewSnapshot.exists() && reviewSnapshot.data().userId === user.value.id) {
      await deleteDoc(reviewRef)
    }
  } catch (error) {
    console.error('Error deleting review:', error)
  }
}

onMounted(() => {
  initFirestoreListener()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<template>
  <div class="space-y-8 max-w-5xl">
    
    <div class="flex justify-between items-center border-b border-slate-200 pb-5">
      <div>
        <h1 class="text-3xl font-serif font-bold text-slate-900">My Reviews</h1>
        <p class="text-slate-500 text-sm mt-1">Reviews and feedback submitted by you across your hotel stays.</p>
      </div>
      <span class="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
        {{ reviews.length }} Reviews
      </span>
    </div>

    
    <div v-if="loading" class="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <p class="text-slate-400 text-sm">Loading your reviews...</p>
    </div>

   
    <div v-else-if="reviews.length > 0" class="space-y-4">
      <div 
        v-for="item in reviews" 
        :key="item.id" 
        class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-3"
      >
        <div class="flex justify-between items-start gap-4">
          <div>
            <h3 class="font-bold text-slate-900 text-lg font-serif">
              {{ item.hotelName || 'Hotel Stay' }}
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              📍 {{ item.location || 'Phnom Penh, Cambodia' }}
            </p>
          </div>

          <button 
            @click="deleteReview(item.id)" 
            class="text-xs text-slate-400 hover:text-rose-600 transition-colors font-medium px-2 py-1 rounded-md hover:bg-rose-50"
          >
            Delete
          </button>
        </div>

      
        <div class="flex items-center gap-1 text-amber-500 text-sm">
          <span v-for="star in 5" :key="star">
            {{ star <= item.rating ? '★' : '☆' }}
          </span>
          <span class="text-xs text-slate-400 font-normal ml-2">
            {{ item.createdAt || 'Recently reviewed' }}
          </span>
        </div>

        <
        <p class="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
          "{{ item.comment }}"
        </p>
      </div>
    </div>

    
    <div v-else class="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <p class="text-slate-400 text-sm">You haven't written any reviews yet.</p>
    </div>
  </div>
</template>