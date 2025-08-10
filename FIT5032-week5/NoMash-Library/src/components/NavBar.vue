<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <span v-if="isAuthenticated">
      <button @click="handleLogout">Logout</button>
    </span>
    <span v-else>
      <router-link to="/login">Login</router-link>
    </span>
  </nav>
</template>

<script setup>
import { isAuthenticated, logout } from '@/stores/auth'
import { useRouter } from 'vue-router'
const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>