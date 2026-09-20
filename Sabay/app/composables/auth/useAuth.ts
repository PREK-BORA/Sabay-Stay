import { doc, setDoc, getDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { computed, navigateTo, useNuxtApp, useState } from '#imports'

const resolveRole = (role?: string) => {
  if (role === 'super_admin' || role === 'admin') return role
  if (role === 'owner') return 'owner'
  return 'user'
}

const isAdminRole = (role?: string) => role === 'admin' || role === 'super_admin'

export const useAuth = () => {
  // Global reactive user state across Nuxt app
  const user = useState<any>('auth_user', () => null)

  // Sync state with localStorage safely on client side initialization
  if (import.meta.client && !user.value) {
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        localStorage.removeItem('auth_user')
      }
    }
  }

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => isAdminRole(user.value?.role))

  // Helper function to update reactive state and localStorage safely
  const setUserSession = (userData: any) => {
    user.value = userData
    if (import.meta.client) {
      if (userData) {
        localStorage.setItem('auth_user', JSON.stringify(userData))
        localStorage.setItem('sabaystay-user', JSON.stringify(userData))
        localStorage.setItem('sabaystay-authenticated', 'true')
      } else {
        localStorage.removeItem('auth_user')
        localStorage.removeItem('sabaystay-user')
        localStorage.removeItem('sabaystay-authenticated')
      }
    }
  }

  const updateUser = (userData: any) => {
    const updatedUser = { ...(user.value || {}), ...userData }
    setUserSession(updatedUser)
    if (import.meta.client) {
      localStorage.setItem('sabaystay-user', JSON.stringify(updatedUser))
      localStorage.setItem('sabaystay-authenticated', 'true')
    }
  }

  // 1. មុខងារ Register + រក្សាទុកក្នុង Firebase Firestore
  const register = async (userData: { 
    name: string; 
    email: string; 
    password?: string; 
    role?: string; 
    avatar?: string; 
    phone?: string; 
    country?: string 
  }) => {
    const { $auth: auth, $db: db } = useNuxtApp()

    const roleValue = resolveRole(userData.role)
    const isAdminUser = isAdminRole(roleValue)

    try {
      let uid = String(Date.now())

      // ប្រសិនបើប្រើ Firebase Auth
      if (auth && userData.password) {
        const userCred = await createUserWithEmailAndPassword(auth as any, userData.email, userData.password)
        uid = userCred.user.uid
      }

      const targetCollection = roleValue === 'owner' ? 'owner' : 'user'

      const newUserPayload = {
        id: uid,
        name: userData.name,
        email: userData.email,
        role: roleValue,
        permissions: isAdminUser ? ['all'] : ['read'],
        avatar: userData.avatar || '',
        phone: userData.phone || '',
        country: userData.country || 'Cambodia',
        status: 'active', // Changed from 'Pending' to 'active' for automatic acceptance
        createdAt: new Date().toISOString()
      }

      // 🔴 រក្សាទុកចូល Firestore Database ( Collection 'user' ឬ 'owner' )
      if (db) {
        await setDoc(doc(db as any, targetCollection, uid), newUserPayload)
      }

      return { success: true, user: newUserPayload }
    } catch (error) {
      console.error('Error saving user to Firestore:', error)
      throw error
    }
  }

  // 2. មុខងារ Login
  const login = async (credentials: { email: string; password?: string; role?: string }) => {
    const { $auth: auth, $db: db } = useNuxtApp()

    const roleValue = resolveRole(credentials.role)
    const isAdminUser = isAdminRole(roleValue)

    try {
      let loggedUser: any = {
        id: '',
        name: isAdminUser ? 'Yoem Makara' : 'User Account',
        email: credentials.email,
        role: roleValue,
        permissions: isAdminUser ? ['all'] : ['read'],
        avatar: '',
        phone: ''
      }

      if (auth && credentials.password) {
        const userCred = await signInWithEmailAndPassword(auth as any, credentials.email, credentials.password)
        loggedUser.id = userCred.user.uid
        const profileDocuments = db
          ? await Promise.allSettled([
              getDoc(doc(db as any, 'admin', userCred.user.uid)),
              getDoc(doc(db as any, 'user', userCred.user.uid)),
              getDoc(doc(db as any, 'owner', userCred.user.uid))
            ])
          : []
        const adminDoc = profileDocuments[0]?.status === 'fulfilled' ? profileDocuments[0].value : null
        const userDoc = profileDocuments[1]?.status === 'fulfilled' ? profileDocuments[1].value : null
        const ownerDoc = profileDocuments[2]?.status === 'fulfilled' ? profileDocuments[2].value : null
        
        const profileDoc = adminDoc?.exists() ? adminDoc : (userDoc?.exists() ? userDoc : ownerDoc)

        if (profileDoc?.exists()) {
          const userDataFromDb = profileDoc.data() as any
          loggedUser = {
            id: userCred.user.uid,
            ...userDataFromDb,
            email: userDataFromDb?.email || credentials.email,
            role: resolveRole(userDataFromDb?.role),
            permissions: userDataFromDb?.permissions || (isAdminRole(userDataFromDb?.role) ? ['all'] : ['read'])
          }
        }
      } else {
        throw new Error('Authentication service is unavailable.')
      }

      // រក្សាទុកក្នុង State & LocalStorage
      setUserSession(loggedUser)

      if (isAdminRole(loggedUser.role)) {
        return navigateTo('/admin')
      } else {
        return navigateTo('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // 3. មុខងារ Logout
  const logout = async () => {
    const { $auth: auth } = useNuxtApp()
    if (auth) {
      try {
        await signOut(auth as any)
      } catch (e) {
        console.error('Signout error:', e)
      }
    }

    setUserSession(null)
    return navigateTo('/auth/login')
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    updateUser,
    register,
    login,
    logout
  }
}