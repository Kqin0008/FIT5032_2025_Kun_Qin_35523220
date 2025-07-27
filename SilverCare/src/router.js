import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import News from './views/News.vue';
import Event from './views/Event.vue';
import Rating from './views/Rating.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Profile from './views/Profile.vue';
import Favorites from './views/Favorites.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/news', name: 'News', component: News },
  { path: '/event', name: 'Event', component: Event },
  { path: '/rating', name: 'Rating', component: Rating },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/favorites', name: 'Favorites', component: Favorites },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 