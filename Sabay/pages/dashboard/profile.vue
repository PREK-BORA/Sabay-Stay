<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { doc, getDoc, setDoc, type Firestore } from 'firebase/firestore'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, getAuth } from 'firebase/auth'
import { useAuth } from '~/composables/useAuth'
import { definePageMeta, useNuxtApp } from '#imports'

definePageMeta({
  layout: 'user',
  middleware: 'auth'
})

const { user } = useAuth()
const avatarInput = ref<HTMLInputElement | null>(null)
const isSaving = ref(false)
const isUpdatingPassword = ref(false)

const profile = reactive({
  firstName: user.value?.name?.split(' ')[0] || 'Fongly',
  lastName: user.value?.name?.split(' ').slice(1).join(' ') || '',
  email: user.value?.email || 'Fongly@gmail.com',
  phone: user.value?.phone || '+855 12 345 678',
  country: user.value?.country || 'Cambodia',
  avatar: user.value?.avatar || ''
})

const initials = computed(() => {
  const first = profile.firstName?.trim()?.charAt(0) || 'F'
  const last = profile.lastName?.trim()?.charAt(0) || ''
  return `${first}${last}`.toUpperCase()
})


const preferences = reactive({
  language: 'English (US)',
  currency: 'USD ($)'
})


const security = reactive({
  currentPassword: '',
  newPassword: ''
})


const getDb = (): Firestore | null => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$db as Firestore) || null
}


onMounted(async () => {
  const db = getDb()
  if (!db || !user.value?.id) return

  try {
    const docRef = doc(db, 'user', user.value.id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      profile.firstName = data.firstName || profile.firstName
      profile.lastName = data.lastName || profile.lastName
      profile.phone = data.phone || profile.phone
      profile.country = data.country || profile.country
      profile.avatar = data.avatar || profile.avatar
      preferences.language = data.language || preferences.language
      preferences.currency = data.currency || preferences.currency
    }
  } catch (error) {
    console.error('Error fetching profile from Firestore:', error)
  }
})

const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    alert('Please upload a valid JPG, PNG, GIF, or WebP image.')
    return
  }

  if (file.size > 800 * 1024) {
    alert('Image size must be under 800KB.')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const imageUrl = String(reader.result || '')
    profile.avatar = imageUrl

    if (user.value) {
      user.value = { ...user.value, avatar: imageUrl }
      if (process.client) {
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      }
    }
  }

  reader.readAsDataURL(file)
  input.value = ''
}


const handleSaveProfile = async () => {
  isSaving.value = true
  const fullName = [profile.firstName.trim(), profile.lastName.trim()].filter(Boolean).join(' ')

  const db = getDb()
  if (db && user.value?.id) {
    try {
      await setDoc(doc(db, 'user', user.value.id), {
        firstName: profile.firstName,
        lastName: profile.lastName,
        fullName,
        email: profile.email,
        phone: profile.phone,
        country: profile.country,
        avatar: profile.avatar,
        language: preferences.language,
        currency: preferences.currency,
        updatedAt: new Date().toISOString()
      }, { merge: true })
    } catch (error) {
      console.error('Error saving profile to Firestore:', error)
    }
  }

  if (user.value) {
    user.value = {
      ...user.value,
      name: fullName || profile.firstName,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      avatar: profile.avatar
    }

    if (process.client) {
      localStorage.setItem('auth_user', JSON.stringify(user.value))
    }
  }

  isSaving.value = false
  alert('Profile updated successfully!')
}


const handleUpdatePassword = async () => {
  if (!security.currentPassword || !security.newPassword) {
    alert('Please enter both current and new password.')
    return
  }

  isUpdatingPassword.value = true
  const auth = getAuth()
  const currentUser = auth.currentUser

  if (!currentUser || !currentUser.email) {
    alert('User authentication session expired. Please sign in again.')
    isUpdatingPassword.value = false
    return
  }

  try {

    const credential = EmailAuthProvider.credential(currentUser.email, security.currentPassword)
    await reauthenticateWithCredential(currentUser, credential)
    
   
    await updatePassword(currentUser, security.newPassword)
    alert('Password updated successfully!')
    security.currentPassword = ''
    security.newPassword = ''
  } catch (error: any) {
    console.error('Error updating password:', error)
    alert(error.message || 'Failed to update password. Please check your current password.')
  } finally {
    isUpdatingPassword.value = false
  }
}
</script>

<template>
  <div class="space-y-8 max-w-4xl pb-12">
    <div>
      <h1 class="text-3xl font-serif font-bold text-slate-900">Profile Settings</h1>
      <p class="text-slate-500 text-sm mt-1">Manage your account details, preferences, and security settings.</p>
    </div>

    <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <h2 class="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Personal Information</h2>
      
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold text-2xl shadow-sm overflow-hidden border border-slate-200">
          <img v-if="profile.avatar" :src="profile.avatar" alt="Profile avatar" class="w-full h-full object-cover" />
          <span v-else>{{ initials }}</span>
        </div>
        <div>
          <input
            ref="avatarInput"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            class="hidden"
            @change="handleAvatarChange"
          />
          <button
            type="button"
            class="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-xs rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
            @click="avatarInput?.click()"
          >
            Change Avatar
          </button>
          <p class="text-xs text-slate-400 mt-2">JPG, GIF or PNG. Max size of 800K</p>
        </div>
      </div>

      <form @submit.prevent="handleSaveProfile" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">First Name</label>
            <input 
              v-model="profile.firstName" 
              type="text" 
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900" 
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Last Name</label>
            <input 
              v-model="profile.lastName" 
              type="text" 
              placeholder="Optional"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900" 
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
          <input 
            v-model="profile.email" 
            type="email" 
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900" 
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone Number</label>
          <input 
            v-model="profile.phone" 
            type="text" 
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900" 
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Country</label>
          <select v-model="profile.country" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900">
            <option>Cambodia</option>
            <option>Vietnam</option>
            <option>Singapore</option>
            <option>Japan</option>
            <option>United States</option>
            <option>France</option>
            <option>Australia</option>
          </select>
        </div>

        <div class="flex justify-end pt-2">
          <button 
            type="submit" 
            :disabled="isSaving"
            class="px-6 py-2.5 bg-indigo-950 text-white font-medium text-sm rounded-xl hover:bg-indigo-900 transition-colors disabled:opacity-50"
          >
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>

    <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <h2 class="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Security</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Current Password</label>
          <input
            v-model="security.currentPassword"
            type="password"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">New Password</label>
          <input
            v-model="security.newPassword"
            type="password"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900"
          />
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          :disabled="isUpdatingPassword"
          @click="handleUpdatePassword"
          class="px-6 py-2.5 bg-indigo-950 text-white font-medium text-sm rounded-xl hover:bg-indigo-900 transition-colors disabled:opacity-50"
        >
          {{ isUpdatingPassword ? 'Updating...' : 'Update Password' }}
        </button>
      </div>
    </div>
  </div>
</template>