<template>
  <div 
    class="modal fade" 
    id="taichiBookingModal" 
    tabindex="-1" 
    aria-labelledby="taichiBookingModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content taichi-modal">
        <div class="modal-header border-0">
          <h5 class="modal-title" id="taichiBookingModalLabel">
            <i class="bi bi-calendar-plus text-success me-2"></i>
            Tai Chi Class Booking
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            data-bs-dismiss="modal" 
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body py-4">
          <!-- Class Information -->
          <div class="class-info mb-4">
            <div class="row align-items-center">
              <div class="col-md-3 text-center">
                <div class="taichi-icon">
                  <i class="bi bi-person-arms-up text-success display-3"></i>
                </div>
              </div>
              <div class="col-md-9">
                <h4 class="text-primary">太极拳班</h4>
                <p class="text-muted mb-2">
                  专为老年人设计的太极拳课程，有助于改善身体平衡和柔韧性，
                  增强肌肉力量，促进身心健康。
                </p>
                <div class="class-details">
                  <span class="badge bg-success me-2">
                    <i class="bi bi-people me-1"></i>15/20 人已报名
                  </span>
                  <span class="badge bg-info me-2">
                    <i class="bi bi-geo-alt me-1"></i>社区活动中心
                  </span>
                  <span class="badge bg-warning">
                    <i class="bi bi-star me-1"></i>教练：李老师
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Time Selection -->
          <div class="time-selection mb-4">
            <h6 class="text-primary mb-3">
              <i class="bi bi-clock me-2"></i>
              选择上课时间
            </h6>
            <div class="row g-3">
              <div 
                v-for="timeSlot in timeSlots" 
                :key="timeSlot.id"
                class="col-md-6"
              >
                <div 
                  class="time-slot-card"
                  :class="{ 
                    'selected': selectedTimeSlot === timeSlot.id,
                    'disabled': timeSlot.isBooked 
                  }"
                  @click="selectTimeSlot(timeSlot)"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">{{ timeSlot.day }}</h6>
                      <p class="mb-0 text-muted">{{ timeSlot.time }}</p>
                    </div>
                    <div class="text-end">
                      <span 
                        v-if="timeSlot.isBooked" 
                        class="badge bg-danger"
                      >
                        已满
                      </span>
                      <span 
                        v-else-if="selectedTimeSlot === timeSlot.id" 
                        class="badge bg-success"
                      >
                        已选择
                      </span>
                      <span 
                        v-else 
                        class="badge bg-outline-primary"
                      >
                        可预约
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Form -->
          <div v-if="selectedTimeSlot" class="booking-form">
            <h6 class="text-primary mb-3">
              <i class="bi bi-person-check me-2"></i>
              预约信息
            </h6>
            <form @submit.prevent="submitBooking">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="participantName" class="form-label">参与者姓名</label>
                  <input
                    type="text"
                    class="form-control"
                    id="participantName"
                    v-model="bookingForm.participantName"
                    placeholder="请输入参与者姓名"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="contactPhone" class="form-label">联系电话</label>
                  <input
                    type="tel"
                    class="form-control"
                    id="contactPhone"
                    v-model="bookingForm.contactPhone"
                    placeholder="请输入联系电话"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="age" class="form-label">年龄</label>
                  <input
                    type="number"
                    class="form-control"
                    id="age"
                    v-model.number="bookingForm.age"
                    placeholder="请输入年龄"
                    min="18"
                    max="120"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="healthCondition" class="form-label">健康状况</label>
                  <select class="form-select" id="healthCondition" v-model="bookingForm.healthCondition" required>
                    <option value="">请选择</option>
                    <option value="excellent">良好</option>
                    <option value="good">一般</option>
                    <option value="fair">需要注意</option>
                  </select>
                </div>
                <div class="col-12 mb-3">
                  <label for="specialNotes" class="form-label">特殊说明</label>
                  <textarea
                    class="form-control"
                    id="specialNotes"
                    rows="3"
                    v-model="bookingForm.specialNotes"
                    placeholder="如有特殊健康情况或需求，请在此说明"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer border-0">
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
            :disabled="!selectedTimeSlot || isSubmitting"
            @click="submitBooking"
          >
            <span v-if="isSubmitting">
              <span class="spinner-border spinner-border-sm me-2"></span>
              提交中...
            </span>
            <span v-else>
              <i class="bi bi-check-lg me-2"></i>
              确认预约
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface TimeSlot {
  id: number
  day: string
  time: string
  isBooked: boolean
}

const selectedTimeSlot = ref<number | null>(null)
const isSubmitting = ref(false)

const bookingForm = reactive({
  participantName: '',
  contactPhone: '',
  age: null as number | null,
  healthCondition: '',
  specialNotes: ''
})

const timeSlots: TimeSlot[] = [
  { id: 1, day: '周一', time: '09:00 - 10:00', isBooked: false },
  { id: 2, day: '周三', time: '09:00 - 10:00', isBooked: false },
  { id: 3, day: '周五', time: '09:00 - 10:00', isBooked: true },
  { id: 4, day: '周一', time: '15:00 - 16:00', isBooked: false },
  { id: 5, day: '周三', time: '15:00 - 16:00', isBooked: false },
  { id: 6, day: '周五', time: '15:00 - 16:00', isBooked: false }
]

function selectTimeSlot(timeSlot: TimeSlot) {
  if (!timeSlot.isBooked) {
    selectedTimeSlot.value = timeSlot.id
  }
}

async function submitBooking() {
  if (!selectedTimeSlot.value) return
  
  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 显示成功消息
    alert('预约成功！我们会尽快与您联系确认详细信息。')
    
    // 重置表单
    Object.assign(bookingForm, {
      participantName: '',
      contactPhone: '',
      age: null,
      healthCondition: '',
      specialNotes: ''
    })
    selectedTimeSlot.value = null
    
    // 关闭模态框
    const modal = document.getElementById('taichiBookingModal')
    const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal)
    if (bootstrapModal) {
      bootstrapModal.hide()
    }
    
  } catch (error) {
    alert('预约提交失败，请稍后重试。')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.taichi-modal {
  border: none;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border-radius: 20px 20px 0 0;
}

.btn-close {
  filter: invert(1);
}

.taichi-icon {
  background: rgba(40, 167, 69, 0.1);
  border-radius: 50%;
  padding: 1rem;
  display: inline-block;
}

.class-info {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
  border-left: 4px solid #28a745;
}

.class-details {
  margin-top: 1rem;
}

.time-slot-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.time-slot-card:hover:not(.disabled) {
  border-color: #28a745;
  background: #f8f9fa;
}

.time-slot-card.selected {
  border-color: #28a745;
  background: rgba(40, 167, 69, 0.1);
}

.time-slot-card.disabled {
  background: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.6;
}

.booking-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
  border-left: 4px solid #17a2b8;
}

.form-control:focus,
.form-select:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.btn-success {
  background: linear-gradient(135deg, #28a745, #20c997);
  border: none;
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-weight: 600;
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838, #1e9e8b);
  transform: translateY(-2px);
}

.btn-success:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .taichi-icon {
    padding: 0.5rem;
  }
  
  .time-slot-card {
    padding: 0.75rem;
  }
}
</style>