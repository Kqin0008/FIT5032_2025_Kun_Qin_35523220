<template>
  <div class="health-tips">
    <div class="container py-4">
      <!-- Page Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="page-header">
            <h1 class="page-title">
              <i class="bi bi-heart-pulse-fill me-3 text-primary"></i>
              健康资讯
            </h1>
            <p class="page-subtitle text-muted">
              专为老年人精选的健康知识和生活小贴士
            </p>
          </div>
        </div>
      </div>

      <!-- Filter and Search -->
      <div class="row mb-4">
        <div class="col-lg-8">
          <div class="search-box">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input
                type="text"
                class="form-control"
                placeholder="搜索健康资讯..."
                v-model="searchQuery"
              >
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <select 
            class="form-select"
            v-model="selectedCategory"
          >
            <option value="">所有分类</option>
            <option value="营养健康">营养健康</option>
            <option value="运动健身">运动健身</option>
            <option value="疾病预防">疾病预防</option>
            <option value="心理健康">心理健康</option>
            <option value="日常护理">日常护理</option>
          </select>
        </div>
      </div>

      <!-- Add New Tip (Admin only) -->
      <div v-if="authStore.isAdmin" class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-plus-circle me-2"></i>
                添加新的健康资讯
              </h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="addHealthTip">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="tipTitle" class="form-label">标题</label>
                    <input
                      type="text"
                      class="form-control"
                      id="tipTitle"
                      v-model="newTip.title"
                      placeholder="请输入标题"
                      required
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="tipCategory" class="form-label">分类</label>
                    <select 
                      class="form-select"
                      id="tipCategory"
                      v-model="newTip.category"
                      required
                    >
                      <option value="">请选择分类</option>
                      <option value="营养健康">营养健康</option>
                      <option value="运动健身">运动健身</option>
                      <option value="疾病预防">疾病预防</option>
                      <option value="心理健康">心理健康</option>
                      <option value="日常护理">日常护理</option>
                    </select>
                  </div>
                  <div class="col-12 mb-3">
                    <label for="tipContent" class="form-label">内容</label>
                    <textarea
                      class="form-control"
                      id="tipContent"
                      rows="3"
                      v-model="newTip.content"
                      placeholder="请输入健康小贴士的详细内容"
                      required
                    ></textarea>
                  </div>
                  <div class="col-12">
                    <button type="submit" class="btn btn-primary">
                      <i class="bi bi-plus-lg me-2"></i>
                      添加资讯
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Health Tips Grid -->
      <div class="row">
        <div v-if="filteredHealthTips.length === 0" class="col-12">
          <div class="text-center py-5">
            <i class="bi bi-search fs-1 text-muted mb-3"></i>
            <h4 class="text-muted">暂无相关健康资讯</h4>
            <p class="text-muted">请尝试其他关键词或分类</p>
          </div>
        </div>
        <div 
          v-for="tip in filteredHealthTips" 
          :key="tip.id"
          class="col-lg-6 col-xl-4 mb-4"
        >
          <div class="card health-tip-card h-100">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-start">
                <span class="badge" :class="getCategoryBadgeClass(tip.category)">
                  {{ tip.category }}
                </span>
                <small class="text-muted">
                  {{ formatDate(new Date(tip.date)) }}
                </small>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ tip.title }}</h5>
              <p class="card-text">{{ tip.content }}</p>
            </div>
            <div class="card-footer bg-transparent">
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  <i class="bi bi-calendar3 me-1"></i>
                  {{ formatDate(new Date(tip.date)) }}
                </small>
                <div class="tip-actions">
                  <button 
                    class="btn btn-outline-primary btn-sm"
                    @click="shareHealthTip(tip)"
                  >
                    <i class="bi bi-share"></i>
                  </button>
                  <button 
                    class="btn btn-outline-success btn-sm ms-2"
                    @click="bookmarkHealthTip(tip)"
                  >
                    <i class="bi bi-bookmark"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredHealthTips.length > 0" class="row mt-4">
        <div class="col-12">
          <nav aria-label="健康资讯分页">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button 
                  class="page-link" 
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                >
                  上一页
                </button>
              </li>
              <li 
                v-for="page in totalPages" 
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
              >
                <button 
                  class="page-link" 
                  @click="changePage(page)"
                >
                  {{ page }}
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button 
                  class="page-link" 
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                >
                  下一页
                </button>
              </li>
            </ul>
          </nav>
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
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/data'
import type { HealthTip } from '@/stores/data'

const authStore = useAuthStore()
const dataStore = useDataStore()

// State
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const modalMessage = ref('')

// New tip form (for admin)
const newTip = reactive({
  title: '',
  content: '',
  category: ''
})

// Computed properties
const filteredHealthTips = computed(() => {
  let tips = [...dataStore.healthTips]
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    tips = tips.filter(tip => 
      tip.title.toLowerCase().includes(query) ||
      tip.content.toLowerCase().includes(query) ||
      tip.category.toLowerCase().includes(query)
    )
  }
  
  // Filter by category
  if (selectedCategory.value) {
    tips = tips.filter(tip => tip.category === selectedCategory.value)
  }
  
  // Sort by date (newest first)
  tips.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return tips.slice(start, end)
})

const totalPages = computed(() => {
  let tips = [...dataStore.healthTips]
  
  // Apply filters
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    tips = tips.filter(tip => 
      tip.title.toLowerCase().includes(query) ||
      tip.content.toLowerCase().includes(query) ||
      tip.category.toLowerCase().includes(query)
    )
  }
  
  if (selectedCategory.value) {
    tips = tips.filter(tip => tip.category === selectedCategory.value)
  }
  
  return Math.ceil(tips.length / itemsPerPage)
})

// Methods
function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getCategoryBadgeClass(category: string): string {
  const classes: { [key: string]: string } = {
    '营养健康': 'bg-success',
    '运动健身': 'bg-primary',
    '疾病预防': 'bg-danger',
    '心理健康': 'bg-info',
    '日常护理': 'bg-warning'
  }
  return classes[category] || 'bg-secondary'
}

function addHealthTip(): void {
  if (!newTip.title || !newTip.content || !newTip.category) {
    return
  }
  
  const tipData: Omit<HealthTip, 'id'> = {
    title: newTip.title,
    content: newTip.content,
    category: newTip.category,
    date: new Date().toISOString().split('T')[0]
  }
  
  dataStore.addHealthTip(tipData)
  
  // Reset form
  newTip.title = ''
  newTip.content = ''
  newTip.category = ''
  
  // Show success message
  modalMessage.value = '健康资讯添加成功！'
  showModal()
}

function shareHealthTip(tip: HealthTip): void {
  // In a real app, this would integrate with sharing APIs
  if (navigator.share) {
    navigator.share({
      title: tip.title,
      text: tip.content,
      url: window.location.href
    })
  } else {
    // Fallback: copy to clipboard
    const shareText = `${tip.title}\n\n${tip.content}`
    navigator.clipboard.writeText(shareText).then(() => {
      modalMessage.value = '内容已复制到剪贴板！'
      showModal()
    })
  }
}

function bookmarkHealthTip(tip: HealthTip): void {
  // In a real app, this would save to user's bookmarks
  modalMessage.value = `已收藏："${tip.title}"`
  showModal()
}

function changePage(page: number): void {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function showModal(): void {
  const modal = new (window as any).bootstrap.Modal(document.getElementById('successModal'))
  modal.show()
}

// Reset pagination when filters change
function resetPagination(): void {
  currentPage.value = 1
}

// Watch for filter changes
const unwatchSearch = ref()
const unwatchCategory = ref()

onMounted(() => {
  // Watch for changes in search and category to reset pagination
  unwatchSearch.value = () => resetPagination()
  unwatchCategory.value = () => resetPagination()
})
</script>

<style scoped>
.health-tips {
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

.search-box .form-control {
  border-radius: 25px;
  padding: 0.75rem 1rem;
}

.search-box .input-group-text {
  border-radius: 25px 0 0 25px;
  background: white;
  border-right: none;
}

.form-select {
  border-radius: 25px;
}

.health-tip-card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  transition: all 0.3s ease;
  border-top: 4px solid #FFD93D;
}

.health-tip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.health-tip-card .card-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  border-radius: 15px 15px 0 0 !important;
}

.health-tip-card .card-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.health-tip-card .card-text {
  color: #6c757d;
  line-height: 1.6;
}

.tip-actions .btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pagination .page-link {
  border-radius: 25px;
  margin: 0 2px;
  border: 2px solid #e9ecef;
  color: #4ECDC4;
}

.pagination .page-item.active .page-link {
  background-color: #4ECDC4;
  border-color: #4ECDC4;
}

.pagination .page-link:hover {
  background-color: #f8f9fa;
  border-color: #4ECDC4;
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
  
  .search-box {
    margin-bottom: 1rem;
  }
}
</style>