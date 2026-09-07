<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
    <div class="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-serif font-bold text-gray-900">
          {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
        </h1>
        <p class="text-xs text-gray-500 mt-1">
          {{ isSignUp ? 'Sign up to manage or book properties' : 'Sign in to access your hotel dashboard' }}
        </p>
      </div>

      <!-- Mode Toggle -->
      <div class="flex bg-gray-100 p-1 rounded-xl text-xs font-medium">
        <button 
          type="button"
          @click="selectedRole = 'guest'"
          :class="selectedRole === 'guest' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'"
          class="flex-1 py-2 rounded-lg transition-all text-center"
        >
          🧳 Guest Portal
        </button>
        <button 
          type="button"
          @click="selectedRole = 'owner'"
          :class="selectedRole === 'owner' ? 'bg-indigo-950 text-white shadow-sm' : 'text-gray-500'"
          class="flex-1 py-2 rounded-lg transition-all text-center"
        >
          🏨 Property Owner
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="isSignUp">
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
          <input 
            v-model="fullName" 
            type="text" 
            required 
            placeholder="Jane Doe" 
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-950"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            placeholder="owner@hotel.com" 
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-950"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            placeholder="••••••••" 
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-950"
          />
        </div>

        <button 
          type="submit" 
          class="w-full py-3.5 bg-indigo-950 hover:bg-indigo-900 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
        >
          {{ isSignUp ? 'Register Account' : 'Sign In' }}
        </button>
      </form>

      <!-- Footer switch -->
      <div class="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span v-if="!isSignUp">Don't have an account? </span>
        <span v-else>Already have an account? </span>
        <button 
          @click="isSignUp = !isSignUp" 
          class="font-semibold text-indigo-950 hover:underline ml-1"
        >
          {{ isSignUp ? 'Sign In' : 'Sign Up' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const isSignUp = ref(false)
const selectedRole = ref('owner')
const fullName = ref('')
const email = ref('')
const password = ref('')

const handleSubmit = () => {
  login(email.value, password.value, selectedRole.value)
  
  if (selectedRole.value === 'owner') {
    router.push('/Owner/my_hotels')
  } else {
    router.push('/')
  }
}
</script>