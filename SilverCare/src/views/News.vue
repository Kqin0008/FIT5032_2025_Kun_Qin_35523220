<template>
  <div class="center-layout">
    <div class="news-page">
      <header class="news-header">
        <button class="back-btn" @click="goBack">← Back</button>
        <h1>Health News</h1>
      </header>
      <div class="news-container">
        <div class="quote-card" v-for="(quote, index) in shuffledQuotes" :key="index">
          <div class="quote-icon">💡</div>
          <div class="quote-text">{{ quote }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const shuffledQuotes = ref([]);

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

function goBack() {
  router.go(-1);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

onMounted(() => {
  shuffledQuotes.value = shuffleArray(healthQuotes);
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
.news-page {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.news-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
  max-width: 800px;
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

.news-header h1 {
  color: #1ab3a6;
  font-size: 2rem;
  margin: 0;
}

.news-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  max-width: 800px;
  width: 100%;
}

.quote-card {
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 20px;
}

.quote-card:hover {
  box-shadow: 0 4px 16px rgba(26,179,166,0.12);
}

.quote-icon {
  font-size: 2rem;
  color: #1ab3a6;
  flex-shrink: 0;
}

.quote-text {
  font-size: 1.2rem;
  color: #333;
  line-height: 1.6;
  font-style: italic;
}

@media (max-width: 768px) {
  .news-container {
    grid-template-columns: 1fr;
  }
  
  .quote-card {
    padding: 24px;
    flex-direction: column;
    text-align: center;
  }
  
  .quote-text {
    font-size: 1.1rem;
  }
}
</style> 