import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import News from './views/News.vue';
import Event from './views/Event.vue';
import Rating from './views/Rating.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Profile from './views/Profile.vue';
import Favorites from './views/Favorites.vue';
import Search from './views/Search.vue';
import UserManagement from './views/UserManagement.vue';
import TableDemo from './views/TableDemo.vue';
import EmailSender from './views/EmailSender.vue';
import MapView from './views/MapView.vue';


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/news', name: 'News', component: News },
  { path: '/event', name: 'Event', component: Event },
  { path: '/rating', name: 'Rating', component: Rating },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/favorites', name: 'Favorites', component: Favorites },
  { path: '/search', name: 'Search', component: Search },
  { path: '/tables', name: 'TableDemo', component: TableDemo },
  { path: '/email', name: 'EmailSender', component: EmailSender },
  { path: '/map', name: 'MapView', component: MapView },

  { path: '/admin/users', name: 'UserManagement', component: UserManagement,
    beforeEnter: (to, from, next) => {
      if (authState.user?.role !== 'admin') {
        next({ name: 'Home', query: { error: 'Unauthorized' } });
      } else {
        next();
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;