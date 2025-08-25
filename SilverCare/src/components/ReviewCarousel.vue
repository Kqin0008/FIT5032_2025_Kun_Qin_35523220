<template>
  <div class="review-carousel">
    <div class="review-slide" v-for="(review, index) in reviews" :key="index" v-show="index === currentSlide">
      <div class="review-stars">
        <span v-for="star in 5" :key="star" class="star-small">
          {{ star <= review.rating ? '★' : '☆' }}
        </span>
      </div>
      <div class="review-text">{{ review.text }}</div>
      <div class="review-author">- {{ review.author }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  reviews: {
    type: Array,
    required: true
  }
});

const currentSlide = ref(0);
let intervalId = null;

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % props.reviews.length;
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
.review-carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  min-height: 120px;
  width: 100%;
}

.review-slide {
  animation: fadeIn 0.5s ease-in-out;
  text-align: center;
  max-width: 600px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.review-stars {
  margin-bottom: 12px;
}

.star-small {
  color: #ffc107;
  font-size: 1.1rem;
  margin-right: 2px;
}

.review-text {
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
  font-style: italic;
}

.review-author {
  color: #666;
  font-size: 0.9rem;
  font-weight: bold;
}
</style>