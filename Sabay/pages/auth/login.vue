<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: 'guest'
})

const { login } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const isSubmitting = ref(false)
const loginError = ref('')

const handleLogin = async () => {
  loginError.value = ''

  if (!form.email || !form.password) {
    loginError.value = 'Please fill in both email and password.'
    return
  }

  try {
    isSubmitting.value = true
    await login({
      email: form.email.trim(),
      password: form.password
    })
  } catch (error: any) {
    loginError.value = error?.message || 'Login failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
    <div class="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <div class="text-center space-y-2">
        <h2 class="text-3xl font-serif font-bold text-slate-900">Welcome back</h2>
        <p class="text-sm text-slate-500">Sign in to access your exclusive premium travel experiences.</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="yoemmakaraacyra@gmail.com"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900"
          />
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="rounded border-slate-300 text-indigo-900" />
            <span>Remember me</span>
          </label>
          <NuxtLink to="/auth/forgot-password" class="text-indigo-900 hover:underline">Forgot Password?</NuxtLink>
        </div>

        <p v-if="loginError" class="text-sm text-rose-600 font-medium">{{ loginError }}</p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3 bg-indigo-950 text-white rounded-xl font-medium hover:bg-indigo-900 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Signing in...' : 'Login →' }}
        </button>

        <NuxtLink
          to="/auth/register"
          class="w-full block text-center py-3 border border-emerald-600 text-emerald-700 rounded-xl font-medium hover:bg-emerald-50 transition-all text-sm"
        >
          Register
        </NuxtLink>
      </form>
    </div>
  </div>
</template>