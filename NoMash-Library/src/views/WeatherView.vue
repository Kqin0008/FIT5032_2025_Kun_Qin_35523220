<template>
  <div class="container">
    <div class="header">
      <h1>WEATHER APP</h1>
      <div class="search-bar">
        <input
          v-model="city"
          type="text"
          placeholder="Enter city name"
          class="search-input"
          @keyup.enter="searchByCity"
        />
        <button @click="searchByCity" class="search-button">Search</button>
      </div>
    </div>

    
    <main v-if="weatherData" class="weather-result">
      <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
      <div class="weather-info">
        <img :src="iconUrl" alt="Weather Icon" />
        <p class="temp">{{ temperature }} °C</p>
      </div>
      <span class="desc">{{ weatherData.weather[0].description }}</span>
    </main>
  </div>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const apiKey = '758a333d0c58d37994cb362e9532b2eb'

const city        = ref('')
const weatherData = ref(null)


const temperature = computed(() =>
  weatherData.value ? Math.round(weatherData.value.main.temp) : null
)

const iconUrl = computed(() =>
  weatherData.value
    ? `https://openweathermap.org/img/wn/${weatherData.value.weather[0].icon}@2x.png`
    : null
)

async function fetchByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  await fetchWeather(url)
}

async function searchByCity() {
  if (!city.value.trim()) return
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city.value.trim()
  )}&units=metric&appid=${apiKey}`
  await fetchWeather(url)
}

async function fetchWeather(url) {
  try {
    const { data } = await axios.get(url)
    weatherData.value = data
  } catch (err) {
    alert('City not found or network error')
    console.error(err)
  }
}


onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => {
      
      }
    )
  }
})
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 40px auto;
  text-align: center;
  font-family: Arial, sans-serif;
}
.search-input {
  padding: 8px 12px;
  width: 220px;
  margin-right: 8px;
}
.search-button {
  padding: 8px 16px;
}
.weather-result {
  margin-top: 30px;
}
.weather-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.temp {
  font-size: 2rem;
  font-weight: bold;
}
.desc {
  text-transform: capitalize;
}
</style>