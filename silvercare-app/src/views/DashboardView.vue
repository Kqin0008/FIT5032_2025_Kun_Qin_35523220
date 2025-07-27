<template>
  <div class="dashboard">
    <div class="container py-4">
      <!-- Welcome Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="welcome-card">
            <div class="row align-items-center">
              <div class="col-lg-8">
                <h1 class="welcome-title">
                  欢迎回来，{{ authStore.currentUser?.fullName }}！
                </h1>
                <p class="welcome-subtitle">
                  <i class="bi bi-calendar3 me-2"></i>
                  今天是 {{ formatDate(new Date()) }}
                </p>
                <p class="text-muted">
                  希望您今天身体健康，心情愉快！
                </p>
              </div>
              <div class="col-lg-4 text-lg-end">
                <div class="user-info">
                  <div class="profile-avatar">
                    <i class="bi bi-person-fill"></i>
                  </div>
                  <div class="user-role-badge">
                    <span class="badge" :class="roleClass">
                      {{ roleText }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card stat-card">
            <div class="card-body text-center">
              <i class="bi bi-heart-pulse-fill stat-icon text-primary"></i>
              <h3 class="stat-number">{{ dataStore.recentHealthTips.length }}</h3>
              <p class="stat-label text-muted">最新健康资讯</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card stat-card">
            <div class="card-body text-center">
              <i class="bi bi-calendar-event stat-icon text-success"></i>
              <h3 class="stat-number">{{ dataStore.upcomingEvents.length }}</h3>
              <p class="stat-label text-muted">即将开始的活动</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card stat-card">
            <div class="card-body text-center">
              <i class="bi bi-star-fill stat-icon text-warning"></i>
              <h3 class="stat-number">{{ dataStore.averageRating }}</h3>
              <p class="stat-label text-muted">平台评分</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card stat-card">
            <div class="card-body text-center">
              <i class="bi bi-people-fill stat-icon text-info"></i>
              <h3 class="stat-number">{{ dataStore.totalRatings }}</h3>
              <p class="stat-label text-muted">用户评价</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="row">
        <!-- Recent Health Tips -->
        <div class="col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">
                <i class="bi bi-heart-pulse me-2 text-primary"></i>
                最新健康资讯
              </h5>
              <router-link to="/health-tips" class="btn btn-outline-primary btn-sm">
                查看全部
              </router-link>
            </div>
            <div class="card-body">
              <div v-if="dataStore.recentHealthTips.length === 0" class="text-center text-muted py-4">
                <i class="bi bi-info-circle fs-1 mb-3"></i>
                <p>暂无健康资讯</p>
              </div>
              <div v-else>
                <div 
                  v-for="tip in dataStore.recentHealthTips.slice(0, 3)" 
                  :key="tip.id"
                  class="health-tip-item mb-3"
                >
                  <div class="d-flex align-items-start">
                    <div class="tip-icon me-3">
                      <i class="bi bi-bookmark-heart-fill text-primary"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="tip-title">{{ tip.title }}</h6>
                      <p class="tip-content text-muted small">
                        {{ tip.content.slice(0, 80) }}{{ tip.content.length > 80 ? '...' : '' }}
                      </p>
                      <small class="text-muted">
                        <i class="bi bi-calendar3 me-1"></i>
                        {{ formatDate(new Date(tip.date)) }}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Events -->
        <div class="col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">
                <i class="bi bi-calendar-event me-2 text-success"></i>
                即将开始的活动
              </h5>
              <router-link to="/events" class="btn btn-outline-success btn-sm">
                查看全部
              </router-link>
            </div>
            <div class="card-body">
              <div v-if="dataStore.upcomingEvents.length === 0" class="text-center text-muted py-4">
                <i class="bi bi-calendar-x fs-1 mb-3"></i>
                <p>暂无即将开始的活动</p>
              </div>
              <div v-else>
                <div 
                  v-for="event in dataStore.upcomingEvents.slice(0, 3)" 
                  :key="event.id"
                  class="event-item mb-3"
                >
                  <div class="event-card border-start border-3 border-success p-3 bg-light">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <h6 class="event-title mb-1">{{ event.title }}</h6>
                      <span class="badge bg-success">{{ event.category }}</span>
                    </div>
                    <p class="event-description text-muted small mb-2">
                      {{ event.description.slice(0, 60) }}{{ event.description.length > 60 ? '...' : '' }}
                    </p>
                    <div class="event-details">
                      <small class="text-muted d-block">
                        <i class="bi bi-calendar3 me-1"></i>
                        {{ formatDate(new Date(event.date)) }} {{ event.time }}
                      </small>
                      <small class="text-muted d-block">
                        <i class="bi bi-geo-alt me-1"></i>
                        {{ event.location }}
                      </small>
                      <small class="text-muted">
                        <i class="bi bi-people me-1"></i>
                        {{ event.enrolled }}/{{ event.capacity }} 人
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-lightning-charge me-2 text-warning"></i>
                快速操作
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-lg-3 col-md-6">
                  <router-link to="/health-tips" class="quick-action-card">
                    <div class="text-center">
                      <i class="bi bi-heart-pulse-fill fs-1 text-primary mb-3"></i>
                      <h6>浏览健康资讯</h6>
                      <p class="text-muted small">查看最新的健康知识和小贴士</p>
                    </div>
                  </router-link>
                </div>
                <div class="col-lg-3 col-md-6">
                  <router-link to="/events" class="quick-action-card">
                    <div class="text-center">
                      <i class="bi bi-calendar-plus fs-1 text-success mb-3"></i>
                      <h6>报名参加活动</h6>
                      <p class="text-muted small">参与社区健康活动和讲座</p>
                    </div>
                  </router-link>
                </div>
                <div class="col-lg-3 col-md-6">
                  <router-link to="/ratings" class="quick-action-card">
                    <div class="text-center">
                      <i class="bi bi-star fs-1 text-warning mb-3"></i>
                      <h6>查看用户评价</h6>
                      <p class="text-muted small">了解其他用户的使用体验</p>
                    </div>
                  </router-link>
                </div>
                <div class="col-lg-3 col-md-6">
                  <router-link to="/profile" class="quick-action-card">
                    <div class="text-center">
                      <i class="bi bi-person-gear fs-1 text-info mb-3"></i>
                      <h6>个人设置</h6>
                      <p class="text-muted small">管理个人信息和偏好设置</p>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Quick Access (only for admin users) -->
      <div v-if="authStore.isAdmin" class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-shield-check me-2"></i>
                管理员面板
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-4">
                  <router-link to="/admin" class="quick-action-card border-primary">
                    <div class="text-center">
                      <i class="bi bi-gear-fill fs-1 text-primary mb-3"></i>
                      <h6>系统管理</h6>
                      <p class="text-muted small">管理用户、内容和系统设置</p>
                    </div>
                  </router-link>
                </div>
                <div class="col-md-4">
                  <div class="card text-center">
                    <div class="card-body">
                      <i class="bi bi-people fs-1 text-info mb-3"></i>
                      <h6>用户统计</h6>
                      <p class="text-muted small">总用户数: <strong>1,234</strong></p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card text-center">
                    <div class="card-body">
                      <i class="bi bi-activity fs-1 text-success mb-3"></i>
                      <h6>系统状态</h6>
                      <p class="text-muted small">
                        <span class="badge bg-success">正常运行</span>
                      </p>
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
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/data'

const authStore = useAuthStore()
const dataStore = useDataStore()

// Computed properties
const roleClass = computed(() => {
  switch (authStore.currentUser?.role) {
    case 'admin':
      return 'bg-primary'
    case 'senior':
      return 'bg-success'
    case 'caregiver':
      return 'bg-info'
    default:
      return 'bg-secondary'
  }
})

const roleText = computed(() => {
  switch (authStore.currentUser?.role) {
    case 'admin':
      return '管理员'
    case 'senior':
      return '老年用户'
    case 'caregiver':
      return '护理人员'
    default:
      return '用户'
  }
})

// Utility functions
function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

onMounted(() => {
  // Initialize data if needed
  dataStore.initializeData()
})
</script>

<style scoped>
.dashboard {
  background: #f8f9fa;
  min-height: 100vh;
}

.welcome-card {
  background: linear-gradient(135deg, #4ECDC4, #45B7AF);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.welcome-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
}

.user-role-badge {
  text-align: center;
}

.stat-card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  margin-bottom: 0;
}

.health-tip-item {
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.health-tip-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.tip-icon {
  font-size: 1.2rem;
  margin-top: 0.2rem;
}

.tip-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.tip-content {
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.event-item {
  margin-bottom: 1rem;
}

.event-card {
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.event-card:hover {
  background-color: #e8f5e8 !important;
}

.event-title {
  font-weight: 600;
  color: #2c3e50;
}

.event-description {
  line-height: 1.4;
}

.event-details small {
  margin-bottom: 0.25rem;
}

.quick-action-card {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  transition: all 0.3s ease;
  height: 100%;
}

.quick-action-card:hover {
  border-color: #4ECDC4;
  background-color: #f8f9fa;
  color: inherit;
  text-decoration: none;
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  .welcome-title {
    font-size: 1.5rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
  
  .profile-avatar {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .stat-icon {
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}
</style>