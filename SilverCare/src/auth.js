import { reactive, onMounted, onUnmounted } from 'vue';
import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Initialize auth state
const authState = reactive({
  isAuthenticated: false,
  user: null, // { name, email, role, uid }
  loading: true
});

// Listen for auth state changes
let unsubscribe;

export function initializeAuth() {
  unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      authState.isAuthenticated = true;
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        authState.user = { ...user, ...userDoc.data() };
      } else {
        // If user document doesn't exist, create a default one
        const defaultUser = {
          name: user.email.split('@')[0],
          role: 'user'
        };
        await setDoc(doc(db, 'users', user.uid), defaultUser);
        authState.user = { ...user, ...defaultUser };
      }
    } else {
      // User is signed out
      authState.isAuthenticated = false;
      authState.user = null;
    }
    authState.loading = false;
  });
}

// Cleanup the listener when component unmounts
export function cleanupAuth() {
  if (unsubscribe) unsubscribe();
}

// Firebase login function
export async function login(email, password) {
  try {
    console.log('Attempting to sign in with email:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Successfully signed in user:', user.uid);

    // Get user data from Firestore
    console.log('Attempting to fetch user document from Firestore');
    const userRef = doc(db, 'users', user.uid);
    console.log('Firestore document reference:', userRef.path);
    
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        console.log('User document found:', userDoc.data());
        authState.user = { ...user, ...userDoc.data() };
      } else {
        console.log('User document does not exist');
        // Create a default user document if it doesn't exist
        const defaultUser = {
          name: user.email.split('@')[0],
          role: 'user'
        };
        await setDoc(userRef, defaultUser);
        console.log('Created default user document:', defaultUser);
        authState.user = { ...user, ...defaultUser };
      }
      return user;
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError.code, firestoreError.message);
      // Handle offline error specifically
      if (firestoreError.code === 'unavailable' || firestoreError.message.includes('offline')) {
        console.log('Handling offline scenario - using authentication data only');
        authState.user = { ...user, name: user.email.split('@')[0], role: 'user' };
        return user;
      }
      throw new Error(`Firestore error: ${firestoreError.message}`);
    }
  } catch (error) {
    console.error('Login error:', error.code, error.message);
    throw new Error(`Login failed: ${error.message}`);
  }
}

// Firebase register function
export async function register(email, password, name, role = 'user') {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Save additional user info to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      role
    });
    authState.user = { ...user, name, role };
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Firebase logout function
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
}

export function hasRole(role) {
  return authState.user && authState.user.role === role;
}

export { authState };