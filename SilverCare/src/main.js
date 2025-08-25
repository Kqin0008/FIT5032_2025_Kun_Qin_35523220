import './assets/main.css'

// Import Firebase configuration and services
import './firebase.js'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
// PrimeVue 4.x uses CSS-in-JS through @primeuix/styled
// No need to import primevue.min.css directly

// Configure PrimeVue theme
const primevueConfig = {
  theme: {
    preset: 'lara',
    options: {
      darkMode: false,
      colorScheme: 'light',
      cssLayer: false
    }
  }
};
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Paginator from 'primevue/paginator';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { initializeAuth } from './auth.js';

// Initialize Firebase auth
export const app = createApp(App);

// Use PrimeVue with configuration
app.use(PrimeVue, primevueConfig);

// Register PrimeVue components globally
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('Paginator', Paginator);
app.component('InputText', InputText);
app.component('Button', Button);

// Use router
app.use(router);

// Initialize auth before mounting the app
initializeAuth();

// Import accessibility plugin
import { setupAccessibility } from './plugins/accessibility.js';
console.log("VITE_AMAP_API_KEY:", import.meta.env.VITE_AMAP_API_KEY);
console.log("VITE_AMAP_SECURITY_CODE:", import.meta.env.VITE_AMAP_SECURITY_CODE);
// Mount the app
app.mount('#app');

// Setup accessibility after app is mounted
setupAccessibility();
