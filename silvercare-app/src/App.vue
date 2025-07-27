<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/data'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const dataStore = useDataStore()

const isLoginPage = computed(() => 
  route.name === 'login' || route.name === 'register' || route.name === 'home'
)

function logout() {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  // Initialize stores
  authStore.initializeAuth()
  dataStore.initializeData()
})
</script>

<template>
  <div id="app">
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm" v-if="!isLoginPage">
      <div class="container-fluid">
        <!-- Logo and Brand -->
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <i class="bi bi-heart-pulse-fill text-primary me-2 fs-4"></i>
          <span class="fw-bold text-primary">SilverCare</span>
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
              <router-link class="nav-link" to="/">首页</router-link>
            </li>
            <li class="nav-item" v-if="authStore.isAuthenticated">
              <router-link class="nav-link" to="/dashboard">仪表板</router-link>
            </li>
            <li class="nav-item" v-if="authStore.isAuthenticated">
              <router-link class="nav-link" to="/health-tips">健康资讯</router-link>
            </li>
            <li class="nav-item" v-if="authStore.isAuthenticated">
              <router-link class="nav-link" to="/events">活动报名</router-link>
            </li>
            <li class="nav-item" v-if="authStore.isAuthenticated">
              <router-link class="nav-link" to="/ratings">用户评价</router-link>
            </li>
            <li class="nav-item" v-if="authStore.isAdmin">
              <router-link class="nav-link" to="/admin">管理后台</router-link>
            </li>
          </ul>

          <!-- User Menu -->
          <ul class="navbar-nav">
            <li class="nav-item dropdown" v-if="authStore.isAuthenticated">
              <a 
                class="nav-link dropdown-toggle d-flex align-items-center" 
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
              <router-link class="nav-link" to="/login">登录</router-link>
            </li>
            <li class="nav-item" v-if="!authStore.isAuthenticated">
              <router-link class="nav-link" to="/register">注册</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-light text-center text-muted py-3" v-if="!isLoginPage">
      <div class="container">
        <small>© 2024 SilverCare. 关爱老年人健康，连接社区资源。</small>
      </div>
    </footer>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar-brand {
  font-size: 1.5rem;
}

.router-link-active {
  font-weight: bold;
}

main {
  flex: 1;
}
</style>
