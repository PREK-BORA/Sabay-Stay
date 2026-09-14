<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs,
  writeBatch,
  type Firestore, 
  type Unsubscribe 
} from 'firebase/firestore'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface Chat {
  id: string
  userId?: string
  userName?: string
  userEmail?: string
  lastMessage?: string
  updatedAt?: any
}

interface Message {
  id: string
  text: string
  senderRole: 'user' | 'admin'
  createdAt?: any
}

const chats = ref<Chat[]>([])
const activeChatId = ref<string | null>(null)
const activeChatUser = ref<Chat | null>(null)
const messages = ref<Message[]>([])
const replyText = ref('')
const isLoadingChats = ref(true)
const isLoadingMessages = ref(false)
const isSending = ref(false)
const isDeleting = ref(false)

let unsubscribeChats: Unsubscribe | null = null
let unsubscribeMessages: Unsubscribe | null = null

const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}

onMounted(() => {
  const db = getDb()
  if (!db) {
    isLoadingChats.value = false
    return
  }

  const chatsQuery = query(collection(db, 'chats'), orderBy('updatedAt', 'desc'))
  unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
    chats.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat))
    isLoadingChats.value = false
  }, (error) => {
    console.error('Error fetching chats:', error)
    isLoadingChats.value = false
  })
})

const selectChat = (chat: Chat) => {
  activeChatId.value = chat.id
  activeChatUser.value = chat
  isLoadingMessages.value = true
  
  const db = getDb()
  if (!db) return

  unsubscribeMessages?.()
  const messagesQuery = query(
    collection(db, 'chats', chat.id, 'messages'),
    orderBy('createdAt', 'asc')
  )

  unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
    messages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message))
    isLoadingMessages.value = false
  }, (error) => {
    console.error('Error fetching messages:', error)
    isLoadingMessages.value = false
  })
}

const sendReply = async () => {
  const db = getDb()
  const text = replyText.value.trim()
  if (!db || !activeChatId.value || !text || isSending.value) return

  isSending.value = true

  try {
    await addDoc(collection(db, 'chats', activeChatId.value, 'messages'), {
      senderRole: 'admin',
      text,
      createdAt: serverTimestamp()
    })

    await setDoc(doc(db, 'chats', activeChatId.value), {
      lastMessage: text,
      updatedAt: serverTimestamp()
    }, { merge: true })

    replyText.value = ''
  } catch (error) {
    console.error('Failed to send reply:', error)
  } finally {
    isSending.value = false
  }
}

// Delete a single message from the current chat
const deleteMessage = async (messageId: string) => {
  const db = getDb()
  if (!db || !activeChatId.value) return
  if (!confirm('Are you sure you want to delete this message?')) return

  try {
    await deleteDoc(doc(db, 'chats', activeChatId.value, 'messages', messageId))
  } catch (error) {
    console.error('Failed to delete message:', error)
  }
}

// Delete the entire conversation (all subcollection messages and parent doc)
const deleteChat = async (chatId: string) => {
  const db = getDb()
  if (!db) return
  if (!confirm('Are you sure you want to delete this entire chat conversation?')) return

  isDeleting.value = true

  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages')
    const messagesSnap = await getDocs(messagesRef)

    const batch = writeBatch(db)
    messagesSnap.forEach((messageDoc) => {
      batch.delete(messageDoc.ref)
    })

    batch.delete(doc(db, 'chats', chatId))
    await batch.commit()

    if (activeChatId.value === chatId) {
      activeChatId.value = null
      activeChatUser.value = null
      messages.value = []
    }
  } catch (error) {
    console.error('Failed to delete conversation:', error)
  } finally {
    isDeleting.value = false
  }
}

onUnmounted(() => {
  unsubscribeChats?.()
  unsubscribeMessages?.()
})
</script>

<template>
  <div class="flex h-[calc(100vh-6rem)] min-h-[600px] gap-6 overflow-hidden">
    <div class="w-80 shrink-0 flex flex-col rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <div class="border-b border-slate-100 p-5">
        <h2 class="text-lg font-bold text-slate-800">Support Inbox</h2>
        <p class="text-xs text-slate-500 mt-0.5">User inquiries & messages</p>
      </div>

      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <p v-if="isLoadingChats" class="p-4 text-center text-sm text-slate-400">Loading chats...</p>
        <p v-else-if="!chats.length" class="p-4 text-center text-sm text-slate-400">No conversations yet.</p>

        <div
          v-else
          v-for="chat in chats"
          :key="chat.id"
          @click="selectChat(chat)"
          :class="[
            'group relative flex items-center justify-between p-3.5 rounded-2xl transition-all border cursor-pointer',
            activeChatId === chat.id
              ? 'bg-indigo-950 text-white border-indigo-950 shadow-md'
              : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/60 text-slate-800'
          ]"
        >
          <div class="min-w-0 flex-1 pr-2">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-sm truncate max-w-[150px]">
                {{ chat.userName || chat.userEmail || 'Guest User' }}
              </span>
            </div>
            <p :class="['text-xs truncate font-medium', activeChatId === chat.id ? 'text-slate-300' : 'text-slate-500']">
              {{ chat.lastMessage || 'No messages yet' }}
            </p>
          </div>

          <button
            type="button"
            @click.stop="deleteChat(chat.id)"
            title="Delete Chat"
            aria-label="Delete Chat"
            class="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-opacity"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col rounded-3xl border border-slate-200/80 bg-slate-50/50 shadow-sm overflow-hidden">
      <div v-if="!activeChatId" class="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
        <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-2xl">
          💬
        </div>
        <p class="text-sm font-medium">Select a conversation from the left to start replying.</p>
      </div>

      <template v-else>
        <div class="border-b border-slate-200/80 bg-white p-5 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-slate-800 text-base">
              {{ activeChatUser?.userName || 'User' }}
            </h3>
            <p class="text-xs text-slate-500">{{ activeChatUser?.userEmail || 'No email provided' }}</p>
          </div>

          <button
            type="button"
            @click="deleteChat(activeChatId)"
            :disabled="isDeleting"
            class="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete Conversation' }}
          </button>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto p-6">
          <p v-if="isLoadingMessages" class="text-center text-sm text-slate-400">Loading conversation...</p>
          <p v-else-if="!messages.length" class="text-center text-sm text-slate-400">No messages in this chat.</p>

          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="[
              'group relative flex gap-2 items-center',
              msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'
            ]"
          >
            <button
              v-if="msg.senderRole === 'admin'"
              type="button"
              @click="deleteMessage(msg.id)"
              title="Delete Message"
              aria-label="Delete Message"
              class="opacity-0 group-hover:opacity-100 p-1 text-xs text-slate-400 hover:text-rose-500 transition-opacity"
            >
              ✕
            </button>

            <div
              :class="[
                'inline-block max-w-[75%] rounded-2xl px-4 py-2.5 text-left text-sm font-medium shadow-sm',
                msg.senderRole === 'admin'
                  ? 'rounded-br-none bg-indigo-950 text-white'
                  : 'rounded-bl-none border border-slate-200/80 bg-white text-slate-800'
              ]"
            >
              <p class="leading-relaxed">{{ msg.text }}</p>
            </div>

            <button
              v-if="msg.senderRole !== 'admin'"
              type="button"
              @click="deleteMessage(msg.id)"
              title="Delete Message"
              aria-label="Delete Message"
              class="opacity-0 group-hover:opacity-100 p-1 text-xs text-slate-400 hover:text-rose-500 transition-opacity"
            >
              ✕
            </button>
          </div>
        </div>

        <form @submit.prevent="sendReply" class="flex gap-2 border-t border-slate-200/80 bg-white p-4">
          <input
            v-model="replyText"
            type="text"
            placeholder="Type your reply to user..."
            aria-label="Reply message"
            class="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-950"
          />
          <button
            type="submit"
            :disabled="isSending || !replyText.trim()"
            class="rounded-xl bg-indigo-950 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ isSending ? 'Sending...' : 'Reply' }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>