import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_SjwYbyr-gnmKHyCEqHP28mNH18R0OJk",
  authDomain: "lab-biomed.firebaseapp.com",
  projectId: "lab-biomed",
  storageBucket: "lab-biomed.firebasestorage.app",
  messagingSenderId: "470579549138",
  appId: "1:470579549138:web:280fd6655de16373296e0b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialize Storage
const storage = getStorage(app);

export { auth, storage };
export default app;
