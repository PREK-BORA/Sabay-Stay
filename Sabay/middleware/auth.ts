import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn, user } = useAuth()

  // 1. If user is already logged in and tries to open auth pages, send them to dashboard
  if (to.path.startsWith('/auth/')) {
    if (isLoggedIn.value) {
      return navigateTo('/dashboard')
    }
    return
  }

  // 2. If not logged in, redirect protected routes to login
  if (!isLoggedIn.value) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }

  // 3. Protect admin routes
  if (to.path.startsWith('/admin') && user.value?.role !== 'admin' && user.value?.role !== 'super_admin') {
    return navigateTo('/dashboard')
  }
})