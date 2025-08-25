<template>
  <div class="user-management">
    <h1>User Management (Admin Only)</h1>
    
    <div class="search-container">
      <input 
        v-model="searchEmail" 
        type="email" 
        placeholder="Search user by email"
        @keyup.enter="searchUser"
        aria-label="Search user by email input"
      >
      <button @click="searchUser" @keydown.enter="searchUser" @keydown.space="searchUser" aria-label="Search user button">Search</button>
    </div>
    
    <div v-if="foundUser.email" class="user-card" role="region" aria-label="User card for {{ foundUser.name }}">
      <h3>Edit User: {{ foundUser.name }}</h3>
      <div class="form-group">
        <label>Email:</label>
        <input v-model="foundUser.email" disabled aria-label="User email for {{ foundUser.name }}">
      </div>
      <div class="form-group">
        <label>Name:</label>
        <input v-model="foundUser.name" aria-label="User name input for {{ foundUser.name }}">
      </div>
      <button @click="updateUser" @keydown.enter="updateUser" @keydown.space="updateUser" :aria-label="'Update user ' + foundUser.name">Update</button>
      <button @click="resetSearch" @keydown.enter="resetSearch" @keydown.space="resetSearch" aria-label="Cancel editing user">Cancel</button>
    </div>
    
    <div v-if="errorMessage" class="error-message" aria-live="polite">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success-message" aria-live="polite">{{ successMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchEmail = ref('');
const foundUser = ref({ email: '', name: '', role: '' });
const errorMessage = ref('');
const successMessage = ref('');

function searchUser() {
  if (!searchEmail.value) {
    errorMessage.value = 'Please enter an email address';
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === searchEmail.value);
  
  if (user) {
    foundUser.value = { ...user };
    errorMessage.value = '';
    successMessage.value = '';
  } else {
    errorMessage.value = 'User not found';
    successMessage.value = '';
  }
}

function updateUser() {
  if (!foundUser.value.name) {
    errorMessage.value = 'Name cannot be empty';
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === foundUser.value.email);
  
  if (userIndex !== -1) {
    users[userIndex].name = foundUser.value.name;
    localStorage.setItem('users', JSON.stringify(users));
    
    successMessage.value = 'User updated successfully';
    errorMessage.value = '';
  } else {
    errorMessage.value = 'User not found or data has changed';
    successMessage.value = '';
  }
}

function resetSearch() {
  searchEmail.value = '';
  foundUser.value = { email: '', name: '', role: '' };
  errorMessage.value = '';
  successMessage.value = '';
}
</script>

<style scoped>
.user-management {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.user-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}
</style>