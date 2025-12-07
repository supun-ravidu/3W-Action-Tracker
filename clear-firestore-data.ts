/**
 * Clear Firestore Data Script
 * WARNING: This will delete ALL data from specified collections
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqVv_lZ8r1hgPCn2q6_ywBFtgKwQdVMGM",
  authDomain: "action-plan-3w-tracker.firebaseapp.com",
  projectId: "action-plan-3w-tracker",
  storageBucket: "action-plan-3w-tracker.firebasestorage.app",
  messagingSenderId: "402559410786",
  appId: "1:402559410786:web:1bbff32a262f40445fe73b",
  measurementId: "G-EX8CE6VRBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collections to clear
const COLLECTIONS = [
  'actionPlans',
  'teamMembers',
  'projects',
  'projectRequests',
  'teamMemberRequests',
  'workspaces'
];

async function clearCollection(collectionName: string) {
  console.log(`\n🗑️  Clearing collection: ${collectionName}`);
  
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const deletePromises: Promise<void>[] = [];
    
    querySnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, collectionName, document.id)));
    });
    
    await Promise.all(deletePromises);
    console.log(`✅ Deleted ${querySnapshot.size} documents from ${collectionName}`);
    
    return querySnapshot.size;
  } catch (error) {
    console.error(`❌ Error clearing ${collectionName}:`, error);
    return 0;
  }
}

async function clearAllData() {
  console.log('🔥 Firebase Firestore Data Clearing Script');
  console.log('⚠️  WARNING: This will delete ALL data from your Firestore database!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  let totalDeleted = 0;
  
  for (const collectionName of COLLECTIONS) {
    const deleted = await clearCollection(collectionName);
    totalDeleted += deleted;
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✨ COMPLETE! Deleted ${totalDeleted} total documents`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  process.exit(0);
}

// Run the script
clearAllData().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
