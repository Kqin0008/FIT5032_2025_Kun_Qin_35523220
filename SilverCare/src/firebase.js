// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// For production builds, we might need to handle environment variables differently
// In SSR or server environments, we can access non-VITE prefixed variables
// But in client-side builds, only VITE_ prefixed variables are available
const isProductionBuild = import.meta.env.PROD || false;
console.log('Firebase config check - isProductionBuild:', isProductionBuild);
console.log('Firebase config:', {
  apiKey: firebaseConfig.apiKey ? '***' : 'MISSING',
  authDomain: firebaseConfig.authDomain ? '***' : 'MISSING',
  projectId: firebaseConfig.projectId ? '***' : 'MISSING'
});

// Initialize Firebase only if configuration is complete
let app;
let auth;
let db;
let functions;

if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
  app = initializeApp(firebaseConfig);
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
  // Initialize Cloud Functions
  functions = getFunctions(app);
  
  // For production builds, explicitly set the functions region if needed
  if (import.meta.env.PROD) {
    console.log('Setting functions region to us-central1 for production');
    // functions = getFunctions(app, 'us-central1'); // Uncomment if you need a specific region
  }
} else {
  console.warn('Firebase is not properly configured. Check your environment variables.');
}

// Export the services
export { auth, db, functions };