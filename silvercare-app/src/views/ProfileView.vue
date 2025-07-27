<template>
  <div class="profile">
    <div class="container py-4">
      <!-- Page Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="page-header">
            <h1 class="page-title">
              <i class="bi bi-person-gear me-3 text-info"></i>
              个人设置
            </h1>
            <p class="page-subtitle text-muted">
              管理您的个人信息和偏好设置
            </p>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Profile Overview -->
        <div class="col-lg-4 mb-4">
          <div class="card profile-card">
            <div class="card-body text-center">
              <div class="profile-avatar">
                <i class="bi bi-person-fill"></i>
              </div>
              <h4 class="card-title">{{ authStore.currentUser?.fullName }}</h4>
              <p class="text-muted mb-3">{{ getRoleText(authStore.currentUser?.role) }}</p>
              <div class="profile-stats">
                <div class="row">
                  <div class="col-4">
                    <div class="stat">
                      <h5>{{ getUserEventCount() }}</h5>
                      <small class="text-muted">已参加活动</small>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="stat">
                      <h5>{{ getUserRatingCount() }}</h5>
                      <small class="text-muted">发表评价</small>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="stat">
                      <h5>{{ getUserJoinDays() }}</h5>
                      <small class="text-muted">加入天数</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card mt-3">
            <div class="card-header">
              <h6 class="card-title mb-0">快速操作</h6>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-primary" @click="changePassword">
                  <i class="bi bi-key me-2"></i>
                  修改密码
                </button>
                <button class="btn btn-outline-success" @click="exportData">
                  <i class="bi bi-download me-2"></i>
                  导出数据
                </button>
                <button class="btn btn-outline-danger" @click="deleteAccount">
                  <i class="bi bi-trash me-2"></i>
                  删除账户
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Settings -->
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs" id="profileTabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link active" 
                    id="basic-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#basic" 
                    type="button" 
                    role="tab"
                  >
                    <i class="bi bi-person me-2"></i>
                    基本信息
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    id="preferences-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#preferences" 
                    type="button" 
                    role="tab"
                  >
                    <i class="bi bi-sliders me-2"></i>
                    偏好设置
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    id="security-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#security" 
                    type="button" 
                    role="tab"
                  >
                    <i class="bi bi-shield-lock me-2"></i>
                    安全设置
                  </button>
                </li>
              </ul>
            </div>
            <div class="card-body">
              <div class="tab-content" id="profileTabsContent">
                <!-- Basic Information -->
                <div class="tab-pane fade show active" id="basic" role="tabpanel">
                  <form @submit.prevent="updateBasicInfo">
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label for="fullName" class="form-label">姓名</label>
                        <input
                          type="text"
                          class="form-control"
                          id="fullName"
                          v-model="profileForm.fullName"
                          required
                        >
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="username" class="form-label">用户名</label>
                        <input
                          type="text"
                          class="form-control"
                          id="username"
                          v-model="profileForm.username"
                          readonly
                        >
                        <div class="form-text">用户名无法修改</div>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="email" class="form-label">邮箱</label>
                        <input
                          type="email"
                          class="form-control"
                          id="email"
                          v-model="profileForm.email"
                          required
                        >
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="role" class="form-label">用户类型</label>
                        <input
                          type="text"
                          class="form-control"
                          id="role"
                          :value="getRoleText(profileForm.role)"
                          readonly
                        >
                        <div class="form-text">用户类型无法修改</div>
                      </div>
                      <div class="col-md-6 mb-3" v-if="authStore.isSenior">
                        <label for="age" class="form-label">年龄</label>
                        <input
                          type="number"
                          class="form-control"
                          id="age"
                          v-model.number="profileForm.age"
                          min="50"
                          max="120"
                        >
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="location" class="form-label">所在地区</label>
                        <input
                          type="text"
                          class="form-control"
                          id="location"
                          v-model="profileForm.location"
                          placeholder="请输入所在城市"
                        >
                      </div>
                      <div class="col-12">
                        <button type="submit" class="btn btn-primary">
                          <i class="bi bi-check-lg me-2"></i>
                          保存更改
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <!-- Preferences -->
                <div class="tab-pane fade" id="preferences" role="tabpanel">
                  <form @submit.prevent="updatePreferences">
                    <h6 class="mb-3">通知设置</h6>
                    <div class="form-check form-switch mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="emailNotifications"
                        v-model="preferences.emailNotifications"
                      >
                      <label class="form-check-label" for="emailNotifications">
                        邮件通知
                      </label>
                      <div class="form-text">接收活动和健康资讯的邮件通知</div>
                    </div>
                    <div class="form-check form-switch mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="smsNotifications"
                        v-model="preferences.smsNotifications"
                      >
                      <label class="form-check-label" for="smsNotifications">
                        短信通知
                      </label>
                      <div class="form-text">接收重要活动的短信提醒</div>
                    </div>
                    <div class="form-check form-switch mb-4">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="pushNotifications"
                        v-model="preferences.pushNotifications"
                      >
                      <label class="form-check-label" for="pushNotifications">
                        推送通知
                      </label>
                      <div class="form-text">接收浏览器推送通知</div>
                    </div>

                    <h6 class="mb-3">内容偏好</h6>
                    <div class="mb-3">
                      <label for="favoriteCategories" class="form-label">感兴趣的内容分类</label>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-check">
                            <input 
                              class="form-check-input" 
                              type="checkbox" 
                              id="nutrition"
                              value="营养健康"
                              v-model="preferences.favoriteCategories"
                            >
                            <label class="form-check-label" for="nutrition">
                              营养健康
                            </label>
                          </div>
                          <div class="form-check">
                            <input 
                              class="form-check-input" 
                              type="checkbox" 
                              id="exercise"
                              value="运动健身"
                              v-model="preferences.favoriteCategories"
                            >
                            <label class="form-check-label" for="exercise">
                              运动健身
                            </label>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-check">
                            <input 
                              class="form-check-input" 
                              type="checkbox" 
                              id="prevention"
                              value="疾病预防"
                              v-model="preferences.favoriteCategories"
                            >
                            <label class="form-check-label" for="prevention">
                              疾病预防
                            </label>
                          </div>
                          <div class="form-check">
                            <input 
                              class="form-check-input" 
                              type="checkbox" 
                              id="mental"
                              value="心理健康"
                              v-model="preferences.favoriteCategories"
                            >
                            <label class="form-check-label" for="mental">
                              心理健康
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label for="language" class="form-label">语言偏好</label>
                      <select class="form-select" id="language" v-model="preferences.language">
                        <option value="zh-CN">简体中文</option>
                        <option value="zh-TW">繁体中文</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <button type="submit" class="btn btn-primary">
                      <i class="bi bi-check-lg me-2"></i>
                      保存偏好
                    </button>
                  </form>
                </div>

                <!-- Security Settings -->
                <div class="tab-pane fade" id="security" role="tabpanel">
                  <div class="row">
                    <div class="col-lg-6">
                      <h6 class="mb-3">密码安全</h6>
                      <form @submit.prevent="changePasswordForm">
                        <div class="mb-3">
                          <label for="currentPassword" class="form-label">当前密码</label>
                          <input
                            type="password"
                            class="form-control"
                            id="currentPassword"
                            v-model="passwordForm.currentPassword"
                            required
                          >
                        </div>
                        <div class="mb-3">
                          <label for="newPassword" class="form-label">新密码</label>
                          <input
                            type="password"
                            class="form-control"
                            id="newPassword"
                            v-model="passwordForm.newPassword"
                            minlength="8"
                            required
                          >
                          <div class="form-text">密码至少8个字符，包含大小写字母和数字</div>
                        </div>
                        <div class="mb-3">
                          <label for="confirmPassword" class="form-label">确认新密码</label>
                          <input
                            type="password"
                            class="form-control"
                            id="confirmPassword"
                            v-model="passwordForm.confirmPassword"
                            required
                          >
                        </div>
                        <button type="submit" class="btn btn-warning">
                          <i class="bi bi-key me-2"></i>
                          更新密码
                        </button>
                      </form>
                    </div>
                    
                    <div class="col-lg-6">
                      <h6 class="mb-3">账户安全</h6>
                      <div class="security-info">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <strong>最后登录时间</strong>
                            <div class="text-muted small">{{ lastLoginTime }}</div>
                          </div>
                          <span class="badge bg-success">安全</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <strong>登录设备</strong>
                            <div class="text-muted small">{{ loginDevice }}</div>
                          </div>
                          <span class="badge bg-info">当前设备</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <strong>账户状态</strong>
                            <div class="text-muted small">正常使用中</div>
                          </div>
                          <span class="badge bg-success">正常</span>
                        </div>
                      </div>
                      
                      <hr>
                      
                      <div class="danger-zone">
                        <h6 class="text-danger mb-3">危险操作</h6>
                        <p class="text-muted small mb-3">
                          以下操作无法撤销，请谨慎操作
                        </p>
                        <button class="btn btn-outline-danger btn-sm me-2" @click="logoutAllDevices">
                          <i class="bi bi-box-arrow-right me-1"></i>
                          登出所有设备
                        </button>
                        <button class="btn btn-outline-danger btn-sm" @click="confirmDeleteAccount">
                          <i class="bi bi-trash me-1"></i>
                          删除账户
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div 
      class="modal fade" 
      id="successModal" 
      tabindex="-1" 
      aria-labelledby="successModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              操作成功
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="关闭"
            ></button>
          </div>
          <div class="modal-body">
            {{ modalMessage }}
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-primary" 
              data-bs-dismiss="modal"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/data'

const authStore = useAuthStore()
const dataStore = useDataStore()

// Form data
const profileForm = reactive({
  fullName: '',
  username: '',
  email: '',
  role: '',
  age: null as number | null,
  location: ''
})

const preferences = reactive({
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  favoriteCategories: ['营养健康', '运动健身'] as string[],
  language: 'zh-CN'
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// State
const modalMessage = ref('')
const lastLoginTime = ref('2024-01-15 14:30:25')
const loginDevice = ref('Chrome浏览器 (Windows)')

// Computed
const getUserEventCount = () => {
  return dataStore.enrolledEvents.length
}

const getUserRatingCount = () => {
  return dataStore.ratings.filter(r => r.userId === authStore.currentUser?.id).length
}

const getUserJoinDays = () => {
  // Mock calculation
  return Math.floor(Math.random() * 365) + 1
}

// Methods
function getRoleText(role: string | undefined): string {
  const texts: { [key: string]: string } = {
    'admin': '管理员',
    'senior': '老年用户',
    'caregiver': '护理人员'
  }
  return texts[role || ''] || '未知'
}

function updateBasicInfo(): void {
  // In a real app, this would update user info on the server
  modalMessage.value = '基本信息更新成功！'
  showModal()
}

function updatePreferences(): void {
  // Save preferences to localStorage
  localStorage.setItem('silvercare_preferences', JSON.stringify(preferences))
  modalMessage.value = '偏好设置保存成功！'
  showModal()
}

function changePasswordForm(): void {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    modalMessage.value = '两次输入的密码不一致！'
    showModal()
    return
  }
  
  if (passwordForm.newPassword.length < 8) {
    modalMessage.value = '密码长度至少8个字符！'
    showModal()
    return
  }
  
  // In a real app, this would validate current password and update
  modalMessage.value = '密码修改成功！请重新登录。'
  showModal()
  
  // Reset form
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

function changePassword(): void {
  // Quick action button
  document.getElementById('security-tab')?.click()
}

function exportData(): void {
  // In a real app, this would generate and download user data
  modalMessage.value = '数据导出请求已提交，我们会通过邮件发送给您。'
  showModal()
}

function deleteAccount(): void {
  confirmDeleteAccount()
}

function confirmDeleteAccount(): void {
  if (confirm('您确定要删除账户吗？此操作无法撤销！')) {
    modalMessage.value = '账户删除请求已提交，我们会在7个工作日内处理。'
    showModal()
  }
}

function logoutAllDevices(): void {
  if (confirm('您确定要登出所有设备吗？')) {
    modalMessage.value = '已成功登出所有设备！'
    showModal()
  }
}

function showModal(): void {
  const modal = new (window as any).bootstrap.Modal(document.getElementById('successModal'))
  modal.show()
}

function initializeForm(): void {
  if (authStore.currentUser) {
    profileForm.fullName = authStore.currentUser.fullName
    profileForm.username = authStore.currentUser.username
    profileForm.email = authStore.currentUser.email
    profileForm.role = authStore.currentUser.role
    profileForm.age = authStore.currentUser.age || null
    profileForm.location = authStore.currentUser.location || ''
  }
  
  // Load preferences from localStorage
  const storedPreferences = localStorage.getItem('silvercare_preferences')
  if (storedPreferences) {
    try {
      Object.assign(preferences, JSON.parse(storedPreferences))
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
  }
}

onMounted(() => {
  initializeForm()
})
</script>

<style scoped>
.profile {
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.1rem;
}

.profile-card {
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  background: linear-gradient(135deg, #fff, #f8f9fa);
}

.profile-avatar {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #4ECDC4, #45B7AF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  margin: 0 auto 2rem;
}

.profile-stats .stat {
  text-align: center;
  padding: 0.5rem;
}

.profile-stats .stat h5 {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.nav-tabs .nav-link {
  border: none;
  color: #6c757d;
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  background: white;
  color: #4ECDC4;
  border-bottom: 2px solid #4ECDC4;
}

.nav-tabs .nav-link:hover {
  border: none;
  color: #4ECDC4;
}

.form-control:focus,
.form-select:focus {
  border-color: #4ECDC4;
  box-shadow: 0 0 0 0.2rem rgba(78, 205, 196, 0.25);
}

.form-check-input:checked {
  background-color: #4ECDC4;
  border-color: #4ECDC4;
}

.security-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.danger-zone {
  background: #fff5f5;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #fed7d7;
}

.card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}

.card-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  border-radius: 15px 15px 0 0 !important;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
  
  .nav-tabs .nav-link {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
}
</style>