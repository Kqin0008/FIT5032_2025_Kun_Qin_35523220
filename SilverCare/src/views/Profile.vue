<template>
  <div class="center-layout">
    <div class="profile-page">
      <h2>Profile</h2>
      <div v-if="user">
        <form @submit.prevent="saveProfile">
          <div class="form-group">
            <label>Name</label>
            <input v-model="editUser.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="editUser.email" type="email" required disabled />
          </div>
          <div class="form-group">
            <label>Role</label>
            <input v-model="editUser.role" type="text" disabled />
          </div>
          <button class="profile-btn" type="submit">Save</button>
        </form>
        <div v-if="saved" class="saved-msg">Profile saved!</div>
        <button class="logout-btn" @click="handleLogout">Logout</button>
        <div v-if="user.role === 'admin'" class="admin-msg">You are an admin. You have access to admin features.</div>
      </div>
      <div v-else class="not-logged">Please log in to view your profile.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { authState, logout } from '../auth.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = computed(() => authState.user);
const editUser = ref(user.value ? { ...user.value } : {});
const saved = ref(false);

watch(user, (val) => {
  if (val) editUser.value = { ...val };
});

function saveProfile() {
  if (!editUser.value.name || editUser.value.name.length < 2) return;
  authState.user.name = editUser.value.name;
  // 更新localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const idx = users.findIndex(u => u.email === authState.user.email);
  if (idx !== -1) {
    users[idx].name = editUser.value.name;
    localStorage.setItem('users', JSON.stringify(users));
  }
  saved.value = true;
  setTimeout(() => (saved.value = false), 1500);
}
function handleLogout() {
  logout();
  router.push('/login');
}
</script>

<style scoped>
.center-layout {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
}
.profile-page {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 40px 32px;
  width: 350px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-page h2 {
  color: #1ab3a6;
  margin-bottom: 24px;
}
.form-group {
  width: 100%;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}
label {
  margin-bottom: 6px;
  color: #333;
  font-weight: 500;
}
input {
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}
input:focus {
  border-color: #1ab3a6;
}
.profile-btn {
  width: 100%;
  background: #1ab3a6;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}
.profile-btn:hover {
  background: #6ed6c5;
}
.saved-msg {
  color: #1ab3a6;
  margin-top: 12px;
  font-size: 1rem;
}
.not-logged {
  color: #888;
  font-size: 1.1rem;
  margin-top: 24px;
}
.logout-btn {
  margin-top: 18px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: #ff7875;
}
.admin-msg {
  margin-top: 18px;
  color: #1ab3a6;
  font-weight: bold;
  font-size: 1.05rem;
}
</style> 