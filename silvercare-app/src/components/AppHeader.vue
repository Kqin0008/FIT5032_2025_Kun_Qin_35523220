<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm" v-if="showNavbar">
    <div class="container-fluid">
      <!-- Logo and Brand -->
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <i class="bi bi-heart-pulse-fill text-primary me-2 fs-4"></i>
        <span class="fw-bold text-primary fs-3">SilverCare</span>
      </router-link>

      <!-- Mobile menu toggle -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Menu -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" v-if="!authStore.isAuthenticated">
            <router-link class="nav-link fs-5" to="/">首页</router-link>
          </li>
          <li class="nav-item" v-if="authStore.isAuthenticated">
            <router-link class="nav-link fs-5" to="/dashboard">仪表板</router-link>
          </li>
          <li class="nav-item" v-if="authStore.isAuthenticated">
            <router-link class="nav-link fs-5" to="/health-tips">健康资讯</router-link>
          </li>
          <li class="nav-item" v-if="authStore.isAuthenticated">
            <router-link class="nav-link fs-5" to="/events">活动报名</router-link>
          </li>
          <li class="nav-item" v-if="authStore.isAuthenticated">
            <router-link class="nav-link fs-5" to="/ratings">用户评价</router-link>
          </li>
          <li class="nav-item" v-if="authStore.isAdmin">
            <router-link class="nav-link fs-5" to="/admin">管理后台</router-link>
          </li>
        </ul>

        <!-- User Menu -->
        <ul class="navbar-nav">
          <li class="nav-item dropdown" v-if="authStore.isAuthenticated">
            <a 
              class="nav-link dropdown-toggle d-flex align-items-center fs-5" 
              href="#" 
              id="navbarDropdown" 
              role="button" 
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-person-circle me-2"></i>
              {{ authStore.currentUser?.fullName }}
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/profile">
                  <i class="bi bi-person me-2"></i>个人资料
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item" href="#" @click="logout">
                  <i class="bi bi-box-arrow-right me-2"></i>退出登录
                </a>
              </li>
            </ul>
          </li>
          <li class="nav-item" v-if="!authStore.isAuthenticated">
            <router-link class="nav-link fs-5" to="/login">登录</router-link>
          </li>
          <li class="nav-item" v-if="!authStore.isAuthenticated">
            <router-link class="nav-link fs-5" to="/register">注册</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showNavbar = computed(() => 
  route.name !== 'login' && route.name !== 'register' && route.name !== 'home'
)

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  font-weight: 500;
  padding: 0.75rem 1rem !important;
}

.router-link-active {
  color: #4ECDC4 !important;
  font-weight: bold;
}

@media (max-width: 768px) {
  .navbar-brand span {
    font-size: 1.25rem;
  }
  
  .nav-link {
    font-size: 1.1rem !important;
  }
}
</style>