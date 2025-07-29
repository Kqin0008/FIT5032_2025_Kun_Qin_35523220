<template>
  <div class="center-layout">
    <div class="favorites-page">
      <h2>Favorites</h2>
      <div v-if="user">
        <input 
          class="search-input" 
          placeholder="Search for health tips, events, or services..." 
          v-model="searchQuery"
          @input="handleSearch"
        />
        <div class="search-results" v-if="searchResults.length > 0">
          <div class="result-item" v-for="result in searchResults" :key="result.id">
            <h3>{{ result.title }}</h3>
            <p>{{ result.description }}</p>
            <button @click="addFavorite(result)">Add to Favorites</button>
          </div>
        </div>
        <div class="no-results" v-else-if="searchQuery && !searchResults.length">
          <p>No results found for "{{ searchQuery }}"</p>
        </div>
        <div class="fav-list">
          <div v-if="favorites.length === 0" class="empty">No favorites yet.</div>
          <div v-for="item in favorites" :key="item.id" class="fav-item">
            <span>{{ item.title }}</span>
            <button class="remove-btn" @click="removeFavorite(item.id)">Remove</button>
          </div>
        </div>
      </div>
      <div v-else class="not-logged">Please log in to view your favorites.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { authState } from '../auth.js';

const user = computed(() => authState.user);
const storageKey = computed(() => user.value ? `favorites_${user.value.email}` : 'favorites_guest');
const favorites = ref([]);
const searchQuery = ref('');
const searchResults = ref([]);

const allData = [
  { id: 1, title: 'Tai Chi for Seniors', description: 'Gentle exercise classes designed specifically for older adults.' },
  { id: 2, title: 'Healthy Eating Tips', description: 'Nutrition advice and meal planning for senior health.' },
  { id: 3, title: 'Mental Health Support', description: 'Resources and services for emotional well-being.' },
  { id: 4, title: 'Peer Rating', description: 'See what others think about SilverCare.' },
  { id: 5, title: 'Event Registration', description: 'Sign up for community events and classes.' },
  { id: 6, title: 'Favorites', description: 'Your favorite activities and resources.' }
];

function loadFavorites() {
  const favs = JSON.parse(localStorage.getItem(storageKey.value) || '[]');
  favorites.value = favs;
}

function saveFavorites() {
  localStorage.setItem(storageKey.value, JSON.stringify(favorites.value));
}

function addFavorite(item) {
  if (!favorites.value.some(fav => fav.id === item.id)) {
    favorites.value.push(item);
    saveFavorites();
  }
}

function removeFavorite(id) {
  favorites.value = favorites.value.filter(f => f.id !== id);
  saveFavorites();
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    searchResults.value = allData.filter(item => 
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  } else {
    searchResults.value = [];
  }
}

watch(user, loadFavorites, { immediate: true });
</script>

<style scoped>
.center-layout {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
}
.favorites-page {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 40px 32px;
  width: 350px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.favorites-page h2 {
  color: #1ab3a6;
  margin-bottom: 24px;
}
.fav-list {
  width: 100%;
  margin-bottom: 18px;
}
.fav-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f7f6;
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 10px;
}
.remove-btn {
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}
.remove-btn:hover {
  background: #ff7875;
}
.search-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1.1rem;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;
  margin-bottom: 20px;
}
.search-input:focus {
  border-color: #1ab3a6;
}
.search-results {
  margin-top: 30px;
  width: 100%;
}
.result-item {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.result-item:hover {
  box-shadow: 0 4px 16px rgba(26,179,166,0.12);
}
.result-item h3 {
  color: #1ab3a6;
  margin: 0 0 8px 0;
  font-size: 1.2rem;
}
.result-item p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}
.no-results {
  text-align: center;
  margin-top: 30px;
  color: #888;
  font-size: 1.1rem;
}
.empty {
  color: #888;
  text-align: center;
  margin-bottom: 12px;
}
.not-logged {
  color: #888;
  font-size: 1.1rem;
  margin-top: 24px;
}
</style>