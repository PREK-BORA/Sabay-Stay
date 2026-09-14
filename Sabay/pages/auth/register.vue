<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: 'guest'
})

const { register } = useAuth()

const countries = [
  { value: 'Cambodia', flag: '🇰🇭' },
  { value: 'Thailand', flag: '🇹🇭' },
  { value: 'Vietnam', flag: '🇻🇳' },
  { value: 'Singapore', flag: '🇸🇬' },
  { value: 'Japan', flag: '🇯🇵' },
  { value: 'United States', flag: '🇺🇸' },
  { value: 'France', flag: '🇫🇷' },
  { value: 'Australia', flag: '🇦🇺' }
]

const form = reactive({
  name: '',
  email: '',
  password: '',
  country: 'Cambodia'
})

const isSubmitting = ref(false)
const registerError = ref('')

const handleRegister = async () => {
  registerError.value = ''

  if (!form.name || !form.email || !form.password) {
    registerError.value = 'Please fill in your name, email, and password.'
    return
  }

  if (form.password.length < 6) {
    registerError.value = 'Password must be at least 6 characters long.'
    return
  }

  try {
    isSubmitting.value = true
    await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      country: form.country
    })
  } catch (error: any) {
    registerError.value = error?.message || 'Registration failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <div>
        <h2 class="text-center text-3xl font-serif font-bold text-slate-900">Create Account</h2>
        <p class="mt-2 text-center text-sm text-slate-600">Join SabayStay today</p>
      </div>

      <form class="mt-8 space-y-4" @submit.prevent="handleRegister">
        <div>
          <label class="block text-sm font-medium text-slate-700">Full Name</label>
          <input v-model="form.name" type="text" required class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-900 outline-none" placeholder="Alex" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Email Address</label>
          <input v-model="form.email" type="email" required class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-900 outline-none" placeholder="alex@example.com" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Password</label>
          <input v-model="form.password" type="password" required class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-900 outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Country</label>
          <select
            v-model="form.country"
            class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-900 outline-none bg-white"
          >
            <option v-for="country in countries" :key="country.value" :value="country.value">
              {{ country.flag }} {{ country.value }}
            </option>
          </select>
        </div>

        <p v-if="registerError" class="text-sm text-rose-600 font-medium">{{ registerError }}</p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3 bg-indigo-900 text-white rounded-xl font-medium hover:bg-indigo-800 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Creating account...' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>