<template>
  <div class="map-container">
    <h2>{{ title }}</h2>
    <div class="search-container">
      <InputText
        v-model="searchQuery"
        placeholder="Search for a place..."
        class="search-input"
      />
      <Button @click="searchPlace" label="Search" class="search-btn" />
    </div>

    <div class="route-planner">
      <h3>Route Planner</h3>
      <div class="route-inputs">
        <div class="input-group">
          <label>From:</label>
          <InputText v-model="startLocation" placeholder="Enter start location" />
        </div>
        <div class="input-group">
          <label>To:</label>
          <InputText v-model="endLocation" placeholder="Enter destination" />
        </div>
        <Button @click="calculateRoute" label="Get Route" class="route-btn" />
      </div>
    </div>

    <div class="map" style="height: 500px; width: 100%"></div>

    <div v-if="places.length > 0" class="search-results">
      <h3>Search Results</h3>
      <ul>
        <li v-for="place in places" :key="place.id" @click="selectPlace(place)">
          {{ place.name }}
          <span class="location">{{ place.address }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  title: {
    type: String,
    default: 'Map'
  }
});

// Map state
const map = ref(null);
const searchQuery = ref('');
const places = ref([]);
const startLocation = ref('');
const endLocation = ref('');
const markers = ref([]);
const routeLines = ref([]);

// Initialize map when component mounts
onMounted(() => {
  // Create map instance
  map.value = L.map('map').setView([40.7128, -74.0060], 12); // Default to New York

  // Add tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value);
});

// Cleanup when component unmounts
onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});

// Search for a place
async function searchPlace() {
  if (!searchQuery.value.trim()) {
    places.value = [];
    return;
  }

  try {
    // In a real application, you would use a geocoding API here
    // This is a placeholder that simulates search results
    const mockResults = [
      {
        id: 1,
        name: 'Central Park',
        address: 'New York, NY',
        lat: 40.785091,
        lng: -73.968285
      },
      {
        id: 2,
        name: 'Empire State Building',
        address: 'New York, NY',
        lat: 40.7484405,
        lng: -73.9856643
      },
      {
        id: 3,
        name: 'Statue of Liberty',
        address: 'New York, NY',
        lat: 40.689247,
        lng: -74.044502
      }
    ];

    // Filter results based on search query
    places.value = mockResults.filter(place =>
      place.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching for places:', error);
  }
}

// Select a place from search results
function selectPlace(place) {
  // Clear existing markers
  markers.value.forEach(marker => marker.remove());
  markers.value = [];

  // Add new marker
  const marker = L.marker([place.lat, place.lng]).addTo(map.value);
  marker.bindPopup(`<b>${place.name}</b><br>${place.address}`).openPopup();
  markers.value.push(marker);

  // Center map on selected place
  map.value.setView([place.lat, place.lng], 15);

  // Clear search results
  places.value = [];
  searchQuery.value = '';
}

// Calculate route between two points
async function calculateRoute() {
  if (!startLocation.value.trim() || !endLocation.value.trim()) {
    return;
  }

  try {
    // Clear existing route lines
    routeLines.value.forEach(line => line.remove());
    routeLines.value = [];

    // In a real application, you would use a routing API here
    // This is a placeholder that simulates a route between two points
    // For demonstration, we'll use fixed coordinates
    const startCoords = [40.7128, -74.0060]; // New York
    const endCoords = [34.0522, -118.2437]; // Los Angeles

    // Add markers for start and end points
    const startMarker = L.marker(startCoords).addTo(map.value);
    startMarker.bindPopup(`<b>Start</b><br>${startLocation.value}`).openPopup();
    markers.value.push(startMarker);

    const endMarker = L.marker(endCoords).addTo(map.value);
    endMarker.bindPopup(`<b>End</b><br>${endLocation.value}`);
    markers.value.push(endMarker);

    // Simulate a route path with some points
    const routePoints = [
      startCoords,
      [39.9526, -75.1652], // Philadelphia
      [38.9072, -77.0369], // Washington D.C.
      [33.7490, -84.3880], // Atlanta
      [29.7604, -95.3698], // Houston
      [32.7767, -96.7970], // Dallas
      [36.1699, -115.1398], // Las Vegas
      endCoords
    ];

    // Create polyline for the route
    const routeLine = L.polyline(routePoints, {
      color: 'blue',
      weight: 3,
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(map.value);
    routeLines.value.push(routeLine);

    // Adjust map view to show the entire route
    map.value.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
  } catch (error) {
    console.error('Error calculating route:', error);
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-container {
  display: flex;
  margin-bottom: 20px;
}

.search-input {
  flex-grow: 1;
  margin-right: 10px;
}

.search-btn {
  white-space: nowrap;
}

.route-planner {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.route-inputs {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.input-group {
  flex-grow: 1;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.route-btn {
  align-self: flex-end;
  white-space: nowrap;
}

.search-results {
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.search-results ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.search-results li {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.search-results li:hover {
  background-color: #f9f9f9;
}

.location {
  display: block;
  font-size: 12px;
  color: #666;
}
</style>