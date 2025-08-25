<template>
  <div class="center-layout">
    <div class="event-page">
      <header class="event-header">
        <button class="back-btn" @click="goBack">← Back</button>
        <h1>Event Registration</h1>
      </header>
      <div class="event-container">
      <div class="calendar-section">
        <div class="calendar-header">
          <button class="nav-btn" @click="previousMonth" @keydown.enter="previousMonth" @keydown.space="previousMonth" aria-label="Previous month">‹</button>
          <h2>{{ currentMonthYear }}</h2>
          <button class="nav-btn" @click="nextMonth" @keydown.enter="nextMonth" @keydown.space="nextMonth" aria-label="Next month">›</button>
        </div>
        <div class="calendar-grid">
          <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
          <div 
            v-for="date in calendarDates" 
            :key="date.key"
            :class="['calendar-day', { 
              'other-month': !date.currentMonth,
              'today': date.isToday,
              'has-event': date.hasEvent,
              'selected': selectedDate === date.key
            }]"
            @click="selectDate(date)"
            @keydown.enter="selectDate(date)"
            @keydown.space="selectDate(date)"
            :tabindex="date.currentMonth ? '0' : '-1'"
            :aria-label="`${date.day} ${date.currentMonth ? '' : '(outside current month)'}`"
            :aria-selected="selectedDate === date.key"
            role="button"
          >
            {{ date.day }}
            <div v-if="date.hasEvent" class="event-indicator" aria-label="Has event">●</div>
          </div>
        </div>
      </div>
      <div class="booking-section">
        <h3>Tai Chi Class Booking</h3>
        <div v-if="selectedDate" class="selected-date">
          Selected: {{ formatDate(selectedDate) }}
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
          v-if="selectedSlot" 
          class="book-btn" 
          @click="confirmBooking"
          @keydown.enter="confirmBooking"
          @keydown.space="confirmBooking"
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

const router = useRouter();
const currentDate = ref(new Date());
const selectedDate = ref(null);
const selectedSlot = ref(null);

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
});

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    dates.push({
      key: date.toISOString().split('T')[0],
      day: date.getDate(),
      currentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString(),
      hasEvent: Math.random() > 0.7 // 随机显示有活动的日期
    });
  }
  
  return dates;
});

const availableSlots = ref([
  { time: '09:00 AM', booked: false },
  { time: '10:30 AM', booked: true },
  { time: '02:00 PM', booked: false },
  { time: '03:30 PM', booked: false },
  { time: '05:00 PM', booked: true },
  { time: '06:30 PM', booked: false }
]);

function goBack() {
  router.go(-1);
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
    alert(`Booking confirmed for ${formatDate(selectedDate.value)} at ${selectedSlot.value.time}`);
    selectedSlot.value.booked = true;
    selectedSlot.value = null;
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

.calendar-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #1ab3a6;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: #e0f7f4;
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
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.time-slot.booked:hover {
  border-color: #e0e0e0;
  background: #f5f5f5;
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