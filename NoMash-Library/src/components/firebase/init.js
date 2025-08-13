// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore"

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
initializeApp(firebaseConfig);
const db = getFirestore();
export default db