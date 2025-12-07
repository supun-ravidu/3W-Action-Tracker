// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { Firestore, initializeFirestore, memoryLocalCache, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqVv_lZ8r1hgPCn2q6_ywBFtgKwQdVMGM",
  authDomain: "action-plan-3w-tracker.firebaseapp.com",
  projectId: "action-plan-3w-tracker",
  storageBucket: "action-plan-3w-tracker.firebasestorage.app",
  messagingSenderId: "402559410786",
  appId: "1:402559410786:web:1bbff32a262f40445fe73b",
  measurementId: "G-EX8CE6VRBH"
};

// Singleton pattern to ensure Firestore is only initialized once with memory cache
let cachedApp: FirebaseApp | null = null;
let cachedDb: Firestore | null = null;

function initializeFirebaseApp(): FirebaseApp {
  if (cachedApp) return cachedApp;
  
  const apps = getApps();
  if (apps.length > 0) {
    cachedApp = apps[0];
    return cachedApp;
  }
  
  cachedApp = initializeApp(firebaseConfig);
  return cachedApp;
}

function initializeFirestoreDb(app: FirebaseApp): Firestore {
  if (cachedDb) return cachedDb;
  
  // CRITICAL: Use persistent cache with aggressive settings to minimize reads
  try {
    cachedDb = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      }),
      experimentalForceLongPolling: true // Forces long polling to reduce connections
    });
  } catch (error) {
    // Fallback to memory cache if persistent cache fails
    console.warn('Persistent cache failed, using memory cache:', error);
    cachedDb = initializeFirestore(app, {
      localCache: memoryLocalCache(),
      experimentalForceLongPolling: true
    });
  }
  
  return cachedDb;
}

// Initialize Firebase
const app = initializeFirebaseApp();
export const db = initializeFirestoreDb(app);
export const auth = getAuth(app);

// Initialize Analytics (only on client side)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
