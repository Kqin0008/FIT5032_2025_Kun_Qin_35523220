<template>
  <div class="center-layout">
    <div class="auth-page">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            required 
            aria-describedby="email-error"
            @keydown.enter="handleLogin"
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
            @keydown.enter="handleLogin"
            aria-label="Password"
          />
          <span v-if="passwordError" id="password-error" class="error" role="alert" aria-live="polite">{{ passwordError }}</span>
        </div>
        <button 
          class="auth-btn" 
          type="submit" 
          :disabled="loading"
          @keydown.space.prevent="handleLogin"
          @keydown.enter="handleLogin"
          aria-label="Login button"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <div v-if="loginError" class="error" role="alert" aria-live="polite">{{ loginError }}</div>
        <div v-if="loginSuccess" class="success" role="alert" aria-live="polite">login successfully! Redirecting to home page...</div>
      </form>
      <div class="switch-link">
        Don't have an account? <router-link to="/register">Register</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { login, authState } from '../auth.js';
import { onMounted, onUnmounted } from 'vue';
import { initializeAuth, cleanupAuth } from '../auth.js';

const router = useRouter();
const email = ref('');
const password = ref('');
const emailError = ref('');
const passwordError = ref('');
const loginError = ref('');
const loginSuccess = ref(false);
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

function validateEmail(val) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
}

function validatePassword(val) {
  return val.length >= 6;
}

async function handleLogin() {
  console.log('Login button clicked');
  emailError.value = '';
  passwordError.value = '';
  loginError.value = '';
  loading.value = true;
  console.log('Loading state set to true');

  // Validate inputs
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
    console.log('Attempting to login with email:', email.value);
    await login(email.value, password.value);
    console.log('Login successful');
    
    // 设置成功状态
    loginSuccess.value = true;
    console.log('loginSuccess set to true');
    
    // 移除不必要的nextTick等待
    console.log('Success message should be visible');
    
    // 缩短延迟时间为1秒，并移除alert
    setTimeout(() => {
      console.log('Redirecting to home page');
      // Check if user is admin (不使用alert)
      if (authState.user && authState.user.role === 'admin') {
        console.log('Admin user detected');
        // 可以使用其他方式通知管理员，如控制台日志或自定义模态框
      }
      router.push('/');
      loginSuccess.value = false; // 跳转后隐藏提示
    }, 1000);
  } catch (error) {
    console.error('Login failed:', error);
    loginError.value = error.message || 'Login failed. Please try again.';
  } finally {
    console.log('Setting loading state to false');
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
input {
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}
input:focus {
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
.success {
  color: #52c41a;
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