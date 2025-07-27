import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/health-tips',
      name: 'health-tips',
      component: () => import('../views/HealthTipsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/EventsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: () => import('../views/RatingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true, requiredRole: 'admin' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state from localStorage
  authStore.initializeAuth()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if authentication is required but user is not authenticated
    next('/login')
  } else if (to.meta.requiredRole && authStore.userRole !== to.meta.requiredRole) {
    // Redirect to dashboard if user doesn't have required role
    next('/dashboard')
  } else if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    // Redirect to dashboard if user is already authenticated and trying to access login/register
    next('/dashboard')
  } else {
    next()
  }
})

export default router
