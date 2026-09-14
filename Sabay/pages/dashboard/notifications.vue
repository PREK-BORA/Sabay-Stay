<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { 
  collection, 
  doc, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  writeBatch,
  type Firestore,
  type Unsubscribe
} from 'firebase/firestore'
import { definePageMeta, useNuxtApp } from '#imports'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'user',
  middleware: 'auth'
})

export interface UserNotification {
  id: string
  title: string
  message: string
  time?: string
  type: 'booking' | 'system' | 'promo'
  isRead: boolean
  userId?: string
}

const notifications = ref<UserNotification[]>([])
const loading = ref<boolean>(true)
const { user } = useAuth()

let unsubscribe: Unsubscribe | null = null

const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}

const initFirestoreListener = () => {
  const db = getDb()
  const userId = user.value?.id || user.value?.uid

  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
  }

  if (!db || !userId) {
    notifications.value = []
    loading.value = false
    return
  }

  loading.value = true

  try {
    const q = query(
      collection(db, 'notifications'), 
      where('userId', '==', userId)
    )

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: UserNotification[] = []
        snapshot.forEach((docSnap) => {
          list.push({
            id: docSnap.id,
            ...docSnap.data()
          } as UserNotification)
        })
        notifications.value = list
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

const unreadCount = computed(() => notifications.value.filter(item => !item.isRead).length)

const markAsRead = async (id: string) => {
  const db = getDb()
  const userId = user.value?.id || user.value?.uid
  if (!db || !userId) return

  try {
    const notificationRef = doc(db, 'notifications', id)
    const notificationSnapshot = await getDoc(notificationRef)
    if (notificationSnapshot.exists() && notificationSnapshot.data().userId === userId) {
      await updateDoc(notificationRef, { isRead: true })
    }
  } catch (error) {
    console.error('Error updating notification state:', error)
  }
}

const markAllAsRead = async () => {
  const db = getDb()
  if (!db) return

  try {
    const batch = writeBatch(db)
    notifications.value.forEach((item) => {
      if (!item.isRead) {
        batch.update(doc(db, 'notifications', item.id), { isRead: true })
      }
    })
    await batch.commit()
  } catch (error) {
    console.error('Error marking all as read:', error)
  }
}

const removeNotification = async (id: string) => {
  const db = getDb()
  const userId = user.value?.id || user.value?.uid
  if (!db || !userId) return

  try {
    const notificationRef = doc(db, 'notifications', id)
    const notificationSnapshot = await getDoc(notificationRef)
    if (notificationSnapshot.exists() && notificationSnapshot.data().userId === userId) {
      await deleteDoc(notificationRef)
    }
  } catch (error) {
    console.error('Error removing notification:', error)
  }
}

const clearAll = async () => {
  const db = getDb()
  if (!db) return

  try {
    const batch = writeBatch(db)
    notifications.value.forEach((item) => {
      batch.delete(doc(db, 'notifications', item.id))
    })
    await batch.commit()
  } catch (error) {
    console.error('Error clearing all notifications:', error)
  }
}

watch(
  () => user.value,
  () => {
    initFirestoreListener()
  },
  { immediate: true }
)

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
      <div>
        <h1 class="flex items-center gap-3 text-2xl font-serif font-bold text-slate-900">
          Notifications
          <span v-if="unreadCount > 0" class="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-900">
            {{ unreadCount }} new
          </span>
        </h1>
        <p class="mt-1 text-sm text-slate-500">Stay up to date with your bookings and offers.</p>
      </div>

      <div v-if="notifications.length > 0" class="flex items-center gap-3">
        <button
          v-if="unreadCount > 0"
          type="button"
          class="cursor-pointer text-xs font-semibold text-indigo-900 transition-colors hover:text-indigo-700"
          @click="markAllAsRead"
        >
          Mark all as read
        </button>
        <span v-if="unreadCount > 0" class="text-slate-300">|</span>
        <button
          type="button"
          class="cursor-pointer text-xs font-semibold text-rose-600 transition-colors hover:text-rose-700"
          @click="clearAll"
        >
          Clear all
        </button>
      </div>
    </div>

    <div v-if="loading" class="rounded-2xl border border-slate-100 bg-white py-16 text-center">
      <p class="text-xs text-slate-400">Loading notifications...</p>
    </div>

    <div v-else-if="notifications.length === 0" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
      <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-400">🔔</div>
      <p class="font-medium text-slate-600">No notifications found</p>
      <p class="mt-1 text-xs text-slate-400">We'll let you know when there are updates on your account.</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="item in notifications"
        :key="item.id"
        class="flex items-start justify-between gap-4 rounded-2xl border p-4 transition-all"
        :class="item.isRead ? 'border-slate-100 bg-white' : 'border-indigo-100 bg-indigo-50/40'"
      >
        <div class="flex items-start gap-3.5">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm"
            :class="{
              'bg-emerald-100 text-emerald-700': item.type === 'booking',
              'bg-amber-100 text-amber-700': item.type === 'promo',
              'bg-slate-100 text-slate-700': item.type === 'system'
            }"
          >
            <span v-if="item.type === 'booking'">🏨</span>
            <span v-else-if="item.type === 'promo'">🎁</span>
            <span v-else>⚙️</span>
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-slate-900">{{ item.title }}</h3>
              <span v-if="!item.isRead" class="h-2 w-2 rounded-full bg-indigo-600"></span>
            </div>
            <p class="text-xs leading-relaxed text-slate-600">{{ item.message }}</p>
            <div class="flex items-center gap-3 pt-1">
              <p class="text-[10px] text-slate-400">{{ item.time || 'Recently' }}</p>
              <button
                v-if="!item.isRead"
                type="button"
                class="cursor-pointer text-[10px] font-semibold text-indigo-700 transition-colors hover:text-indigo-900"
                @click="markAsRead(item.id)"
              >
                Mark as read
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="cursor-pointer p-1 text-sm font-bold text-slate-300 transition-colors hover:text-slate-500"
          title="Remove notification"
          aria-label="Remove notification"
          @click="removeNotification(item.id)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>