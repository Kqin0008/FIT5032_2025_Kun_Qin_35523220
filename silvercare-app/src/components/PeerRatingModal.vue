<template>
  <div 
    class="modal fade" 
    id="peerRatingModal" 
    tabindex="-1" 
    aria-labelledby="peerRatingModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rating-modal">
        <div class="modal-header border-0">
          <h5 class="modal-title" id="peerRatingModalLabel">
            <i class="bi bi-star-fill text-warning me-2"></i>
            Peer Rating
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            data-bs-dismiss="modal" 
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body py-4">
          <!-- Current Rating Display -->
          <div class="current-rating text-center mb-4">
            <h2 class="rating-number mb-2">4.7/5</h2>
            <div class="rating-stars mb-3">
              <i class="bi bi-star-fill" v-for="n in 5" :key="n"></i>
            </div>
            <p class="text-muted">基于 {{ totalRatings }} 条用户评价</p>
          </div>

          <!-- Rating Form -->
          <div class="rating-form">
            <h6 class="text-primary mb-3">
              <i class="bi bi-hand-thumbs-up me-2"></i>
              给应用打分
            </h6>
            <div class="text-center mb-4">
              <p class="mb-3">您对 SilverCare 的整体体验如何？</p>
              <div class="user-rating mb-3">
                <StarRating 
                  v-model="userRating" 
                  :interactive="true" 
                  :show-text="true"
                  size="lg"
                />
              </div>
            </div>

            <!-- Rating Categories -->
            <div class="rating-categories mb-4">
              <h6 class="text-primary mb-3">详细评分</h6>
              <div class="category-rating mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span>界面友好度</span>
                  <StarRating v-model="categoryRatings.interface" size="sm" />
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span>功能实用性</span>
                  <StarRating v-model="categoryRatings.functionality" size="sm" />
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span>使用便捷性</span>
                  <StarRating v-model="categoryRatings.usability" size="sm" />
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span>内容质量</span>
                  <StarRating v-model="categoryRatings.content" size="sm" />
                </div>
              </div>
            </div>

            <!-- Comment Section -->
            <div class="comment-section mb-4">
              <label for="userComment" class="form-label">
                <i class="bi bi-chat-dots me-2"></i>
                分享您的使用体验
              </label>
              <textarea
                class="form-control"
                id="userComment"
                rows="4"
                v-model="userComment"
                placeholder="请分享您对SilverCare的使用感受，您的反馈对我们很重要..."
                maxlength="500"
              ></textarea>
              <div class="form-text text-end">
                {{ userComment.length }}/500 字符
              </div>
            </div>

            <!-- Suggested Improvements -->
            <div class="improvements-section mb-4">
              <h6 class="text-primary mb-3">
                <i class="bi bi-lightbulb me-2"></i>
                希望改进的功能
              </h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-check mb-2">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="improve-ui"
                      v-model="improvements"
                      value="界面设计"
                    >
                    <label class="form-check-label" for="improve-ui">
                      界面设计
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="improve-content"
                      v-model="improvements"
                      value="内容丰富度"
                    >
                    <label class="form-check-label" for="improve-content">
                      内容丰富度
                    </label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-check mb-2">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="improve-speed"
                      v-model="improvements"
                      value="响应速度"
                    >
                    <label class="form-check-label" for="improve-speed">
                      响应速度
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="improve-features"
                      v-model="improvements"
                      value="功能完善"
                    >
                    <label class="form-check-label" for="improve-features">
                      功能完善
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button 
            type="button" 
            class="btn btn-secondary" 
            data-bs-dismiss="modal"
          >
            稍后评价
          </button>
          <button 
            type="button" 
            class="btn btn-warning"
            :disabled="userRating === 0 || isSubmitting"
            @click="submitRating"
          >
            <span v-if="isSubmitting">
              <span class="spinner-border spinner-border-sm me-2"></span>
              提交中...
            </span>
            <span v-else>
              <i class="bi bi-send me-2"></i>
              提交评价
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import StarRating from './StarRating.vue'

const userRating = ref(0)
const userComment = ref('')
const isSubmitting = ref(false)
const totalRatings = ref(1248)

const categoryRatings = reactive({
  interface: 0,
  functionality: 0,
  usability: 0,
  content: 0
})

const improvements = ref<string[]>([])

const averageRating = computed(() => {
  const ratings = Object.values(categoryRatings)
  const total = ratings.reduce((sum, rating) => sum + rating, 0)
  return ratings.length > 0 ? (total / ratings.length).toFixed(1) : '0.0'
})

async function submitRating() {
  if (userRating.value === 0) return
  
  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 创建评价数据
    const ratingData = {
      overallRating: userRating.value,
      categoryRatings: categoryRatings,
      comment: userComment.value,
      improvements: improvements.value,
      timestamp: new Date().toISOString()
    }
    
    console.log('提交的评价数据:', ratingData)
    
    // 显示感谢消息
    showThankYouMessage()
    
    // 重置表单
    resetForm()
    
    // 关闭模态框
    const modal = document.getElementById('peerRatingModal')
    const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal)
    if (bootstrapModal) {
      bootstrapModal.hide()
    }
    
  } catch (error) {
    alert('评价提交失败，请稍后重试。')
  } finally {
    isSubmitting.value = false
  }
}

function showThankYouMessage() {
  // 创建感谢消息弹窗
  const thankYouModal = document.createElement('div')
  thankYouModal.innerHTML = `
    <div class="modal fade" id="thankYouModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
          <div class="modal-body text-center py-4">
            <i class="bi bi-heart-fill text-danger display-1 mb-3"></i>
            <h5>感谢您的评价！</h5>
            <p class="text-muted">您的反馈对我们改进产品非常重要</p>
          </div>
        </div>
      </div>
    </div>
  `
  document.body.appendChild(thankYouModal)
  
  const modal = new (window as any).bootstrap.Modal(document.getElementById('thankYouModal'))
  modal.show()
  
  // 3秒后自动关闭
  setTimeout(() => {
    modal.hide()
    document.body.removeChild(thankYouModal)
  }, 3000)
}

function resetForm() {
  userRating.value = 0
  userComment.value = ''
  Object.assign(categoryRatings, {
    interface: 0,
    functionality: 0,
    usability: 0,
    content: 0
  })
  improvements.value = []
}
</script>

<style scoped>
.rating-modal {
  border: none;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: linear-gradient(135deg, #ffc107, #fd7e14);
  color: white;
  border-radius: 20px 20px 0 0;
}

.btn-close {
  filter: invert(1);
}

.current-rating {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 15px;
  border: 2px dashed #ffc107;
}

.rating-number {
  font-size: 3rem;
  font-weight: bold;
  color: #ffc107;
  margin: 0;
}

.rating-stars {
  color: #ffc107;
  font-size: 1.5rem;
}

.rating-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
}

.user-rating {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid #e9ecef;
}

.category-rating {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}

.category-rating .d-flex {
  font-size: 0.9rem;
}

.comment-section textarea {
  border-radius: 10px;
  border: 2px solid #e9ecef;
  transition: border-color 0.3s ease;
}

.comment-section textarea:focus {
  border-color: #ffc107;
  box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
}

.improvements-section {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}

.form-check-input:checked {
  background-color: #ffc107;
  border-color: #ffc107;
}

.btn-warning {
  background: linear-gradient(135deg, #ffc107, #fd7e14);
  border: none;
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: linear-gradient(135deg, #e0a800, #dc6502);
  transform: translateY(-2px);
  color: white;
}

.btn-warning:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .rating-number {
    font-size: 2.5rem;
  }
  
  .current-rating {
    padding: 1.5rem;
  }
  
  .user-rating {
    padding: 1rem;
  }
}
</style>