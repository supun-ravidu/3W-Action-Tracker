/**
 * Debug script to check project requests in Firestore
 * Run: npx ts-node src/scripts/debugProjectRequests.ts
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAzR-ZyrupAhkUCXm4KYHHMpHzZ9yWyTqY",
  authDomain: "plan-tracker-4ead0.firebaseapp.com",
  projectId: "plan-tracker-4ead0",
  storageBucket: "plan-tracker-4ead0.firebasestorage.app",
  messagingSenderId: "577825988815",
  appId: "1:577825988815:web:19d7f37c0b61cf02b4f988"
};

// Initialize Firebase
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

async function debugProjectRequests() {
  console.log('🔍 Checking projectRequests collection...\n');

  try {
    // Get all documents
    const allDocs = await getDocs(collection(db, 'projectRequests'));
    console.log(`📊 Total documents in projectRequests: ${allDocs.size}\n`);

    if (allDocs.empty) {
      console.log('⚠️  Collection is empty! Run: npm run seed:projects');
      process.exit(0);
    }

    // Check each document
    allDocs.forEach((doc) => {
      const data = doc.data();
      console.log(`\n📄 Document ID: ${doc.id}`);
      console.log(`   Name: ${data.name}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Icon: ${data.icon}`);
      console.log(`   Requested By: ${data.requestedBy?.name || 'Unknown'}`);
      console.log(`   Budget: $${data.budget?.allocated?.toLocaleString() || 'N/A'}`);
      console.log(`   Tags: ${data.tags?.join(', ') || 'None'}`);
    });

    // Query for pending only
    console.log('\n' + '='.repeat(50));
    const pendingQuery = query(
      collection(db, 'projectRequests'),
      where('status', '==', 'pending')
    );
    const pendingDocs = await getDocs(pendingQuery);
    console.log(`\n✅ Pending requests (status === 'pending'): ${pendingDocs.size}`);

    if (pendingDocs.empty) {
      console.log('\n⚠️  No pending requests found!');
      console.log('   This means all requests might have been approved/rejected.');
      console.log('   Run: npm run seed:projects (to add new ones)');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }

  process.exit(0);
}

debugProjectRequests();
