import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { user, isAdmin } = useAuth()

  if (!user.value || !isAdmin.value) {
    return navigateTo('/auth/login')
  }
})