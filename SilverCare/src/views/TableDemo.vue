<template>
  <div class="table-demo">
    <h1>Interactive Table Demo</h1>

    <div class="table-section">
      <DataTableComponent
        title="Users Table"
        :columns="userColumns"
        :items="usersData"
        :rows="10"
      />
    </div>

    <div class="table-section">
      <DataTableComponent
        title="Events Table"
        :columns="eventColumns"
        :items="eventsData"
        :rows="10"
      />
    </div>
  </div>
</template>

<script setup>
import DataTableComponent from '../components/DataTableComponent.vue';
import { ref } from 'vue';

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