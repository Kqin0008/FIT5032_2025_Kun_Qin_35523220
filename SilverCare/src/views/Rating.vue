<template>
  <div class="center-layout">
    <div class="rating-page">
      <header class="rating-header">
        <button class="back-btn" @click="goBack">← Back</button>
        <h1>Rate Our App</h1>
      </header>
      <div class="rating-container">
        <div class="rating-section">
          <h2>How would you rate SilverCare?</h2>
          <div class="stars-container">
            <div 
              v-for="star in 5" 
              :key="star"
              :class="['star', { 'active': star <= userRating }]"
              @click="setRating(star)"
              @mouseenter="hoverRating = star"
              @mouseleave="hoverRating = 0"
            >
              <svg width="48" height="48" viewBox="0 0 48 48">
                <polygon 
                  points="24,4 30,18 44,18 34,28 38,42 24,34 10,42 14,28 4,18 18,18" 
                  :fill="star <= (hoverRating || userRating) ? '#ffc107' : '#e0e0e0'"
                />
              </svg>
            </div>
          </div>
          <div class="rating-text">
            {{ ratingText }}
          </div>
          <button 
            v-if="userRating > 0" 
            class="submit-btn" 
            @click="submitRating"
          >
            Submit Rating
          </button>
        </div>
        <div class="reviews-section">
          <h3>What others are saying</h3>
          <div class="reviews">
            <div class="review-card" v-for="review in reviews" :key="review.id">
              <div class="review-stars">
                <span v-for="star in 5" :key="star" class="star-small">
                  {{ star <= review.rating ? '★' : '☆' }}
                </span>
              </div>
              <div class="review-text">{{ review.text }}</div>
              <div class="review-author">- {{ review.author }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userRating = ref(0);
const hoverRating = ref(0);

const reviews = ref([
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
]);

const ratingText = computed(() => {
  const texts = {
    0: "Click on a star to rate",
    1: "Poor",
    2: "Fair", 
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  };
  return texts[userRating.value];
});

function goBack() {
  router.go(-1);
}

function setRating(rating) {
  userRating.value = rating;
}

function submitRating() {
  alert(`Thank you for your ${userRating.value}-star rating!`);
  userRating.value = 0;
}
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
.rating-page {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rating-header {
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

.rating-header h1 {
  color: #1ab3a6;
  font-size: 2rem;
  margin: 0;
}

.rating-container {
  max-width: 800px;
  width: 100%;
}

.rating-section {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  text-align: center;
  margin-bottom: 40px;
}

.rating-section h2 {
  color: #333;
  margin: 0 0 30px 0;
  font-size: 1.5rem;
}

.stars-container {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.star {
  cursor: pointer;
  transition: transform 0.2s;
}

.star:hover {
  transform: scale(1.1);
}

.rating-text {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
  min-height: 30px;
}

.submit-btn {
  background: #1ab3a6;
  color: #fff;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #6ed6c5;
}

.reviews-section {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.reviews-section h3 {
  color: #1ab3a6;
  margin: 0 0 24px 0;
  font-size: 1.3rem;
  text-align: center;
}

.reviews {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  transition: box-shadow 0.2s;
}

.review-card:hover {
  box-shadow: 0 2px 8px rgba(26,179,166,0.12);
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

@media (max-width: 768px) {
  .rating-section {
    padding: 24px;
  }
  
  .stars-container {
    gap: 4px;
  }
  
  .star svg {
    width: 40px;
    height: 40px;
  }
  
  .reviews-section {
    padding: 24px;
  }
}
</style> 