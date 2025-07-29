<template>
  <div class="center-layout">
    <div class="auth-page">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" v-model="name" type="text" required />
          <span v-if="nameError" class="error">{{ nameError }}</span>
        </div>
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
        <div class="form-group">
          <label for="role">Role</label>
          <select id="role" v-model="role" required>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button class="auth-btn" type="submit">Register</button>
        <div v-if="registerError" class="error">{{ registerError }}</div>
        <div v-if="registerSuccess" class="success">Registration successful!</div>
      </form>
      <div class="switch-link">
        Already have an account? <router-link to="/login">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authState, login } from '../auth.js';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('user');
const nameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const registerError = ref('');
const registerSuccess = ref(false);

function validateEmail(val) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
}
function validatePassword(val) {
  return val.length >= 6;
}
function validateName(val) {
  return val.length >= 2;
}

function saveUserToStorage(user) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
}

function handleRegister() {
  nameError.value = '';
  emailError.value = '';
  passwordError.value = '';
  registerError.value = '';
  if (!validateName(name.value)) {
    nameError.value = 'Name must be at least 2 characters.';
    return;
  }
  if (!validateEmail(email.value)) {
    emailError.value = 'Invalid email format.';
    return;
  }
  if (!validatePassword(password.value)) {
    passwordError.value = 'Password must be at least 6 characters.';
    return;
  }
  // 检查邮箱是否已注册
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.some(u => u.email === email.value)) {
    registerError.value = 'Email already registered.';
    return;
  }
  // 保存到localStorage
  const newUser = { name: name.value, email: email.value, password: password.value, role: role.value };
  saveUserToStorage(newUser);
  registerSuccess.value = true;
  setTimeout(() => {
    login({ name: name.value, email: email.value, role: role.value });
    router.push('/');
  }, 1200);
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
input, select {
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}
input:focus, select:focus {
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
.success {
  color: #52c41a;
  font-size: 0.98rem;
  margin-top: 8px;
}
</style> 