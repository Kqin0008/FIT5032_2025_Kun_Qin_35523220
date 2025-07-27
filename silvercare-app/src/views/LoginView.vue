<template>
  <div class="login-container">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <!-- Left side - Image/Branding -->
        <div class="col-lg-6 d-none d-lg-flex login-banner">
          <div class="d-flex flex-column justify-content-center align-items-center text-white text-center h-100">
            <i class="bi bi-heart-pulse-fill display-1 mb-4"></i>
            <h2 class="mb-3">欢迎回到 SilverCare</h2>
            <p class="lead">
              关爱老年人健康，连接社区资源<br>
              您的健康守护伙伴
            </p>
          </div>
        </div>

        <!-- Right side - Login Form -->
        <div class="col-lg-6 d-flex align-items-center justify-content-center">
          <div class="login-form-container">
            <div class="text-center mb-4">
              <h3 class="fw-bold text-primary">登录账户</h3>
              <p class="text-muted">请输入您的账户信息</p>
            </div>

            <!-- Alert Messages -->
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="alert alert-success" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i>
              {{ successMessage }}
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" novalidate>
              <!-- Username Field -->
              <div class="mb-3">
                <label for="username" class="form-label">用户名</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.username }"
                    id="username"
                    v-model="form.username"
                    placeholder="请输入用户名"
                    required
                  >
                  <div v-if="errors.username" class="invalid-feedback">
                    {{ errors.username }}
                  </div>
                </div>
              </div>

              <!-- Password Field -->
              <div class="mb-3">
                <label for="password" class="form-label">密码</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': errors.password }"
                    id="password"
                    v-model="form.password"
                    placeholder="请输入密码"
                    required
                  >
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    @click="togglePassword"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                  <div v-if="errors.password" class="invalid-feedback">
                    {{ errors.password }}
                  </div>
                </div>
              </div>

              <!-- Remember Me -->
              <div class="mb-3 form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="rememberMe"
                  v-model="form.rememberMe"
                >
                <label class="form-check-label" for="rememberMe">
                  记住我的登录状态
                </label>
              </div>

              <!-- Submit Button -->
              <div class="d-grid mb-3">
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="loading"></span>
                  <span v-else>登录</span>
                </button>
              </div>
            </form>

            <!-- Demo Accounts -->
            <div class="demo-accounts mb-4">
              <h6 class="text-muted mb-3">演示账户：</h6>
              <div class="row g-2">
                <div class="col-12">
                  <button 
                    class="btn btn-outline-primary btn-sm w-100"
                    @click="loginAsDemo('admin')"
                  >
                    管理员账户 (admin/password123)
                  </button>
                </div>
                <div class="col-12">
                  <button 
                    class="btn btn-outline-success btn-sm w-100"
                    @click="loginAsDemo('senior1')"
                  >
                    老年用户 (senior1/password123)
                  </button>
                </div>
                <div class="col-12">
                  <button 
                    class="btn btn-outline-info btn-sm w-100"
                    @click="loginAsDemo('caregiver1')"
                  >
                    护理人员 (caregiver1/password123)
                  </button>
                </div>
              </div>
            </div>

            <!-- Register Link -->
            <div class="text-center">
              <p class="text-muted">
                还没有账户？
                <router-link to="/register" class="text-primary text-decoration-none">
                  立即注册
                </router-link>
              </p>
              <router-link to="/" class="text-muted text-decoration-none">
                <i class="bi bi-arrow-left me-1"></i>
                返回首页
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// UI state
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Form validation errors
const errors = reactive({
  username: '',
  password: ''
})

// Validation functions
function validateForm(): boolean {
  // Reset errors
  errors.username = ''
  errors.password = ''

  let isValid = true

  // Username validation
  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = '用户名至少需要3个字符'
    isValid = false
  }

  // Password validation
  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码至少需要6个字符'
    isValid = false
  }

  return isValid
}

// Toggle password visibility
function togglePassword() {
  showPassword.value = !showPassword.value
}

// Handle login
async function handleLogin() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const success = authStore.login(form.username, form.password)
    
    if (success) {
      successMessage.value = '登录成功！正在跳转...'
      
      // Redirect after success message
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } else {
      errorMessage.value = '用户名或密码错误，请检查后重试'
    }
  } catch (error) {
    errorMessage.value = '登录失败，请稍后重试'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

// Demo login function
function loginAsDemo(username: string) {
  form.username = username
  form.password = 'password123'
  handleLogin()
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.login-banner {
  background: linear-gradient(135deg, #4ECDC4, #45B7AF);
  position: relative;
}

.login-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}

.login-banner > div {
  position: relative;
  z-index: 1;
}

.login-form-container {
  max-width: 400px;
  width: 100%;
  padding: 2rem;
}

.form-control:focus {
  border-color: #4ECDC4;
  box-shadow: 0 0 0 0.2rem rgba(78, 205, 196, 0.25);
}

.btn-primary {
  background-color: #4ECDC4;
  border-color: #4ECDC4;
}

.btn-primary:hover {
  background-color: #45B7AF;
  border-color: #45B7AF;
}

.demo-accounts {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}

.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .login-form-container {
    padding: 1rem;
  }
}
</style>