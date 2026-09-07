import { ref } from 'vue'

const user = ref({
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: 'owner' // 'guest' | 'owner'
})

export const useAuth = () => {
  const login = (email, password, role = 'owner') => {
    user.value = {
      name: email.split('@')[0],
      email,
      role
    }
  }

  const logout = () => {
    user.value = null
  }

  const switchRole = (newRole) => {
    if (user.value) {
      user.value.role = newRole
    }
  }

  return {
    user,
    login,
    logout,
    switchRole
  }
}