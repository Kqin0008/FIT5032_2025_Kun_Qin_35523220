<template>
  <div class="quote-carousel">
    <div class="quote-slide" v-for="(quote, index) in quotes" :key="index" v-show="index === currentSlide">
      <div class="quote-icon" aria-label="Health tip icon">💡</div>
      <div class="quote-text" role="article" aria-label="Health tip">{{ quote }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  quotes: {
    type: Array,
    required: true
  }
});

const currentSlide = ref(0);
let intervalId = null;

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % props.quotes.length;
}

onMounted(() => {
  intervalId = setInterval(nextSlide, 5000); // 每5秒切换一次
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.quote-carousel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  min-height: 100px;
  width: 100%;
  clear: both;
}

.quote-slide {
  display: flex;
  align-items: center;
  gap: 20px;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
  text-align: center;
}

@media (max-width: 768px) {
  .quote-slide {
    flex-direction: column;
    text-align: center;
  }
  
  .quote-text {
    font-size: 1.1rem;
  }
}
</style>