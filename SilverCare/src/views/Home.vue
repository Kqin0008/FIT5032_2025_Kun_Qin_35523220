<template>
  <div class="main-layout">
    <div class="container">
      <header class="header">
        <div class="logo">SilverCare</div>
        <form class="search-form" @submit="handleSearch">
          <input class="search-bar" v-model="searchInput" placeholder="Search..." />
        </form>
        <div class="user-avatar"></div>
      </header>
      <section class="banner">
        <h1>Caring for Seniors' Health,<br />Connecting Community Resources</h1>
      </section>
      <section class="cards">
        <div class="card" @click="goTo('news')">
          <div class="icon health">
            <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#b2dfdb"/><text x="16" y="21" text-anchor="middle" font-size="16" fill="#1ab3a6">H</text></svg>
          </div>
          <div class="title">Health News</div>
          <div class="desc">Daily Tips</div>
        </div>
        <div class="card" @click="goTo('event')">
          <div class="icon event">
            <svg width="32" height="32" viewBox="0 0 32 32"><rect x="4" y="8" width="24" height="16" rx="4" fill="#b2dfdb"/><text x="16" y="22" text-anchor="middle" font-size="16" fill="#1ab3a6">E</text></svg>
          </div>
          <div class="title">Event Registration</div>
          <div class="desc"><button class="pill">Tai Chi Class</button></div>
        </div>
        <div class="card" @click="goTo('rating')">
          <div class="icon rating">
            <svg width="32" height="32" viewBox="0 0 32 32"><polygon points="16,4 20,20 4,12 28,12 12,20" fill="#ffc107"/></svg>
          </div>
          <div class="title">Peer Rating</div>
          <div class="desc">
            <span class="stars">★ ★ ★ ★ ★</span>
            <div class="score">4.7/5</div>
            <div class="note">"This software is very senior-friendly"</div>
          </div>
        </div>
      </section>
      <section class="actions">
        <button class="pill" @click="goTo('login')">Log In</button>
        <button class="pill primary" @click="goTo('register')">Sign Up</button>
      </section>
    </div>
    <nav class="sidebar">
      <button class="icon search" @click="goTo('search')">
        <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="#1ab3a6" stroke-width="2" fill="none"/><line x1="17" y1="17" x2="22" y2="22" stroke="#1ab3a6" stroke-width="2"/></svg>
      </button>
      <button class="icon user" @click="goTo('profile')">
        <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="9" r="4" stroke="#1ab3a6" stroke-width="2" fill="none"/><rect x="4" y="17" width="16" height="4" rx="2" stroke="#1ab3a6" stroke-width="2" fill="none"/></svg>
      </button>
      <button class="icon star" @click="goTo('favorites')">
        <svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,3 15,10 22,10 17,14 18,21 12,17 6,21 7,14 2,10 9,10" fill="#ffc107"/></svg>
      </button>
    </nav>
    <div 
      v-if="isAdminInHomePage" 
      class="admin-btn-float"
    >
      <router-link to="/admin/users">M</router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { authState } from '../auth.js';
import { useRoute } from 'vue-router';
const router = useRouter();

const route = useRoute();
function goTo(page) {
  router.push({ name: page.charAt(0).toUpperCase() + page.slice(1) });
}
const searchInput = ref('');
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
</style>