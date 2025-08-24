<template>
  <div class="map-view">
    <h1>SilverCare Map</h1>
    <MapComponent title="Senior Services Locations" />
  </div>
</template>

<script setup>
import MapComponent from '../components/MapComponent.vue';
import { onMounted } from 'vue';
import { authState } from '../auth.js';
import { useRouter } from 'vue-router';

const router = useRouter();

// Check if user is authenticated
onMounted(() => {
  if (!authState.isAuthenticated) {
    router.push('/login');
  }
});
</script>

<style scoped>
.map-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>