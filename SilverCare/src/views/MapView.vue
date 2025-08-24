<template>
  <div class="map-view">
    <h1>SilverCare Map</h1>
    <MapComponent title="Senior Services Locations" />
  </div>
</template>

<script setup>
import MapComponent from '../components/MapComponent.vue';
</script>

<style scoped>
.map-view {
  padding: 20px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: block;
}
</style>