<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/data'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const authStore = useAuthStore()
const dataStore = useDataStore()

onMounted(() => {
  authStore.initializeAuth()
  dataStore.initializeData()
})
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <AppHeader />
    <main class="flex-grow-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 确保模态框能正常显示 */
.modal-backdrop {
  z-index: 1040;
}

.modal {
  z-index: 1050;
}
</style>
