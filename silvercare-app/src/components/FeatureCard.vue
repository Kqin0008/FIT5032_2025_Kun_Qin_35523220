<template>
  <div class="card feature-card h-100" @click="handleClick">
    <div class="card-body text-center">
      <i :class="iconClass" class="feature-icon mb-3"></i>
      <h4 class="card-title">{{ title }}</h4>
      <p class="card-text">{{ description }}</p>
      <div v-if="showRating" class="rating-display">
        <div class="rating-stars mb-2">
          <i 
            v-for="star in 5" 
            :key="star"
            class="bi"
            :class="star <= Math.round(rating) ? 'bi-star-fill' : 'bi-star'"
          ></i>
        </div>
        <h3 class="rating-number">{{ rating }}/5</h3>
        <p class="text-muted">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  iconClass: string
  showRating?: boolean
  rating?: number
  subtitle?: string
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRating: false,
  rating: 0,
  subtitle: '',
  clickable: true
})

const emit = defineEmits<{
  click: []
}>()

function handleClick() {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.feature-card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 4rem;
  color: #4ECDC4;
}

.card-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.card-text {
  color: #6c757d;
  line-height: 1.6;
}

.rating-display {
  margin-top: 1rem;
}

.rating-stars {
  color: #FFD93D;
  font-size: 1.5rem;
}

.rating-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4ECDC4;
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .feature-icon {
    font-size: 3rem;
  }
  
  .rating-number {
    font-size: 2rem;
  }
}
</style>