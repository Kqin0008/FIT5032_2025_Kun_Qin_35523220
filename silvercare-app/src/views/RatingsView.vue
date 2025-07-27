<template>
  <div class="ratings">
    <div class="container py-4">
      <!-- Page Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="page-header">
            <h1 class="page-title">
              <i class="bi bi-star-fill me-3 text-warning"></i>
              用户评价
            </h1>
            <p class="page-subtitle text-muted">
              查看其他用户的真实体验，分享您的使用感受
            </p>
          </div>
        </div>
      </div>

      <!-- Overall Rating Summary -->
      <div class="row mb-4">
        <div class="col-lg-4 mb-4">
          <div class="card rating-summary-card">
            <div class="card-body text-center">
              <div class="overall-rating">
                <h1 class="rating-number">{{ dataStore.averageRating }}</h1>
                <div class="rating-stars mb-2">
                  <i 
                    v-for="star in 5" 
                    :key="star"
                    class="bi"
                    :class="star <= Math.round(parseFloat(dataStore.averageRating)) ? 'bi-star-fill' : 'bi-star'"
                  ></i>
                </div>
                <p class="text-muted">基于 {{ dataStore.totalRatings }} 条评价</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title mb-3">评分分布</h5>
              <div class="rating-distribution">
                <div 
                  v-for="rating in 5" 
                  :key="rating"
                  class="rating-bar mb-2"
                >
                  <div class="d-flex align-items-center">
                    <span class="rating-label">{{ 6 - rating }} 星</span>
                    <div class="progress flex-grow-1 mx-3">
                      <div 
                        class="progress-bar bg-warning"
                        role="progressbar" 
                        :style="`width: ${getRatingPercentage(6 - rating)}%`"
                      ></div>
                    </div>
                    <span class="rating-count">{{ getRatingCount(6 - rating) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Review Form -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-pencil-square me-2"></i>
                分享您的体验
              </h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitRating">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">您的评分</label>
                    <div class="rating-input">
                      <button
                        v-for="star in 5"
                        :key="star"
                        type="button"
                        class="btn rating-star"
                        :class="{ active: star <= newRating.rating }"
                        @click="setRating(star)"
                      >
                        <i class="bi" :class="star <= newRating.rating ? 'bi-star-fill' : 'bi-star'"></i>
                      </button>
                      <span class="ms-3 text-muted">
                        {{ getRatingText(newRating.rating) }}
                      </span>
                    </div>
                  </div>
                  <div class="col-12 mb-3">
                    <label for="ratingComment" class="form-label">评价内容</label>
                    <textarea
                      class="form-control"
                      id="ratingComment"
                      rows="4"
                      v-model="newRating.comment"
                      placeholder="请分享您对SilverCare的使用体验..."
                      required
                    ></textarea>
                  </div>
                  <div class="col-12">
                    <button 
                      type="submit" 
                      class="btn btn-warning"
                      :disabled="!newRating.rating || !newRating.comment.trim()"
                    >
                      <i class="bi bi-send me-2"></i>
                      提交评价
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">
                <i class="bi bi-chat-dots me-2"></i>
                用户评价 ({{ dataStore.ratings.length }})
              </h5>
              <div class="sort-options">
                <select 
                  class="form-select form-select-sm"
                  v-model="sortBy"
                >
                  <option value="newest">最新发布</option>
                  <option value="oldest">最早发布</option>
                  <option value="highest">评分最高</option>
                  <option value="lowest">评分最低</option>
                </select>
              </div>
            </div>
            <div class="card-body">
              <div v-if="sortedRatings.length === 0" class="text-center py-5">
                <i class="bi bi-chat-square-dots fs-1 text-muted mb-3"></i>
                <h5 class="text-muted">暂无用户评价</h5>
                <p class="text-muted">成为第一个分享体验的用户吧！</p>
              </div>
              <div v-else>
                <div 
                  v-for="rating in sortedRatings" 
                  :key="rating.id"
                  class="review-item"
                >
                  <div class="d-flex align-items-start">
                    <div class="reviewer-avatar me-3">
                      <i class="bi bi-person-fill"></i>
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 class="reviewer-name mb-1">
                            {{ getUserName(rating.userId) }}
                          </h6>
                          <div class="rating-stars">
                            <i 
                              v-for="star in 5" 
                              :key="star"
                              class="bi"
                              :class="star <= rating.rating ? 'bi-star-fill' : 'bi-star'"
                            ></i>
                          </div>
                        </div>
                        <small class="text-muted">
                          {{ formatDate(new Date(rating.date)) }}
                        </small>
                      </div>
                      <p class="review-content">{{ rating.comment }}</p>
                      
                      <!-- Review Actions -->
                      <div class="review-actions">
                        <button 
                          class="btn btn-sm btn-outline-primary"
                          @click="likeReview(rating.id)"
                        >
                          <i class="bi bi-hand-thumbs-up me-1"></i>
                          有用 ({{ getReviewLikes(rating.id) }})
                        </button>
                        <button 
                          class="btn btn-sm btn-outline-secondary ms-2"
                          @click="reportReview(rating.id)"
                        >
                          <i class="bi bi-flag me-1"></i>
                          举报
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div 
      class="modal fade" 
      id="successModal" 
      tabindex="-1" 
      aria-labelledby="successModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              操作成功
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="关闭"
            ></button>
          </div>
          <div class="modal-body">
            {{ modalMessage }}
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-primary" 
              data-bs-dismiss="modal"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/data'
import type { Rating } from '@/stores/data'

const authStore = useAuthStore()
const dataStore = useDataStore()

// State
const sortBy = ref('newest')
const modalMessage = ref('')
const reviewLikes = ref<{ [key: number]: number }>({})

// New rating form
const newRating = reactive({
  rating: 0,
  comment: ''
})

// Computed properties
const sortedRatings = computed(() => {
  let ratings = [...dataStore.ratings]
  
  switch (sortBy.value) {
    case 'newest':
      ratings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      break
    case 'oldest':
      ratings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      break
    case 'highest':
      ratings.sort((a, b) => b.rating - a.rating)
      break
    case 'lowest':
      ratings.sort((a, b) => a.rating - b.rating)
      break
  }
  
  return ratings
})

// Methods
function getRatingCount(stars: number): number {
  return dataStore.ratings.filter(rating => rating.rating === stars).length
}

function getRatingPercentage(stars: number): number {
  const count = getRatingCount(stars)
  const total = dataStore.ratings.length
  return total > 0 ? (count / total) * 100 : 0
}

function setRating(rating: number): void {
  newRating.rating = rating
}

function getRatingText(rating: number): string {
  const texts = ['', '非常不满意', '不满意', '一般', '满意', '非常满意']
  return texts[rating] || ''
}

function getUserName(userId: number): string {
  // In a real app, this would fetch user data
  const userNames: { [key: number]: string } = {
    1: '管理员',
    2: '张大爷',
    3: '李护士'
  }
  return userNames[userId] || `用户${userId}`
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function submitRating(): void {
  if (!newRating.rating || !newRating.comment.trim() || !authStore.currentUser) {
    return
  }
  
  const ratingData: Omit<Rating, 'id'> = {
    userId: authStore.currentUser.id,
    rating: newRating.rating,
    comment: newRating.comment.trim(),
    date: new Date().toISOString().split('T')[0]
  }
  
  dataStore.addRating(ratingData)
  
  // Reset form
  newRating.rating = 0
  newRating.comment = ''
  
  modalMessage.value = '评价提交成功！感谢您的反馈。'
  showModal()
}

function getReviewLikes(reviewId: number): number {
  return reviewLikes.value[reviewId] || Math.floor(Math.random() * 10) + 1
}

function likeReview(reviewId: number): void {
  if (!reviewLikes.value[reviewId]) {
    reviewLikes.value[reviewId] = Math.floor(Math.random() * 10) + 1
  }
  reviewLikes.value[reviewId]++
  
  modalMessage.value = '感谢您的点赞！'
  showModal()
}

function reportReview(reviewId: number): void {
  modalMessage.value = '举报已提交，我们会尽快处理。'
  showModal()
}

function showModal(): void {
  const modal = new (window as any).bootstrap.Modal(document.getElementById('successModal'))
  modal.show()
}
</script>

<style scoped>
.ratings {
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.1rem;
}

.rating-summary-card {
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  background: linear-gradient(135deg, #fff, #f8f9fa);
}

.overall-rating {
  padding: 1rem;
}

.rating-number {
  font-size: 4rem;
  font-weight: bold;
  color: #FFD93D;
  margin-bottom: 0.5rem;
}

.rating-stars {
  color: #FFD93D;
  font-size: 1.5rem;
}

.rating-distribution .rating-label {
  width: 60px;
  font-size: 0.9rem;
}

.rating-distribution .rating-count {
  width: 30px;
  text-align: right;
  font-size: 0.9rem;
  color: #6c757d;
}

.rating-input {
  display: flex;
  align-items: center;
}

.rating-star {
  background: none;
  border: none;
  color: #dee2e6;
  font-size: 1.5rem;
  padding: 0.25rem;
  transition: color 0.3s ease;
}

.rating-star:hover,
.rating-star.active {
  color: #FFD93D;
}

.review-item {
  padding: 1.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.review-item:last-child {
  border-bottom: none;
}

.reviewer-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4ECDC4, #45B7AF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.reviewer-name {
  font-weight: 600;
  color: #2c3e50;
}

.review-content {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.review-actions .btn {
  border-radius: 20px;
}

.sort-options .form-select {
  border-radius: 20px;
  width: auto;
}

.card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}

.card-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  border-radius: 15px 15px 0 0 !important;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .rating-number {
    font-size: 3rem;
  }
  
  .overall-rating {
    padding: 0.5rem;
  }
  
  .reviewer-avatar {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
</style>