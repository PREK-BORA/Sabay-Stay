import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useAuth } from '~/composables/auth/useAuth'

export default defineNuxtRouteMiddleware(() => {
  const { user, isAdmin } = useAuth()

  if (!user.value || !isAdmin.value) {
    return navigateTo('/auth/login')
  }
})
