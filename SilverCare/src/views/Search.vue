<template>
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
      />
      <div class="search-results" v-if="searchResults.length > 0">
        <div class="result-item" v-for="result in searchResults" :key="result.id">
          <h3>{{ result.title }}</h3>
          <p>{{ result.description }}</p>
        </div>
      </div>
      <div class="no-results" v-else-if="searchQuery && !searchResults.length">
        <p>No results found for "{{ searchQuery }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');
const searchResults = ref([]);

function goBack() {
  router.go(-1);
}

function handleSearch() {
  // 模拟搜索功能
  if (searchQuery.value.trim()) {
    searchResults.value = [
      {
        id: 1,
        title: 'Tai Chi for Seniors',
        description: 'Gentle exercise classes designed specifically for older adults.'
      },
      {
        id: 2,
        title: 'Healthy Eating Tips',
        description: 'Nutrition advice and meal planning for senior health.'
      },
      {
        id: 3,
        title: 'Mental Health Support',
        description: 'Resources and services for emotional well-being.'
      }
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  } else {
    searchResults.value = [];
  }
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 20px;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
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
  max-width: 800px;
  margin: 0 auto;
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
</style> 