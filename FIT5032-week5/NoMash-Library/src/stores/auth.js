import { ref } from 'vue'

export const isAuthenticated = ref(false)

export function login(username, password) {
  if (username === 'admin' && password === 'Aa.123456') {
    isAuthenticated.value = true
    return true
  }
  return false
}

export function logout() {
  isAuthenticated.value = false
}