<template>
  <div class="star-rating">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      class="star-btn"
      :class="{ 'active': star <= currentRating }"
      @click="setRating(star)"
      @mouseover="interactive && (hoverRating = star)"
      @mouseleave="interactive && (hoverRating = 0)"
      :disabled="!interactive"
    >
      <i 
        class="bi"
        :class="getStarClass(star)"
      ></i>
    </button>
    <span v-if="showText" class="rating-text ms-2">
      {{ getRatingText(currentRating) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: number
  interactive?: boolean
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  interactive: true,
  showText: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const hoverRating = ref(0)

const currentRating = computed(() => 
  props.interactive && hoverRating.value > 0 ? hoverRating.value : props.modelValue
)

function setRating(rating: number) {
  if (props.interactive) {
    emit('update:modelValue', rating)
  }
}

function getStarClass(star: number): string {
  return star <= currentRating.value ? 'bi-star-fill' : 'bi-star'
}

function getRatingText(rating: number): string {
  const texts = ['', '非常不满意', '不满意', '一般', '满意', '非常满意']
  return texts[rating] || ''
}
</script>

<style scoped>
.star-rating {
  display: flex;
  align-items: center;
}

.star-btn {
  background: none;
  border: none;
  color: #dee2e6;
  font-size: 1.5rem;
  padding: 0.25rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.star-btn:hover:not(:disabled),
.star-btn.active {
  color: #FFD93D;
}

.star-btn:disabled {
  cursor: default;
}

.rating-text {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

/* Size variations */
.star-rating.size-sm .star-btn {
  font-size: 1rem;
}

.star-rating.size-lg .star-btn {
  font-size: 2rem;
}
</style>