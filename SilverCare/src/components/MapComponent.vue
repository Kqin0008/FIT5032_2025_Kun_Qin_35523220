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
        <div class="input-group">
          <label>Mode:</label>
          <select v-model="routeMode" class="route-mode-select">
            <option value="driving">Driving</option>
            <option value="walking">Walking</option>
          </select>
        </div>
        <Button @click="calculateRoute" label="Get Route" class="route-btn" />
      </div>
    </div>

    <div id="map" class="map" style="height: 500px; width: 100%"></div>

    <div v-if="places.length > 0" class="search-results">
      <h3>Search Results</h3>
      <ul>
        <li v-for="place in places" :key="place.id" @click="selectPlace(place)">
          {{ place.name }}
          <span class="location">{{ place.address }}</span>
        </li>
      </ul>
    </div>

    <div id="infoWindow" class="info-window" v-if="selectedCoordinates">
      <p>Selected Coordinates: {{ selectedCoordinates }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import CryptoJS from 'crypto-js';

// 生成SCODE
function generateSCODE(params) {
  // 将参数按键名排序并拼接
  const sortedKeys = Object.keys(params).sort();
  let paramStr = '';
  sortedKeys.forEach(key => {
    paramStr += `${key}=${params[key]}&`;
  });
  
  // 添加安全密钥
  paramStr += import.meta.env.VITE_AMAP_SECURITY_CODE;
  
  // 生成MD5哈希
  const hash = CryptoJS.MD5(paramStr);
  return hash.toString();
}



// Map state
const map = ref(null);
const searchQuery = ref('');
const places = ref([]);
const startLocation = ref('');
const endLocation = ref('');
const routeMode = ref('driving'); // 默认驾车模式
const markers = ref([]);
const routeLines = ref([]);
const amapLoaded = ref(false);
const selectedCoordinates = ref(null);

// 加载高德地图API
function loadAmapScript() {
  return new Promise((resolve) => {
    if (window.AMap) {
      amapLoaded.value = true;
      resolve(window.AMap);
      return;
    }

    // 配置安全密钥，必须在加载地图API之前设置
    window._AMapSecurityConfig = {
      securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE
    };

    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${import.meta.env.VITE_AMAP_API_KEY}&callback=onAmapLoaded`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.onAmapLoaded = () => {
      amapLoaded.value = true;
      resolve(window.AMap);
    };

    script.onerror = () => {
      console.error('Failed to load AMap script');
      resolve(null);
    };
  });
}

// Initialize map when component mounts
onMounted(async () => {
  try {
    // Load AMap script
    const AMap = await loadAmapScript();
    
    if (!AMap) {
      console.error('Failed to load AMap');
      return;
    }
    
    // Initialize map
    map.value = new AMap.Map('map', {
      zoom: 12,
      center: [116.397428, 39.90923], // 默认北京位置
      mapStyle: 'amap://styles/normal'
    });
    
    // Load plugins asynchronously
    await new Promise((resolve) => {
      AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {
        // Add map controls
        map.value.addControl(new AMap.Scale());
        map.value.addControl(new AMap.ToolBar());
        resolve();
      });
    });
    
    // Add click event to get coordinates
    map.value.on('click', function(e) {
      console.log('Clicked coordinates:', e.lnglat);
      selectedCoordinates.value = `${e.lnglat.lng.toFixed(6)}, ${e.lnglat.lat.toFixed(6)}`;
      // You can add a marker at the clicked location or show an info window
    });
  } catch (error) {
    console.error('Failed to initialize map:', error);
  }
});

// Cleanup when component unmounts
onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});

// Search for a place
async function searchPlace() {
  console.log('Search function called with query:', searchQuery.value);
  console.log('AMap loaded:', amapLoaded.value);
  
  if (!searchQuery.value.trim() || !amapLoaded.value) {
    console.log('Search query is empty or AMap not loaded');
    places.value = [];
    return;
  }

  try {
    // Load PlaceSearch plugin
    await new Promise((resolve) => {
      window.AMap.plugin('AMap.PlaceSearch', () => {
        resolve();
      });
    });

    // 准备搜索参数
    const searchParams = {
      keywords: searchQuery.value,
      city: '全国',
      citylimit: false,
      output: 'json',
      page_size: 10,
      page_num: 1,
      extensions: 'all',
      key: import.meta.env.VITE_AMAP_API_KEY
    };

    // 生成SCODE
    const scode = generateSCODE(searchParams);
    
    // 添加SCODE到搜索参数
    searchParams.scode = scode;

    // Use AMap place search service with SCODE
    const placeSearch = new window.AMap.PlaceSearch({
      pageSize: 10, // 搜索结果数量
      pageIndex: 1,
      city: '全国', // 搜索范围
      map: map.value, // 展示marker的地图对象
      panel: null, // 不显示搜索结果面板
      extensions: 'all' // 返回详细信息
    });

    // Perform place search with SCODE
    // 将SCODE作为搜索参数的一部分传递
    const searchOptions = {
      city: '全国',
      scode: scode
    };
    
    const result = await new Promise((resolve, reject) => {
      console.log('Performing search with query:', searchQuery.value, 'and scode:', scode);
      placeSearch.search(searchQuery.value, searchOptions, (status, result) => {
        console.log('Search callback received with status:', status, 'and result:', result);
        if (status === 'complete' && result.info === 'OK') {
          console.log('Search completed successfully');
          resolve(result);
        } else {
          console.error('Search failed with status:', status, 'and result:', result);
          reject(new Error(`Search failed: ${status} - ${result && result.info ? result.info : 'Unknown error'}`));
        }
      });
    });

    // Process search results
    console.log('Processing search results:', result);
    if (result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
      console.log('Found', result.poiList.pois.length, 'places');
      places.value = result.poiList.pois.map((poi, index) => ({
        id: poi.id || index,
        name: poi.name,
        address: poi.address || poi.district || '',
        lat: poi.location ? poi.location.lat : 0,
        lng: poi.location ? poi.location.lng : 0
      }));
    } else {
      console.log('No places found');
      places.value = [];
    }
  } catch (error) {
    console.error('Error searching for places:', error);
    places.value = [];
  }
}

// Select a place from search results
function selectPlace(place) {
  // Clear existing markers
  markers.value.forEach(marker => marker.remove());
  markers.value = [];

  // Add new marker
  const marker = new window.AMap.Marker({
    position: [place.lng, place.lat],
    title: place.name
  });
  
  // Add marker to map
  map.value.add(marker);
  markers.value.push(marker);

  // Center map on selected place
  map.value.setCenter([place.lng, place.lat]);
  map.value.setZoom(15);

  // Add info window
  const infoWindow = new window.AMap.InfoWindow({
    content: `<div><strong>${place.name}</strong><br>${place.address}</div>`
  });
  infoWindow.open(map.value, [place.lng, place.lat]);

  // Clear search results
  places.value = [];
  searchQuery.value = '';
}

// Calculate route between two points
async function calculateRoute() {
  if (!startLocation.value.trim() || !endLocation.value.trim() || !amapLoaded.value) {
    return;
  }

  try {
    // Clear existing markers and route lines
    markers.value.forEach(marker => marker.remove());
    markers.value = [];
    routeLines.value.forEach(line => line.remove());
    routeLines.value = [];

    // 根据选择的模式加载相应的插件
    if (routeMode.value === 'walking') {
      // Load Walking plugin
      await new Promise((resolve) => {
        window.AMap.plugin('AMap.Walking', () => {
          resolve();
        });
      });

      // 准备步行路线规划参数
      const routeParams = {
        origin: startLocation.value,
        destination: endLocation.value,
        output: 'json',
        key: import.meta.env.VITE_AMAP_API_KEY
      };

      // 生成SCODE
      const scode = generateSCODE(routeParams);
      
      // 添加SCODE到路线规划参数
      routeParams.scode = scode;

      // Use AMap walking service with SCODE
      const walking = new window.AMap.Walking({
        map: map.value,
        panel: null // 不显示路线面板
      });

      // Search for route with SCODE
      // 将SCODE作为搜索参数的一部分传递
      const walkingOptions = {
        scode: scode
      };
      
      walking.search([
        { keyword: startLocation.value },
        { keyword: endLocation.value }
      ], walkingOptions, (status, result) => {
        if (status === 'complete' && result.routes && result.routes.length > 0) {
          // Route calculated successfully
          console.log('Walking route calculated successfully');
          // The route is automatically drawn on the map by AMap.Walking
        } else {
          console.error('Failed to calculate walking route with status:', status, 'and result:', result);
          // Show error message to user
          if (result && result.info) {
            console.error('Route calculation error info:', result.info);
          }
        }
      });
    } else {
      // Load Driving plugin
      await new Promise((resolve) => {
        window.AMap.plugin('AMap.Driving', () => {
          resolve();
        });
      });

      // 准备驾车路线规划参数
      const routeParams = {
        origin: startLocation.value,
        destination: endLocation.value,
        output: 'json',
        key: import.meta.env.VITE_AMAP_API_KEY
      };

      // 生成SCODE
      const scode = generateSCODE(routeParams);
      
      // 添加SCODE到路线规划参数
      routeParams.scode = scode;

      // Use AMap driving service with SCODE
      const driving = new window.AMap.Driving({
        map: map.value,
        panel: null // 不显示路线面板
      });

      // Search for route with SCODE
      // 将SCODE作为搜索参数的一部分传递
      const drivingOptions = {
        scode: scode
      };
      
      driving.search([
        { keyword: startLocation.value },
        { keyword: endLocation.value }
      ], drivingOptions, (status, result) => {
        if (status === 'complete' && result.routes && result.routes.length > 0) {
          // Route calculated successfully
          console.log('Driving route calculated successfully');
          // The route is automatically drawn on the map by AMap.Driving
        } else {
          console.error('Failed to calculate driving route with status:', status, 'and result:', result);
          // Show error message to user
          if (result && result.info) {
            console.error('Route calculation error info:', result.info);
          }
        }
      });
    }
  } catch (error) {
    console.error('Error calculating route:', error);
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  max-width: 1440px;
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
  width: 100%;
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

.route-mode-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
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

.info-window {
  margin-top: 10px;
  padding: 10px;
  background-color: #f0f8ff;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>