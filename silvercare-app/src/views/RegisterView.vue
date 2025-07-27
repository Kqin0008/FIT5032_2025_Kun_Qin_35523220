<template>
  <div class="register-container">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <!-- Left side - Registration Form -->
        <div class="col-lg-6 d-flex align-items-center justify-content-center">
          <div class="register-form-container">
            <div class="text-center mb-4">
              <h3 class="fw-bold text-primary">创建新账户</h3>
              <p class="text-muted">加入 SilverCare 大家庭</p>
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

            <!-- Registration Form -->
            <form @submit.prevent="handleRegister" novalidate>
              <!-- Full Name -->
              <div class="mb-3">
                <label for="fullName" class="form-label">姓名 *</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-person-fill"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.fullName }"
                    id="fullName"
                    v-model="form.fullName"
                    placeholder="请输入您的真实姓名"
                    required
                  >
                  <div v-if="errors.fullName" class="invalid-feedback">
                    {{ errors.fullName }}
                  </div>
                </div>
              </div>

              <!-- Username -->
              <div class="mb-3">
                <label for="username" class="form-label">用户名 *</label>
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

              <!-- Email -->
              <div class="mb-3">
                <label for="email" class="form-label">邮箱 *</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    id="email"
                    v-model="form.email"
                    placeholder="请输入邮箱地址"
                    required
                  >
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label for="password" class="form-label">密码 *</label>
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
                <div class="form-text">
                  密码至少包含8个字符，包括大小写字母和数字
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">确认密码 *</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-lock-fill"></i>
                  </span>
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    placeholder="请再次输入密码"
                    required
                  >
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    @click="toggleConfirmPassword"
                  >
                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                  <div v-if="errors.confirmPassword" class="invalid-feedback">
                    {{ errors.confirmPassword }}
                  </div>
                </div>
              </div>

              <!-- Role Selection -->
              <div class="mb-3">
                <label for="role" class="form-label">用户类型 *</label>
                <select 
                  class="form-select"
                  :class="{ 'is-invalid': errors.role }"
                  id="role"
                  v-model="form.role"
                  required
                >
                  <option value="">请选择用户类型</option>
                  <option value="senior">老年用户</option>
                  <option value="caregiver">护理人员</option>
                </select>
                <div v-if="errors.role" class="invalid-feedback">
                  {{ errors.role }}
                </div>
              </div>

              <!-- Additional Fields for Senior Users -->
              <div v-if="form.role === 'senior'" class="mb-3">
                <label for="age" class="form-label">年龄</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-calendar"></i>
                  </span>
                  <input
                    type="number"
                    class="form-control"
                    :class="{ 'is-invalid': errors.age }"
                    id="age"
                    v-model.number="form.age"
                    placeholder="请输入年龄"
                    min="50"
                    max="120"
                  >
                  <div v-if="errors.age" class="invalid-feedback">
                    {{ errors.age }}
                  </div>
                </div>
              </div>

              <!-- Location -->
              <div class="mb-3">
                <label for="location" class="form-label">所在地区</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-geo-alt"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    id="location"
                    v-model="form.location"
                    placeholder="请输入所在城市"
                  >
                </div>
              </div>

              <!-- Terms Agreement -->
              <div class="mb-3 form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input"
                  :class="{ 'is-invalid': errors.agreeTerms }"
                  id="agreeTerms"
                  v-model="form.agreeTerms"
                  required
                >
                <label class="form-check-label" for="agreeTerms">
                  我已阅读并同意 
                  <a href="#" class="text-primary">服务条款</a> 和 
                  <a href="#" class="text-primary">隐私政策</a>
                </label>
                <div v-if="errors.agreeTerms" class="invalid-feedback">
                  {{ errors.agreeTerms }}
                </div>
              </div>

              <!-- Submit Button -->
              <div class="d-grid mb-3">
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="loading"></span>
                  <span v-else>创建账户</span>
                </button>
              </div>
            </form>

            <!-- Login Link -->
            <div class="text-center">
              <p class="text-muted">
                已有账户？
                <router-link to="/login" class="text-primary text-decoration-none">
                  立即登录
                </router-link>
              </p>
              <router-link to="/" class="text-muted text-decoration-none">
                <i class="bi bi-arrow-left me-1"></i>
                返回首页
              </router-link>
            </div>
          </div>
        </div>

        <!-- Right side - Image/Branding -->
        <div class="col-lg-6 d-none d-lg-flex register-banner">
          <div class="d-flex flex-column justify-content-center align-items-center text-white text-center h-100">
            <i class="bi bi-people-fill display-1 mb-4"></i>
            <h2 class="mb-3">加入 SilverCare</h2>
            <p class="lead">
              成为我们关爱老年人健康的<br>
              社区大家庭的一员
            </p>
            <div class="mt-4">
              <div class="row text-center">
                <div class="col-4">
                  <h4>1000+</h4>
                  <small>用户</small>
                </div>
                <div class="col-4">
                  <h4>50+</h4>
                  <small>活动</small>
                </div>
                <div class="col-4">
                  <h4>4.7★</h4>
                  <small>评分</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = reactive({
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '' as 'senior' | 'caregiver' | '',
  age: null as number | null,
  location: '',
  agreeTerms: false
})

// UI state
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Form validation errors
const errors = reactive({
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  age: '',
  agreeTerms: ''
})

// Validation functions
function validateForm(): boolean {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Full name validation
  if (!form.fullName.trim()) {
    errors.fullName = '请输入姓名'
    isValid = false
  } else if (form.fullName.length < 2) {
    errors.fullName = '姓名至少需要2个字符'
    isValid = false
  }

  // Username validation
  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = '用户名至少需要3个字符'
    isValid = false
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.username = '用户名只能包含字母、数字和下划线'
    isValid = false
  }

  // Email validation
  if (!form.email.trim()) {
    errors.email = '请输入邮箱地址'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = '请输入有效的邮箱地址'
    isValid = false
  }

  // Password validation
  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = '密码至少需要8个字符'
    isValid = false
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
    errors.password = '密码必须包含大小写字母和数字'
    isValid = false
  }

  // Confirm password validation
  if (!form.confirmPassword) {
    errors.confirmPassword = '请确认密码'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  // Role validation
  if (!form.role) {
    errors.role = '请选择用户类型'
    isValid = false
  }

  // Age validation for senior users
  if (form.role === 'senior' && form.age) {
    if (form.age < 50 || form.age > 120) {
      errors.age = '年龄应在50-120岁之间'
      isValid = false
    }
  }

  // Terms agreement validation
  if (!form.agreeTerms) {
    errors.agreeTerms = '请同意服务条款和隐私政策'
    isValid = false
  }

  return isValid
}

// Toggle password visibility
function togglePassword() {
  showPassword.value = !showPassword.value
}

function toggleConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value
}

// Handle registration
async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const userData: Omit<User, 'id'> = {
      username: form.username,
      email: form.email,
      role: form.role as 'senior' | 'caregiver',
      fullName: form.fullName,
      age: form.role === 'senior' ? form.age || undefined : undefined,
      location: form.location || undefined
    }

    const success = authStore.register(userData)
    
    if (success) {
      successMessage.value = '注册成功！正在跳转到仪表板...'
      
      // Redirect after success message
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } else {
      errorMessage.value = '注册失败，请稍后重试'
    }
  } catch (error) {
    errorMessage.value = '注册失败，请稍后重试'
    console.error('Registration error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.register-banner {
  background: linear-gradient(135deg, #4ECDC4, #45B7AF);
  position: relative;
}

.register-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}

.register-banner > div {
  position: relative;
  z-index: 1;
}

.register-form-container {
  max-width: 500px;
  width: 100%;
  padding: 2rem;
  max-height: 100vh;
  overflow-y: auto;
}

.form-control:focus,
.form-select:focus {
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
  .register-form-container {
    padding: 1rem;
  }
}
</style>