<template>
  <form @submit.prevent="handleLogin">
    <h2>Login</h2>
    <label>Username
      <input v-model="username" required />
    </label>
    <label>Password
      <input type="password" v-model="password" required />
    </label>
    <button type="submit">Login</button>
    <p v-if="error" style="color:red">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/stores/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = () => {
  if (login(username.value, password.value)) {
    router.push('/')           
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>