import { doc, setDoc, getDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

const resolveRole = (role?: string, email?: string) => {
  if (role === 'super_admin' || role === 'admin') return role
  if (email?.toLowerCase().includes('admin')) return 'admin'
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
      } else {
        localStorage.removeItem('auth_user')
      }
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

    const roleValue = resolveRole(userData.role, userData.email)
    const isAdminUser = isAdminRole(roleValue)

    try {
      let uid = String(Date.now())

      // ប្រសិនបើប្រើ Firebase Auth
      if (auth && userData.password) {
        const userCred = await createUserWithEmailAndPassword(auth as any, userData.email, userData.password)
        uid = userCred.user.uid
      }

      const newUser = {
        id: uid,
        name: userData.name,
        email: userData.email,
        role: roleValue,
        permissions: isAdminUser ? ['all'] : ['read'],
        avatar: userData.avatar || '',
        phone: userData.phone || '',
        country: userData.country || 'Cambodia',
        createdAt: new Date().toISOString()
      }

      // 🔴 រក្សាទុកចូល Firestore Database ( Collection 'user' )
      if (db) {
        await setDoc(doc(db as any, 'user', uid), {
          name: userData.name,
          email: userData.email,
          role: roleValue,
          permissions: isAdminUser ? ['all'] : ['read'],
          avatar: userData.avatar || '',
          phone: userData.phone || '',
          country: userData.country || 'Cambodia',
          status: 'Pending',
          createdAt: new Date().toISOString()
        })
      }

      // រក្សាទុកក្នុង State & LocalStorage
      setUserSession(newUser)

      if (isAdminUser) {
        return navigateTo('/admin')
      } else {
        return navigateTo('/dashboard')
      }
    } catch (error) {
      console.error('Error saving user to Firestore:', error)
      throw error
    }
  }

  // 2. មុខងារ Login
  const login = async (credentials: { email: string; password?: string; role?: string }) => {
    const { $auth: auth, $db: db } = useNuxtApp()

    const roleValue = resolveRole(credentials.role, credentials.email)
    const isAdminUser = isAdminRole(roleValue)

    try {
      let loggedUser = {
        id: String(Date.now()),
        name: isAdminUser ? 'Administrator' : 'User Account',
        email: credentials.email,
        role: roleValue,
        permissions: isAdminUser ? ['all'] : ['read'],
        avatar: '',
        phone: ''
      }

      if (auth && credentials.password) {
        const userCred = await signInWithEmailAndPassword(auth as any, credentials.email, credentials.password)
        const userDoc = db ? await getDoc(doc(db as any, 'user', userCred.user.uid)) : null
        
        if (userDoc?.exists()) {
          const userDataFromDb = userDoc.data() as any
          loggedUser = {
            id: userCred.user.uid,
            ...userDataFromDb,
            role: resolveRole(userDataFromDb?.role, userDataFromDb?.email || credentials.email),
            permissions: userDataFromDb?.permissions || (isAdminRole(userDataFromDb?.role) ? ['all'] : ['read'])
          }
        }
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
    register,
    login,
    logout
  }
}