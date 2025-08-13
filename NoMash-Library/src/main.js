import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVT6P_JEYdGlKvsRxiq8eH5svBtU4fXbc",
  authDomain: "fit5032-b9a56.firebaseapp.com",
  projectId: "fit5032-b9a56",
  storageBucket: "fit5032-b9a56.firebasestorage.app",
  messagingSenderId: "298738899424",
  appId: "1:298738899424:web:de1522eec40a369f5e7385"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// 创建并配置 Vue 应用
const vueApp = createApp(App)
vueApp.use(PrimeVue, { theme: { preset: Aura } })
vueApp.use(router)

// 挂载 Vue 应用
vueApp.mount('#app')