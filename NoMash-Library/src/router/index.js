import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/stores/auth'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import AddBookView from '@/views/AddBookView.vue'
import WeatherView from '@/views/WeatherView.vue'
import CountBookAPI from '@/views/CountBookAPI.vue'


const routes = [
  { path: '/', component: () => import('@/views/HomeView.vue') },
  { path: '/about', component: () => import('@/views/AboutView.vue') },
  { path: '/login', component: () => import('@/views/LoginView.vue') },
  { path: '/access-denied', component: () => import('@/views/AccessDenied.vue') },
  { path: '/FireLogin', name: 'FireLogin', component: FirebaseSigninView},
  { path: '/FireRegister', name: 'FireRegister', component: FirebaseRegisterView},
  { path: '/addbook', name:'AddBook',component: AddBookView},
  { path: '/weathercheck', name: 'WeatherCheck', component: WeatherView},
  { path: '/CountBookAPI', name: 'CountBookAPI', component: CountBookAPI},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  if (to.path === '/about' && !isAuthenticated.value) {
    next('/access-denied')
  } else {
    next()
  }
})

export default router