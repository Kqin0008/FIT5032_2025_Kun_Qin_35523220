<template>
  <div class="main-layout">
  <div v-if="emailSentSuccess" class="email-success-notification" role="alert" aria-live="polite">
    send email successfully
  </div>
    <div class="container">
      <header class="header">
        <div class="logo" aria-label="SilverCare logo">SilverCare</div>
        <form class="search-form" @submit="handleSearch">
        <input 
          class="search-bar" 
          v-model="searchInput" 
          placeholder="Search..." 
          aria-label="Search"
          @keydown.enter="handleSearch"
        />
      </form>
      
      <div class="user-avatar" role="img" aria-label="User avatar"></div>
        <div class="header-buttons">
          <button 
            class="email-btn" 
            @click="goTo('email')"
            @keydown.enter="goTo('email')"
            @keydown.space.prevent="goTo('email')"
            aria-label="Send email"
          >E</button>
          <button 
            class="table-btn" 
            @click="goTo('tables')"
            @keydown.enter="goTo('tables')"
            @keydown.space.prevent="goTo('tables')"
            aria-label="View tables"
          >T</button>
          <button 
            class="map-btn" 
            @click="goTo('map')"
            @keydown.enter="goTo('map')"
            @keydown.space.prevent="goTo('map')"
            aria-label="View map"
          >M</button>
        </div>
      </header>
      
      <!-- 健康语句轮播 -->
      <HealthQuoteCarousel :quotes="healthQuotes" />
      
      <section class="banner">
        <h1>Caring for Seniors' Health,<br />Connecting Community Resources</h1>
      </section>
      <section class="cards">
        <div 
          class="card" 
          @click="goTo('news')"
          @keydown.enter="goTo('news')"
          @keydown.space.prevent="goTo('news')"
          tabindex="0"
          role="button"
          aria-label="View Health News"
        >
          <div class="icon health">
            <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="#b2dfdb"/><text x="16" y="21" text-anchor="middle" font-size="16" fill="#1ab3a6">H</text></svg>
          </div>
          <div class="title">Health News</div>
          <div class="desc">Daily Tips</div>
        </div>
        <div 
          class="card" 
          @click="goTo('event')"
          @keydown.enter="goTo('event')"
          @keydown.space.prevent="goTo('event')"
          tabindex="0"
          role="button"
          aria-label="View Event Registration"
        >
          <div class="icon event">
            <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="8" width="24" height="16" rx="4" fill="#b2dfdb"/><text x="16" y="22" text-anchor="middle" font-size="16" fill="#1ab3a6">E</text></svg>
          </div>
          <div class="title">Event Registration</div>
          <div class="desc"><button class="pill">Tai Chi Class</button></div>
        </div>
        <div 
          class="card" 
          @click="goTo('rating')"
          @keydown.enter="goTo('rating')"
          @keydown.space.prevent="goTo('rating')"
          tabindex="0"
          role="button"
          aria-label="View Peer Rating"
        >
          <div class="icon rating">
            <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><polygon points="16,4 20,20 4,12 28,12 12,20" fill="#ffc107"/></svg>
          </div>
          <div class="title">Peer Rating</div>
          <div class="desc">
            <span class="stars">★ ★ ★ ★ ★</span>
            <div class="score">4.7/5</div>
            <div class="note">"This software is very senior-friendly"</div>
          </div>
        </div>
      </section>
      
      <!-- 评价语句轮播 -->
      <ReviewCarousel :reviews="reviews" />
      
      <section class="actions">
        <button 
          class="pill" 
          @click="goTo('login')"
          @keydown.enter="goTo('login')"
          @keydown.space.prevent="goTo('login')"
          aria-label="Log In"
        >Log In</button>
        <button 
          class="pill primary" 
          @click="goTo('register')"
          @keydown.enter="goTo('register')"
          @keydown.space.prevent="goTo('register')"
          aria-label="Sign Up"
        >Sign Up</button>
      </section>
    </div>
    <nav class="sidebar">
      <button 
        class="icon search" 
        @click="goTo('search')"
        @keydown.enter="goTo('search')"
        @keydown.space.prevent="goTo('search')"
        aria-label="Search"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="#1ab3a6" stroke-width="2" fill="none"/><line x1="17" y1="17" x2="22" y2="22" stroke="#1ab3a6" stroke-width="2"/></svg>
      </button>
      <button 
        class="icon user" 
        @click="goTo('profile')"
        @keydown.enter="goTo('profile')"
        @keydown.space.prevent="goTo('profile')"
        aria-label="User profile"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4" stroke="#1ab3a6" stroke-width="2" fill="none"/><rect x="4" y="17" width="16" height="4" rx="2" stroke="#1ab3a6" stroke-width="2" fill="none"/></svg>
      </button>
      <button 
        class="icon star" 
        @click="goTo('favorites')"
        @keydown.enter="goTo('favorites')"
        @keydown.space.prevent="goTo('favorites')"
        aria-label="Favorites"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,3 15,10 22,10 17,14 18,21 12,17 6,21 7,14 2,10 9,10" fill="#ffc107"/></svg>
      </button>
    </nav>
    <div 
      v-if="isAdminInHomePage" 
      class="admin-btn-float"
    >
      <router-link to="/admin/users" aria-label="Admin panel" role="button">M</router-link>
    </div>

    
    <!-- Modal for tables -->
    <div v-if="showTables" class="tables-modal">
      <div class="tables-modal-content">
        <span 
          class="close" 
          @click="showTables = false"
          @keydown.enter="showTables = false"
          @keydown.space.prevent="showTables = false"
          tabindex="0"
          role="button"
          aria-label="Close modal"
        >&times;</span>
        <h2>Interactive Tables</h2>
        <div class="table-section">
          <DataTableComponent
            title="Users Table"
            :columns="userColumns"
            :items="usersData"
            :rows="10"
          />
        </div>
        <div class="table-section">
          <DataTableComponent
            title="Events Table"
            :columns="eventColumns"
            :items="eventsData"
            :rows="10"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { authState } from '../auth.js';
import { useRoute } from 'vue-router';
import { sendEmail } from '../services/emailService.js';
import DataTableComponent from '../components/DataTableComponent.vue';
import HealthQuoteCarousel from '../components/HealthQuoteCarousel.vue';
import ReviewCarousel from '../components/ReviewCarousel.vue';

const router = useRouter();

const route = useRoute();
function goTo(page) {
  // 直接执行跳转，不使用延迟
  router.push(`/${page}`);
}
const searchInput = ref('');
const emailSentSuccess = ref(false);

// Table data
const showTables = ref(false);

// User table columns
const userColumns = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
  { field: 'email', header: 'Email' },
  { field: 'age', header: 'Age' },
  { field: 'city', header: 'City' },
  { field: 'role', header: 'Role' }
];

// Event table columns
const eventColumns = [
  { field: 'id', header: 'ID' },
  { field: 'title', header: 'Title' },
  { field: 'date', header: 'Date' },
  { field: 'location', header: 'Location' },
  { field: 'category', header: 'Category' },
  { field: 'attendees', header: 'Attendees' }
];

// Generate mock user data
const usersData = ref(Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  age: Math.floor(Math.random() * 50) + 20,
  city: ['New York', 'London', 'Paris', 'Tokyo', 'Sydney'][Math.floor(Math.random() * 5)],
  role: ['user', 'admin', 'editor'][Math.floor(Math.random() * 3)]
})));

// Generate mock event data
const eventsData = ref(Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title: `Event ${index + 1}`,
  date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  location: ['Community Center', 'Library', 'Park', 'Senior Center', 'Online'][Math.floor(Math.random() * 5)],
  category: ['Fitness', 'Health', 'Arts', 'Education', 'Social'][Math.floor(Math.random() * 5)],
  attendees: Math.floor(Math.random() * 100) + 10
})));

// 健康语句数据
const healthQuotes = [
  "An apple a day, keep a doctor away",
  "Early to bed and early to rise, makes a man healthy, wealthy and wise",
  "Health is wealth",
  "A healthy mind in a healthy body",
  "Prevention is better than cure",
  "You are what you eat",
  "Exercise is medicine for creating change in your body",
  "The greatest wealth is health"
];

// 评价数据
const reviews = [
  {
    id: 1,
    rating: 5,
    text: "This app is incredibly user-friendly for seniors. The interface is clear and easy to navigate.",
    author: "Margaret, 72"
  },
  {
    id: 2,
    rating: 5,
    text: "The Tai Chi classes have been wonderful for my mobility. Highly recommend!",
    author: "Robert, 68"
  },
  {
    id: 3,
    rating: 4,
    text: "Great health tips and easy to use. The calendar feature is very helpful.",
    author: "Helen, 75"
  },
  {
    id: 4,
    rating: 5,
    text: "Finally an app designed with seniors in mind. The large buttons and clear text make all the difference.",
    author: "George, 70"
  },
  {
    id: 5,
    rating: 4,
    text: "The community features are excellent. I've made new friends through the events.",
    author: "Dorothy, 69"
  }
];

async function sendTestEmail() {
  try {
    // 发送测试邮件
    const result = await sendEmail({
      to: 'kqin0008@student.monash.edu',
      subject: 'Test Email from SilverCare',
      text: 'This is a test email sent from SilverCare application.',
      attachments: [{
        filename: 'attachment.txt',
        content: btoa('Attachment is here!'),
        type: 'text/plain',
        disposition: 'attachment'
      }]
    });
    
    // 显示成功提示
    emailSentSuccess.value = true;
    
    // 3秒后隐藏成功提示
    setTimeout(() => {
      emailSentSuccess.value = false;
    }, 3000);
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Failed to send email. Please try again later.');
  }
}
function handleSearch(e) {
  if (e) e.preventDefault();
  if (searchInput.value.trim()) {
    router.push({ name: 'Search', query: { q: searchInput.value.trim() } });
    searchInput.value = '';
  }
}

const isAdminInHomePage = computed(() => {
  const isHomeRoute = route.name === 'Home'; 
  const isAdmin = authState.user?.role === 'admin'; 
  return isHomeRoute && isAdmin;
});
</script>

<style scoped>
.main-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  background: #f8fafc;
}
.container {
  min-height: 80vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 0 20px;
  max-width: 900px;
  width: 100%;
  box-sizing: border-box;
}
.header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
  background: #f0f7f6;
  border-radius: 12px;
  margin: 16px 0;
}
.logo {
  font-weight: bold;
  font-size: 1.5rem;
  color: #1ab3a6;
  margin-left: 24px;
}
.search-bar {
  flex: 1;
  margin: 0 32px;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  outline: none;
  background: #fff;
}
.user-avatar {
  width: 40px;
  height: 40px;
  background: #eee;
  border-radius: 50%;
  margin-right: 24px;
}
.banner {
  margin: 24px 0;
  background: linear-gradient(90deg, #6ed6c5 0%, #1ab3a6 100%);
  color: #fff;
  padding: 32px 48px;
  border-radius: 16px;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 600;
  width: 100%;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin: 24px 0;
  justify-content: center;
  width: 100%;
}
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 32px 24px;
  width: 240px;
  min-width: 220px;
  flex: 1 1 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: box-shadow 0.2s;
  outline: none;
}
.card:focus {
  outline: 2px solid #1ab3a6;
  outline-offset: 2px;
}
.card:hover {
  box-shadow: 0 4px 16px rgba(26,179,166,0.12);
}
.icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e0f7f4;
}
.title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 8px;
}
.desc {
  color: #888;
  font-size: 1rem;
  text-align: center;
}
.stars {
  color: #ffc107;
  font-size: 1.2rem;
}
.score {
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
}
.note {
  font-size: 0.9rem;
  color: #888;
  font-style: italic;
}
.actions {
  display: flex;
  gap: 24px;
  margin: 24px 0;
}
.pill {
  border: none;
  border-radius: 999px;
  padding: 10px 32px;
  background: #e0f7f4;
  color: #1ab3a6;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 8px;
  transition: background 0.2s;
}
.pill.primary {
  background: #1ab3a6;
  color: #fff;
}
.pill:hover {
  background: #6ed6c5;
}
.sidebar {
  margin-left: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 24px 12px;
  align-items: center;
  height: fit-content;
}
.sidebar .icon {
  width: 32px;
  height: 32px;
  background: #e0f7f4;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0;
}
.search-form {
  flex: 1;
  margin: 0 32px;
}
.search-bar {
  width: 100%;
}
@media (max-width: 1200px) {
  .main-layout {
    flex-direction: row;
    align-items: center;
  }
  .container {
    max-width: 100vw;
  }
  .sidebar {
    margin-left: 24px;
  }
}
@media (max-width: 900px) {
  .container { max-width: 100vw; }
  .cards { gap: 16px; }
  .banner { font-size: 1.2rem; padding: 16px 8px; }
  .sidebar { margin-left: 12px; }
}
@media (max-width: 600px) {
  .main-layout { flex-direction: column; align-items: center; }
  .header { flex-direction: column; padding: 16px 8px; }
  .banner { font-size: 1rem; }
  .card { width: 90vw; min-width: unset; flex: 1 1 90vw; }
  .sidebar { display: none; }
}

.admin-btn-float {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
}

.admin-btn-float a {
  background: #ff6347;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
}

.admin-btn-float a:hover {
  background: #ff4500;
}

/* Header buttons container */
.header-buttons {
  display: flex;
  gap: 10px;
  margin-right: 24px;
}

/* Email button styles */
.email-btn {
  width: 40px;
  height: 40px;
  background: #1ab3a6; /* 与标题一样的绿色 */
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.email-btn:hover {
  background: #149488;
}

/* Table button styles */
.table-btn {
  width: 40px;
  height: 40px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.table-btn:hover {
  background: #f57c00;
}

/* Map button styles */
.map-btn {
  width: 40px;
  height: 40px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.map-btn:hover {
  background: #0b7dda;
}

/* Tables modal styles */
.tables-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tables-modal-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.table-section {
  margin-bottom: 2rem;
}
.email-btn {
  width: 40px;
  height: 40px;
  background: #1ab3a6; /* 与标题一样的绿色 */
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  transition: background-color 0.2s;
}

.email-btn:hover {
  background: #149488;
}

.email-success-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #c8e6c9; /* 草绿色 */
  color: #333;
  padding: 20px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 9999; /* 确保浮于所有元素上方 */
  font-weight: bold;
  font-size: 1.1rem;
}
</style>