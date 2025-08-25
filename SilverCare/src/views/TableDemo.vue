<template>
  <div class="center-layout">
    <div class="table-demo-page">
      <header class="table-header">
        <button class="back-btn" @click="goBack" @keydown.enter="goBack" @keydown.space="goBack" aria-label="Go back to previous page">← Back</button>
        <h1>Interactive Tables</h1>
        <div class="download-buttons">
          <button class="download-btn" @click="downloadUsersCSV" aria-label="Download users data as CSV">Download Users CSV</button>
          <button class="download-btn" @click="downloadEventsCSV" aria-label="Download events data as CSV">Download Events CSV</button>
        </div>
      </header>
      <div class="tables-container">
        <div class="table-section">
          <DataTableComponent
            title="Users Table"
            :columns="userColumns"
            :items="usersData"
            :rows="10"
            aria-label="Users data table"
          />
        </div>
        <div class="table-section">
          <DataTableComponent
            title="Events Table"
            :columns="eventColumns"
            :items="eventsData"
            :rows="10"
            aria-label="Events data table"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DataTableComponent from '../components/DataTableComponent.vue';
import { ref } from 'vue';
import { exportToCSV } from '../services/exportService.js';
import { useRouter } from 'vue-router';

const router = useRouter();
function goBack() {
  router.back();
}

// User table columns
const userColumns = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
  { field: 'email', header: 'Email' },
  { field: 'age', header: 'Age' },
  { field: 'city', header: 'City' },
  { field: 'role', header: 'Role' }
];

// Event table columns
const eventColumns = [
  { field: 'id', header: 'ID' },
  { field: 'title', header: 'Title' },
  { field: 'date', header: 'Date' },
  { field: 'location', header: 'Location' },
  { field: 'category', header: 'Category' },
  { field: 'attendees', header: 'Attendees' }
];

// Generate mock user data
const usersData = ref(Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  age: Math.floor(Math.random() * 50) + 20,
  city: ['New York', 'London', 'Paris', 'Tokyo', 'Sydney'][Math.floor(Math.random() * 5)],
  role: ['user', 'admin', 'editor'][Math.floor(Math.random() * 3)]
})));

// Export functions
function downloadUsersCSV() {
  exportToCSV(usersData.value, 'users_data.csv', userColumns);
}

function downloadEventsCSV() {
  exportToCSV(eventsData.value, 'events_data.csv', eventColumns);
}

// Generate mock event data
const eventsData = ref(Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title: `Event ${index + 1}`,
  date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  location: ['Community Center', 'Library', 'Park', 'Senior Center', 'Online'][Math.floor(Math.random() * 5)],
  category: ['Fitness', 'Health', 'Arts', 'Education', 'Social'][Math.floor(Math.random() * 5)],
  attendees: Math.floor(Math.random() * 100) + 10
})));
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
}

.download-buttons {
  display: flex;
  gap: 10px;
}

.download-btn {
  padding: 8px 16px;
  background-color: #1ab3a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.download-btn:hover {
  background-color: #148f84;
}

.back-btn {
  padding: 8px 16px;
  background-color: transparent;
  color: #1ab3a6;
  border: 1px solid #1ab3a6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: rgba(26, 179, 166, 0.1);
}

.table-demo {
  padding: 20px;
}

.table-section {
  margin-bottom: 3rem;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
</style>