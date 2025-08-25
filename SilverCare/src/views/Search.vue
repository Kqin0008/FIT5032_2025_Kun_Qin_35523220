<template>
  <div class="center-layout">
    <div class="search-page">
      <header class="search-header">
        <button class="back-btn" @click="goBack">← Back</button>
        <h1>Search</h1>
      </header>
      <div class="search-container">
      <input 
        class="search-input" 
        placeholder="Search for health tips, events, or services..." 
        v-model="searchQuery"
        @input="handleSearch"
        aria-label="Search input"
      />
      <div class="search-results" v-if="searchResults.length > 0">
        <div class="result-item" v-for="result in searchResults" :key="result.id" role="article" :aria-label="'Search result: ' + result.title">
          <h3>{{ result.title }}</h3>
          <p>{{ result.description }}</p>
        </div>
      </div>
      <div class="no-results" v-else-if="searchQuery && !searchResults.length" role="alert" aria-live="polite">
        <p>No results found for "{{ searchQuery }}"</p>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
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

function goBack() {
  router.go(-1);
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

onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q;
    handleSearch();
  }
});
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
.search-page {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 40px 32px;
  width: 400px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.search-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  width: 100%;
}
.back-btn {
  background: none;
  border: none;
  color: #1ab3a6;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background 0.2s;
}
.back-btn:hover {
  background: #e0f7f4;
}
.search-header h1 {
  color: #1ab3a6;
  font-size: 2rem;
  margin: 0;
}
.search-container {
  width: 100%;
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
}
.search-input:focus {
  border-color: #1ab3a6;
}
.search-results {
  margin-top: 30px;
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
@media (max-width: 600px) {
  .search-page {
    padding: 16px 4px;
    width: 98vw;
  }
}
</style>