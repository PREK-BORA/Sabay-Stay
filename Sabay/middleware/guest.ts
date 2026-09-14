import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn, user } = useAuth()

  if (isLoggedIn.value) {
    const isAdminUser = user.value?.role === 'admin' || user.value?.role === 'super_admin'
    return navigateTo(isAdminUser ? '/admin' : '/dashboard')
  }
})
