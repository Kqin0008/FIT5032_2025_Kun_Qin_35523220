<template>
  <div class="center-layout">
    <div class="auth-page">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            id="name" 
            v-model="name" 
            type="text" 
            required 
            aria-describedby="name-error"
            @keydown.enter="handleRegister"
            aria-label="User name"
          />
          <span v-if="nameError" id="name-error" class="error" role="alert" aria-live="polite">{{ nameError }}</span>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            required 
            aria-describedby="email-error"
            @keydown.enter="handleRegister"
            aria-label="Email address"
          />
          <span v-if="emailError" id="email-error" class="error" role="alert" aria-live="polite">{{ emailError }}</span>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            required 
            aria-describedby="password-error"
            @keydown.enter="handleRegister"
            aria-label="Password"
          />
          <span v-if="passwordError" id="password-error" class="error" role="alert" aria-live="polite">{{ passwordError }}</span>
        </div>
        <div class="form-group">
          <label for="role">Role</label>
          <select 
            id="role" 
            v-model="role" 
            required
            @keydown.enter="handleRegister"
            aria-label="User role"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button 
          class="auth-btn" 
          type="submit"
          @keydown.space.prevent="handleRegister"
          @keydown.enter="handleRegister"
          aria-label="Register button"
        >Register</button>
        <div v-if="registerError" class="error" role="alert" aria-live="polite">{{ registerError }}</div>
        <div v-if="registerSuccess" class="success" role="alert" aria-live="polite">register successfully! Redirecting to home page...</div>
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
import { register, authState } from '../auth.js';
import { onMounted, onUnmounted } from 'vue';
import { initializeAuth, cleanupAuth } from '../auth.js';
// Firebase services are imported in auth.js and used here

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
const loading = ref(false);

// Initialize auth when component mounts
onMounted(() => {
  initializeAuth();
  // Redirect if already authenticated
  if (authState.isAuthenticated) {
    router.push('/');
  }
});

// Cleanup auth listener when component unmounts
onUnmounted(() => {
  cleanupAuth();
});

function validateName(val) {
  return val.length >= 2;
}

function validateEmail(val) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
}

function validatePassword(val) {
  return val.length >= 6;
}

async function handleRegister() {
  nameError.value = '';
  emailError.value = '';
  passwordError.value = '';
  registerError.value = '';
  registerSuccess.value = '';
  loading.value = true;

  // Validate inputs
  if (!validateName(name.value)) {
    nameError.value = 'Name must be at least 2 characters';
    loading.value = false;
    return;
  }

  if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address';
    loading.value = false;
    return;
  }

  if (!validatePassword(password.value)) {
    passwordError.value = 'Password must be at least 6 characters';
    loading.value = false;
    return;
  }

  try {
    console.log('Starting registration process');
    await register(email.value, password.value, name.value, role.value);
    console.log('Registration successful');
    
    // 设置成功状态
    registerSuccess.value = true;
    console.log('registerSuccess set to true');
    
    // 移除不必要的nextTick等待
    console.log('Success message should be visible');
    
    // 缩短延迟时间为1秒
    setTimeout(() => {
      console.log('Redirecting to home page');
      router.push('/');
      registerSuccess.value = false; // 跳转后隐藏提示
    }, 1000);
  } catch (error) {
    registerError.value = error.message;
    // 特别处理邮箱已存在的错误
    if (error.message.includes('auth/email-already-in-use')) {
      registerError.value = 'This email is already registered. Please log in.';
    }
  } finally {
    loading.value = false;
  }
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
input,
select {
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}
input:focus,
select:focus {
  border-color: #1ab3a6;
  outline: 2px solid #1ab3a6;
  outline-offset: 2px;
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
  outline: none;
}
.auth-btn:focus {
  outline: 2px solid #1ab3a6;
  outline-offset: 2px;
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