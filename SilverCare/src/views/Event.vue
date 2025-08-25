<template>
  <div class="center-layout">
    <div class="event-page">
      <header class="event-header">
        <button class="back-btn" @click="viewMode === 'slots' ? goToDateSelection() : goBack()">
          {{ viewMode === 'slots' ? '← Back to Dates' : '← Back' }}
        </button>
        <h1>{{ viewMode === 'dates' ? 'Event Registration' : `Book for ${formatDate(selectedDate)}` }}</h1>
      </header>
      <div class="event-container">
        <div v-if="viewMode === 'dates'" class="calendar-section">
          <FullCalendar :options="calendarOptions" />
        </div>
        <div v-else class="booking-section-fullwidth">
          <h3>Available Time Slots</h3>
          <div class="selected-date">
            Date: {{ formatDate(selectedDate) }}
          </div>
          <div class="time-slots">
            <div 
              v-for="slot in availableSlots" 
              :key="slot.time"
              :class="['time-slot', { 'booked': slot.booked }]"
              @click="bookSlot(slot)"
              @keydown.enter="bookSlot(slot)"
              @keydown.space="bookSlot(slot)"
              :tabindex="slot.booked ? '-1' : '0'"
              :aria-label="`${slot.time} - ${slot.booked ? 'Booked' : 'Available'}`"
              role="button"
            >
              <span class="time">{{ slot.time }}</span>
              <span class="status">{{ slot.booked ? 'Booked' : 'Available' }}</span>
            </div>
          </div>
          <button 
            :disabled="!selectedSlot" 
            class="book-btn" 
            @click="confirmBooking"
            @keydown.enter="confirmBooking"
            @keydown.space="confirmBooking"
            :aria-disabled="!selectedSlot"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const router = useRouter();
const selectedDate = ref(null);
const selectedSlot = ref(null);
const currentDate = ref(new Date());
const viewMode = ref('dates'); // 'dates' or 'slots'

// 生成时间段 - 上午9点到11点，下午2点到4点，每个时间段1小时
function generateTimeSlots() {
  return [
    { time: '09:00 AM - 10:00 AM', booked: false },
    { time: '10:00 AM - 11:00 AM', booked: false },
    { time: '02:00 PM - 03:00 PM', booked: false },
    { time: '03:00 PM - 04:00 PM', booked: false }
  ];
}

// 模拟时间段数据
const eventsData = ref([
  { id: 1, date: '2023-06-15', timeSlots: generateTimeSlots() },
  { id: 2, date: '2023-06-16', timeSlots: generateTimeSlots() },
  { id: 3, date: '2023-06-20', timeSlots: generateTimeSlots() },
  { id: 4, date: '2023-06-21', timeSlots: generateTimeSlots() },
  { id: 5, date: '2023-06-25', timeSlots: generateTimeSlots() },
  { id: 6, date: '2023-06-26', timeSlots: generateTimeSlots() }
]);

// Calendar options
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,dayGridDay'
  },
  events: [
    { title: 'Tai Chi Class', date: '2023-06-15', backgroundColor: '#1ab3a6' },
    { title: 'Health Workshop', date: '2023-06-20', backgroundColor: '#1ab3a6' },
    { title: 'Senior Social', date: '2023-06-25', backgroundColor: '#1ab3a6' }
  ],
  dateClick: handleDateClick,
  eventClick: handleEventClick
});

// 删除重复的eventsData声明

// Computed property for available slots based on selected date
const availableSlots = computed(() => {
  if (!selectedDate.value) return [];
  
  // Find event for selected date
  const event = eventsData.value.find(e => e.date === selectedDate.value);
  
  // If event exists for this date, return its slots
  // Otherwise, generate default available slots
  return event ? event.timeSlots : generateTimeSlots();
});

// Calendar event handlers
function handleDateClick(info) {
  selectedDate.value = info.dateStr;
  selectedSlot.value = null;
  viewMode.value = 'slots'; // 选择日期后切换到时间段视图
}

function goToDateSelection() {
  viewMode.value = 'dates';
}

function handleEventClick(info) {
  selectedDate.value = info.event.startStr.split('T')[0];
  selectedSlot.value = null;
}

function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
}

function selectDate(date) {
  if (date.currentMonth) {
    selectedDate.value = date.key;
    selectedSlot.value = null;
  }
}

function bookSlot(slot) {
  if (!slot.booked) {
    selectedSlot.value = slot;
  }
}

function confirmBooking() {
  if (selectedSlot.value && selectedDate.value) {
    // 直接调用后端API处理预约
    fetch('/api/book-appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: selectedDate.value,
        time: selectedSlot.value.time,
        userId: 'user123', // 实际应用中应从认证信息获取
        userName: '当前用户' // 实际应用中应从认证信息获取
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json().then(data => ({ success: true, data }));
      } else {
        return response.json().then(data => ({ success: false, status: response.status, data }));
      }
    })
    .then(result => {
      if (result.success) {
        alert('successfully appointed');
        selectedSlot.value.booked = true;
        selectedSlot.value = null;
      } else {
        // 检查是否是预约冲突错误
        if (result.status === 409) {
          alert('failed appointed');
        } else {
          alert('failed appointed');
        }
      }
    })
    .catch(error => {
      console.error('预约错误:', error);
      alert('failed appointed');
    });
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function goBack() {
  router.go(-1);
}


</script>

<style scoped>
.center-layout {
  min-height: 100vh;
  width: 100vw;
  background: #f8fafc;
}
.event-page {
  max-width: 900px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (max-width: 900px) {
  .event-page { max-width: 100vw; }
}
@media (max-width: 600px) {
  .event-page { padding: 0 8px; }
}

.event-header {
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

.event-header h1 {
  color: #1ab3a6;
  font-size: 2rem;
  margin: 0;
}

.event-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 800px;
  width: 100%;
}

.booking-section-fullwidth {
  grid-column: 1 / -1; /* 跨越所有列 */
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.calendar-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

/* FullCalendar button styling */
.calendar-section .fc-button {
  background-color: #1ab3a6 !important;
  border-color: #1ab3a6 !important;
  color: white !important;
}

.calendar-section .fc-button:hover {
  background-color: #6ed6c5 !important;
  border-color: #6ed6c5 !important;
}

.calendar-section .fc-button:active,
.calendar-section .fc-button:focus {
  box-shadow: 0 0 0 0.2rem rgba(26, 179, 166, 0.25) !important;
}

.calendar-section .fc-button-primary:not(:disabled).fc-button-active {
  background-color: #6ed6c5 !important;
  border-color: #6ed6c5 !important;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.nav-btn {
  background: #1ab3a6;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: #6ed6c5;
}

.calendar-header h2 {
  color: #333;
  margin: 0;
  font-size: 1.3rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.weekday {
  text-align: center;
  font-weight: bold;
  color: #666;
  padding: 8px;
  font-size: 0.9rem;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  font-size: 0.9rem;
}

.calendar-day:hover {
  background: #e0f7f4;
}

.calendar-day.other-month {
  color: #ccc;
}

.calendar-day.today {
  background: #1ab3a6;
  color: #fff;
  font-weight: bold;
}

.calendar-day.has-event {
  font-weight: bold;
  color: #1ab3a6;
}

.calendar-day.selected {
  background: #6ed6c5;
  color: #fff;
}

.event-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 0.6rem;
  color: #ff6b6b;
}

.booking-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.booking-section h3 {
  color: #1ab3a6;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
}

.selected-date {
  background: #e0f7f4;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #1ab3a6;
  font-weight: bold;
}

.time-slots {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.time-slot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.time-slot:hover {
  border-color: #1ab3a6;
  background: #f0f7f6;
}

.time-slot.booked {
  background: #1ab3a6;
  color: #ffffff;
  cursor: not-allowed;
  opacity: 0.7;
}

.time-slot.booked {
  background: #1ab3a6;
  color: #ffffff;
  cursor: not-allowed;
  opacity: 0.7;
}

.time {
  font-weight: bold;
  color: #333;
}

.status {
  font-size: 0.9rem;
  color: #666;
}

.book-btn {
  width: 100%;
  background: #1ab3a6;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.book-btn:disabled {
  background: #b2dbd7;
  color: #ffffff;
  cursor: not-allowed;
  opacity: 0.7;
}

.book-btn:hover {
  background: #6ed6c5;
}

@media (max-width: 768px) {
  .event-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .calendar-grid {
    gap: 4px;
  }
  
  .calendar-day {
    font-size: 0.8rem;
  }
}
</style>