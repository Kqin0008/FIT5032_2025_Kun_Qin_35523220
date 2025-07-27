<template>
  <div class="events">
    <div class="container py-4">
      <!-- Page Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="page-header">
            <h1 class="page-title">
              <i class="bi bi-calendar-event-fill me-3 text-success"></i>
              活动报名
            </h1>
            <p class="page-subtitle text-muted">
              参与丰富多彩的社区健康活动，结交志同道合的朋友
            </p>
          </div>
        </div>
      </div>

      <!-- Filter and Search -->
      <div class="row mb-4">
        <div class="col-lg-6">
          <div class="search-box">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input
                type="text"
                class="form-control"
                placeholder="搜索活动..."
                v-model="searchQuery"
              >
            </div>
          </div>
        </div>
        <div class="col-lg-3">
          <select 
            class="form-select"
            v-model="selectedCategory"
          >
            <option value="">所有分类</option>
            <option value="运动健身">运动健身</option>
            <option value="健康讲座">健康讲座</option>
            <option value="营养健康">营养健康</option>
            <option value="文化娱乐">文化娱乐</option>
          </select>
        </div>
        <div class="col-lg-3">
          <select 
            class="form-select"
            v-model="filterType"
          >
            <option value="all">所有活动</option>
            <option value="upcoming">即将开始</option>
            <option value="available">名额充足</option>
            <option value="enrolled">已报名</option>
          </select>
        </div>
      </div>

      <!-- Add New Event (Admin only) -->
      <div v-if="authStore.isAdmin" class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-plus-circle me-2"></i>
                添加新活动
              </h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="addEvent">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="eventTitle" class="form-label">活动标题</label>
                    <input
                      type="text"
                      class="form-control"
                      id="eventTitle"
                      v-model="newEvent.title"
                      placeholder="请输入活动标题"
                      required
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="eventCategory" class="form-label">活动分类</label>
                    <select 
                      class="form-select"
                      id="eventCategory"
                      v-model="newEvent.category"
                      required
                    >
                      <option value="">请选择分类</option>
                      <option value="运动健身">运动健身</option>
                      <option value="健康讲座">健康讲座</option>
                      <option value="营养健康">营养健康</option>
                      <option value="文化娱乐">文化娱乐</option>
                    </select>
                  </div>
                  <div class="col-12 mb-3">
                    <label for="eventDescription" class="form-label">活动描述</label>
                    <textarea
                      class="form-control"
                      id="eventDescription"
                      rows="3"
                      v-model="newEvent.description"
                      placeholder="请输入活动详细描述"
                      required
                    ></textarea>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="eventDate" class="form-label">活动日期</label>
                    <input
                      type="date"
                      class="form-control"
                      id="eventDate"
                      v-model="newEvent.date"
                      required
                    >
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="eventTime" class="form-label">活动时间</label>
                    <input
                      type="time"
                      class="form-control"
                      id="eventTime"
                      v-model="newEvent.time"
                      required
                    >
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="eventCapacity" class="form-label">活动容量</label>
                    <input
                      type="number"
                      class="form-control"
                      id="eventCapacity"
                      v-model.number="newEvent.capacity"
                      min="1"
                      max="200"
                      placeholder="最大参与人数"
                      required
                    >
                  </div>
                  <div class="col-12 mb-3">
                    <label for="eventLocation" class="form-label">活动地点</label>
                    <input
                      type="text"
                      class="form-control"
                      id="eventLocation"
                      v-model="newEvent.location"
                      placeholder="请输入活动地点"
                      required
                    >
                  </div>
                  <div class="col-12">
                    <button type="submit" class="btn btn-success">
                      <i class="bi bi-plus-lg me-2"></i>
                      添加活动
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Events Grid -->
      <div class="row">
        <div v-if="filteredEvents.length === 0" class="col-12">
          <div class="text-center py-5">
            <i class="bi bi-calendar-x fs-1 text-muted mb-3"></i>
            <h4 class="text-muted">暂无相关活动</h4>
            <p class="text-muted">请尝试其他搜索条件</p>
          </div>
        </div>
        <div 
          v-for="event in filteredEvents" 
          :key="event.id"
          class="col-lg-6 col-xl-4 mb-4"
        >
          <div class="card event-card h-100">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-start">
                <span class="badge" :class="getCategoryBadgeClass(event.category)">
                  {{ event.category }}
                </span>
                <span 
                  class="badge"
                  :class="getStatusBadgeClass(event)"
                >
                  {{ getEventStatus(event) }}
                </span>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ event.title }}</h5>
              <p class="card-text text-muted">{{ event.description }}</p>
              
              <div class="event-details mb-3">
                <div class="detail-item">
                  <i class="bi bi-calendar3 me-2 text-primary"></i>
                  <span>{{ formatDate(new Date(event.date)) }}</span>
                </div>
                <div class="detail-item">
                  <i class="bi bi-clock me-2 text-primary"></i>
                  <span>{{ event.time }}</span>
                </div>
                <div class="detail-item">
                  <i class="bi bi-geo-alt me-2 text-primary"></i>
                  <span>{{ event.location }}</span>
                </div>
                <div class="detail-item">
                  <i class="bi bi-people me-2 text-primary"></i>
                  <span>{{ event.enrolled }}/{{ event.capacity }} 人</span>
                </div>
              </div>

              <div class="progress mb-3">
                <div 
                  class="progress-bar"
                  :class="getProgressBarClass(event)"
                  role="progressbar" 
                  :style="`width: ${(event.enrolled / event.capacity) * 100}%`"
                  :aria-valuenow="event.enrolled"
                  :aria-valuemin="0"
                  :aria-valuemax="event.capacity"
                ></div>
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  剩余名额：{{ event.capacity - event.enrolled }}
                </small>
                <button 
                  class="btn"
                  :class="getEnrollButtonClass(event)"
                  :disabled="!canEnroll(event)"
                  @click="enrollInEvent(event)"
                >
                  {{ getEnrollButtonText(event) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enrollment Confirmation Modal -->
    <div 
      class="modal fade" 
      id="enrollModal" 
      tabindex="-1" 
      aria-labelledby="enrollModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="enrollModalLabel">
              <i class="bi bi-calendar-check text-success me-2"></i>
              确认报名
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="关闭"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedEvent">
            <p>您确定要报名参加以下活动吗？</p>
            <div class="event-summary">
              <h6>{{ selectedEvent.title }}</h6>
              <p class="text-muted">{{ selectedEvent.description }}</p>
              <div class="row">
                <div class="col-6">
                  <strong>日期：</strong>{{ formatDate(new Date(selectedEvent.date)) }}
                </div>
                <div class="col-6">
                  <strong>时间：</strong>{{ selectedEvent.time }}
                </div>
                <div class="col-12 mt-2">
                  <strong>地点：</strong>{{ selectedEvent.location }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button 
              type="button" 
              class="btn btn-success"
              @click="confirmEnrollment"
            >
              确认报名
            </button>
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
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/data'
import type { Event } from '@/stores/data'

const authStore = useAuthStore()
const dataStore = useDataStore()

// State
const searchQuery = ref('')
const selectedCategory = ref('')
const filterType = ref('all')
const modalMessage = ref('')
const selectedEvent = ref<Event | null>(null)

// New event form (for admin)
const newEvent = reactive({
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  category: '',
  capacity: 20,
  enrolled: 0
})

// Computed properties
const filteredEvents = computed(() => {
  let events = [...dataStore.events]
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    events = events.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
    )
  }
  
  // Filter by category
  if (selectedCategory.value) {
    events = events.filter(event => event.category === selectedCategory.value)
  }
  
  // Filter by type
  const now = new Date()
  switch (filterType.value) {
    case 'upcoming':
      events = events.filter(event => new Date(event.date) >= now)
      break
    case 'available':
      events = events.filter(event => event.enrolled < event.capacity)
      break
    case 'enrolled':
      events = events.filter(event => dataStore.enrolledEvents.includes(event.id))
      break
  }
  
  // Sort by date
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  return events
})

// Methods
function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  })
}

function getCategoryBadgeClass(category: string): string {
  const classes: { [key: string]: string } = {
    '运动健身': 'bg-primary',
    '健康讲座': 'bg-info',
    '营养健康': 'bg-success',
    '文化娱乐': 'bg-warning'
  }
  return classes[category] || 'bg-secondary'
}

function getEventStatus(event: Event): string {
  const now = new Date()
  const eventDate = new Date(event.date)
  
  if (eventDate < now) {
    return '已结束'
  } else if (event.enrolled >= event.capacity) {
    return '已满员'
  } else if (dataStore.enrolledEvents.includes(event.id)) {
    return '已报名'
  } else {
    return '可报名'
  }
}

function getStatusBadgeClass(event: Event): string {
  const status = getEventStatus(event)
  const classes: { [key: string]: string } = {
    '已结束': 'bg-secondary',
    '已满员': 'bg-danger',
    '已报名': 'bg-success',
    '可报名': 'bg-primary'
  }
  return classes[status] || 'bg-secondary'
}

function getProgressBarClass(event: Event): string {
  const percentage = (event.enrolled / event.capacity) * 100
  if (percentage >= 90) return 'bg-danger'
  if (percentage >= 70) return 'bg-warning'
  return 'bg-success'
}

function canEnroll(event: Event): boolean {
  const now = new Date()
  const eventDate = new Date(event.date)
  
  return eventDate >= now && 
         event.enrolled < event.capacity && 
         !dataStore.enrolledEvents.includes(event.id)
}

function getEnrollButtonClass(event: Event): string {
  if (!canEnroll(event)) {
    return 'btn-secondary'
  }
  return 'btn-success'
}

function getEnrollButtonText(event: Event): string {
  const now = new Date()
  const eventDate = new Date(event.date)
  
  if (eventDate < now) {
    return '已结束'
  } else if (event.enrolled >= event.capacity) {
    return '已满员'
  } else if (dataStore.enrolledEvents.includes(event.id)) {
    return '已报名'
  } else {
    return '立即报名'
  }
}

function enrollInEvent(event: Event): void {
  if (!canEnroll(event)) return
  
  selectedEvent.value = event
  const modal = new (window as any).bootstrap.Modal(document.getElementById('enrollModal'))
  modal.show()
}

function confirmEnrollment(): void {
  if (!selectedEvent.value || !authStore.currentUser) return
  
  const success = dataStore.enrollInEvent(selectedEvent.value.id, authStore.currentUser.id)
  
  if (success) {
    modalMessage.value = `报名成功！您已成功报名参加"${selectedEvent.value.title}"活动。`
    
    // Close enrollment modal
    const enrollModal = (window as any).bootstrap.Modal.getInstance(document.getElementById('enrollModal'))
    if (enrollModal) {
      enrollModal.hide()
    }
    
    // Show success modal
    setTimeout(() => {
      const successModal = new (window as any).bootstrap.Modal(document.getElementById('successModal'))
      successModal.show()
    }, 300)
  } else {
    modalMessage.value = '报名失败，请稍后重试。'
    const successModal = new (window as any).bootstrap.Modal(document.getElementById('successModal'))
    successModal.show()
  }
  
  selectedEvent.value = null
}

function addEvent(): void {
  if (!newEvent.title || !newEvent.description || !newEvent.date || 
      !newEvent.time || !newEvent.location || !newEvent.category) {
    return
  }
  
  const eventData: Omit<Event, 'id'> = {
    title: newEvent.title,
    description: newEvent.description,
    date: newEvent.date,
    time: newEvent.time,
    location: newEvent.location,
    category: newEvent.category,
    capacity: newEvent.capacity,
    enrolled: 0
  }
  
  dataStore.addEvent(eventData)
  
  // Reset form
  Object.assign(newEvent, {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    capacity: 20,
    enrolled: 0
  })
  
  modalMessage.value = '活动添加成功！'
  const successModal = new (window as any).bootstrap.Modal(document.getElementById('successModal'))
  successModal.show()
}

onMounted(() => {
  // Set minimum date to today for new event form
  const today = new Date().toISOString().split('T')[0]
  newEvent.date = today
})
</script>

<style scoped>
.events {
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

.event-card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  transition: all 0.3s ease;
  border-left: 4px solid #4ECDC4;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.event-card .card-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  border-radius: 15px 15px 0 0 !important;
}

.event-card .card-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.event-details {
  font-size: 0.9rem;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.progress {
  height: 8px;
  border-radius: 4px;
}

.event-summary {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
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
  
  .col-lg-3 {
    margin-bottom: 1rem;
  }
}
</style>