import { doc, getDoc } from 'firebase/firestore'
import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp() as any
  const auth = nuxtApp.$auth
  const db = nuxtApp.$db

  if (!auth || !db) {
    return navigateTo('/auth/login')
  }

  // Firebase Auth is initialized in the browser.
  if (import.meta.server) {
    return
  }

  const currentUser = auth.currentUser

  if (!currentUser) {
    return navigateTo('/auth/login')
  }

  try {
    const ownerSnapshot = await getDoc(
      doc(db, 'owner', currentUser.uid)
    )

    if (!ownerSnapshot.exists()) {
      return navigateTo('/dashboard')
    }

    const ownerData = ownerSnapshot.data()

    if (ownerData?.role !== 'owner') {
      return navigateTo('/dashboard')
    }
  } catch (error) {
    console.error('Owner authorization error:', error)
    return navigateTo('/dashboard')
  }
})