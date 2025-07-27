<template>
  <footer class="bg-light text-center text-muted py-4 mt-5" v-if="showFooter">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 mx-auto">
          <div class="d-flex justify-content-center align-items-center mb-3">
            <i class="bi bi-heart-pulse-fill text-primary me-2 fs-4"></i>
            <span class="fw-bold text-primary fs-4">SilverCare</span>
          </div>
          <p class="mb-2">关爱老年人健康，连接社区资源</p>
          <small>© 2024 SilverCare. 专为老年人设计的健康关怀平台。</small>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const showFooter = computed(() => 
  route.name !== 'login' && route.name !== 'register'
)
</script>

<style scoped>
footer {
  margin-top: auto;
}
</style>