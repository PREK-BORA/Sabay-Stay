<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc, where, limit, type Firestore, type Unsubscribe } from 'firebase/firestore'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'user' // ឬ Layout របស់អ្នក
})

const messages = ref<any[]>([])
const messageText = ref('')
const isLoading = ref(true)
const isSending = ref(false)
const errorMessage = ref('')
const chatId = ref<string | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)

const { user } = useAuth()
let unsubscribeChat: Unsubscribe | null = null
let unsubscribeMessages: Unsubscribe | null = null

const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// ស្ដាប់ (Listen) សារដែល Admin ឬ User ផ្ញើចូលក្នុង Chat នេះ
const subscribeToMessages = (db: Firestore, activeChatId: string) => {
  if (unsubscribeMessages) unsubscribeMessages()
  
  const messagesQuery = query(
    collection(db, 'chats', activeChatId, 'messages'),
    orderBy('createdAt', 'asc')
  )

  unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
    messages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    isLoading.value = false
    scrollToBottom()
  }, (error) => {
    console.error('Error fetching messages:', error)
    errorMessage.value = 'Failed to load chat history.'
    isLoading.value = false
  })
}

// ស្វែងរក Room Chat របស់ User
const initializeChat = async () => {
  const db = getDb()
  const currentUserId = user.value?.id || user.value?.uid

  if (!db || !currentUserId) {
    isLoading.value = false
    return
  }

  try {
    unsubscribeChat?.()
    const chatQuery = query(
      collection(db, 'chats'),
      where('userId', '==', currentUserId),
      limit(1)
    )

    // ប្រើ onSnapshot លើ Chat Room ដើម្បទទួលបាន real-time update
    unsubscribeChat = onSnapshot(chatQuery, (snapshot) => {
      if (snapshot.docs[0]) {
        const chatDoc = snapshot.docs[0]
        chatId.value = chatDoc.id
        subscribeToMessages(db, chatDoc.id)
      } else {
        isLoading.value = false
      }
    }, (error) => {
      console.error('Error initializing chat:', error)
      errorMessage.value = 'Could not load chat session.'
      isLoading.value = false
    })
  } catch (error) {
    console.error('Error initializing chat:', error)
    errorMessage.value = 'Could not load chat session.'
    isLoading.value = false
  }
}

watch(() => user.value?.id || user.value?.uid, (currentUserId, previousUserId) => {
  if (currentUserId === previousUserId && currentUserId) return

  unsubscribeChat?.()
  unsubscribeMessages?.()
  unsubscribeChat = null
  unsubscribeMessages = null
  chatId.value = null
  messages.value = []
  errorMessage.value = ''
  isLoading.value = Boolean(currentUserId)

  if (currentUserId) initializeChat()
}, { immediate: true })


const sendMessage = async () => {
  const db = getDb()
  const currentUser = user.value
  const currentUserId = currentUser?.id || currentUser?.uid
  const text = messageText.value.trim()

  if (!db || !currentUserId || !text || isSending.value) return

  isSending.value = true
  errorMessage.value = ''

  try {
    let currentChatId = chatId.value


    if (!currentChatId) {
      const newChatRef = doc(collection(db, 'chats'))
      currentChatId = newChatRef.id
      chatId.value = currentChatId

      await setDoc(newChatRef, {
        userId: currentUserId,
        userName: currentUser.name || currentUser.displayName || 'Customer',
        userEmail: currentUser.email || '',
        userAvatar: currentUser.avatar || currentUser.photoURL || '',
        lastMessage: text,
        unreadByAdmin: true,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      })

      subscribeToMessages(db, currentChatId)
    } else {

      await setDoc(doc(db, 'chats', currentChatId), {
        lastMessage: text,
        unreadByAdmin: true,
        updatedAt: serverTimestamp()
      }, { merge: true })
    }

    await addDoc(collection(db, 'chats', currentChatId, 'messages'), {
      senderId: currentUserId,
      senderRole: 'user', 
      text: text,
      createdAt: serverTimestamp()
    })

    messageText.value = ''
    scrollToBottom()
  } catch (error) {
    console.error('Error sending message:', error)
    errorMessage.value = 'Failed to send message. Please try again.'
  } finally {
    isSending.value = false
  }
}

onUnmounted(() => {
  unsubscribeChat?.()
  if (unsubscribeMessages) unsubscribeMessages()
})
</script>

<template>
  <div class="flex h-[calc(100vh-10rem)] min-h-125 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
  
    <div class="border-b border-slate-100 bg-white p-5 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-800">Customer Support</h2>
        <p class="text-xs text-slate-500">Chat directly with Admin support team.</p>
      </div>
    </div>


    <div ref="messagesContainer" class="flex-1 space-y-4 overflow-y-auto p-6 bg-slate-50/50">
      <p v-if="isLoading" class="text-center text-sm text-slate-400">Loading messages...</p>
      <p v-else-if="errorMessage" class="text-center text-sm text-red-500">{{ errorMessage }}</p>
      <div v-else-if="!messages.length" class="flex h-full flex-col items-center justify-center text-slate-400">
        <p class="text-sm">No messages yet. Ask our support team anything!</p>
      </div>

      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="msg.senderRole === 'user' ? 'text-right' : 'text-left'"
      >
        <div
          :class="[
            'inline-block max-w-[75%] rounded-2xl px-4 py-2.5 text-left text-sm font-medium shadow-sm',
            msg.senderRole === 'user'
              ? 'rounded-br-none bg-indigo-950 text-white'
              : 'rounded-bl-none border border-slate-200 bg-white text-slate-800'
          ]"
        >
          <p class="leading-relaxed">{{ msg.text }}</p>
        </div>
      </div>
    </div>


    <form @submit.prevent="sendMessage" class="flex gap-3 border-t border-slate-100 bg-white p-4">
      <input
        v-model="messageText"
        type="text"
        placeholder="Write a message to Admin..."
        class="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-950"
      />
      <button
        type="submit"
        :disabled="isSending || !messageText.trim()"
        class="rounded-xl bg-indigo-950 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-900 active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        {{ isSending ? 'Sending...' : 'Send' }}
      </button>
    </form>
  </div>
</template>