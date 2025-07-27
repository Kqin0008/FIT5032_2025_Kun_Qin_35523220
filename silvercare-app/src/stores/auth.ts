import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'senior' | 'caregiver'
  fullName: string
  age?: number
  location?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  // Mock users for demonstration
  const mockUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@silvercare.com',
      role: 'admin',
      fullName: '管理员'
    },
    {
      id: 2,
      username: 'senior1',
      email: 'zhang@example.com',
      role: 'senior',
      fullName: '张大爷',
      age: 75,
      location: '北京市'
    },
    {
      id: 3,
      username: 'caregiver1',
      email: 'nurse@example.com',
      role: 'caregiver',
      fullName: '李护士',
      location: '北京市'
    }
  ]

  // Getters
  const currentUser = computed(() => user.value)
  const userRole = computed(() => user.value?.role || null)
  const isSenior = computed(() => user.value?.role === 'senior')
  const isCaregiver = computed(() => user.value?.role === 'caregiver')
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Actions
  function login(username: string, password: string): boolean {
    // Simple validation - in real app, this would be an API call
    const foundUser = mockUsers.find(u => u.username === username)
    
    if (foundUser && password === 'password123') {
      user.value = foundUser
      isAuthenticated.value = true
      
      // Store in localStorage for persistence
      localStorage.setItem('silvercare_user', JSON.stringify(foundUser))
      localStorage.setItem('silvercare_auth', 'true')
      
      return true
    }
    return false
  }

  function register(userData: Omit<User, 'id'>): boolean {
    // In real app, this would be an API call
    const newUser: User = {
      ...userData,
      id: Date.now() // Simple ID generation
    }
    
    mockUsers.push(newUser)
    user.value = newUser
    isAuthenticated.value = true
    
    // Store in localStorage
    localStorage.setItem('silvercare_user', JSON.stringify(newUser))
    localStorage.setItem('silvercare_auth', 'true')
    
    return true
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('silvercare_user')
    localStorage.removeItem('silvercare_auth')
  }

  function initializeAuth() {
    const storedAuth = localStorage.getItem('silvercare_auth')
    const storedUser = localStorage.getItem('silvercare_user')
    
    if (storedAuth === 'true' && storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        logout()
      }
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    // Getters
    currentUser,
    userRole,
    isSenior,
    isCaregiver,
    isAdmin,
    // Actions
    login,
    register,
    logout,
    initializeAuth
  }
})