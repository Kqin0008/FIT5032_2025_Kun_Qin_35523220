<template>
  <div class="center-layout">
    <div class="auth-page">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required />
          <span v-if="emailError" class="error">{{ emailError }}</span>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" required />
          <span v-if="passwordError" class="error">{{ passwordError }}</span>
        </div>
        <button class="auth-btn" type="submit">Login</button>
        <div v-if="loginError" class="error">{{ loginError }}</div>
      </form>
      <div class="switch-link">
        Don't have an account? <router-link to="/register">Register</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authState, login } from '../auth.js';
import bcrypt from 'bcryptjs';

const router = useRouter();
const email = ref('');
const password = ref('');
const emailError = ref('');
const passwordError = ref('');
const loginError = ref('');

function validateEmail(val) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
}

function validatePassword(val) {
  return val.length >= 6;
}

async function handleLogin() {
  emailError.value = '';
  passwordError.value = '';
  loginError.value = '';
  if (!validateEmail(email.value)) {
    emailError.value = 'Invalid email format.';
    return;
  }
  if (!validatePassword(password.value)) {
    passwordError.value = 'Password must be at least 6 characters.';
    return;
  }
  // 从localStorage读取用户
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email.value);
  if (!user) {
    loginError.value = 'Incorrect email or password.';
    return;
  }
  // 验证密码
  const isPasswordValid = await bcrypt.compare(password.value, user.password);
  if (!isPasswordValid) {
    loginError.value = 'Incorrect email or password.';
    return;
  }
  login({ name: user.name, email: user.email, role: user.role });
  router.push('/');
}
</script>

<style scoped>
.center-layout {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
}
.auth-page {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 40px 32px;
  width: 350px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.auth-page h2 {
  color: #1ab3a6;
  margin-bottom: 24px;
}
.form-group {
  width: 100%;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}
label {
  margin-bottom: 6px;
  color: #333;
  font-weight: 500;
}
input {
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}
input:focus {
  border-color: #1ab3a6;
}
.auth-btn {
  width: 100%;
  background: #1ab3a6;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}
.auth-btn:hover {
  background: #6ed6c5;
}
.error {
  color: #ff4d4f;
  font-size: 0.95rem;
  margin-top: 4px;
}
.switch-link {
  margin-top: 18px;
  font-size: 0.98rem;
}
.switch-link a {
  color: #1ab3a6;
  text-decoration: underline;
}
</style>