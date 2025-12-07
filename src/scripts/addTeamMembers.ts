/**
 * Script to add team members to Firebase
 * Run this script once to populate your Firebase with team members
 * 
 * Usage:
 * 1. Update the teamMembersToAdd array with your team members
 * 2. Run: npx ts-node src/scripts/addTeamMembers.ts
 */

import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const teamMembersToAdd = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'Senior Developer',
    skills: ['Frontend', 'React', 'TypeScript', 'UI/UX'],
    workload: 0,
    availability: {
      status: 'available',
      timeOff: [],
    },
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    role: 'Project Manager',
    skills: ['Leadership', 'Communication', 'Planning', 'Agile'],
    workload: 0,
    availability: {
      status: 'available',
      timeOff: [],
    },
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    role: 'Backend Developer',
    skills: ['Backend', 'Node.js', 'Database', 'API Design'],
    workload: 0,
    availability: {
      status: 'available',
      timeOff: [],
    },
  },
];

async function addTeamMembers() {
  console.log('Adding team members to Firebase...');
  
  try {
    for (const member of teamMembersToAdd) {
      const docRef = await addDoc(collection(db, 'teamMembers'), member);
      console.log(`✅ Added ${member.name} with ID: ${docRef.id}`);
    }
    
    console.log('\n✨ All team members added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding team members:', error);
    process.exit(1);
  }
}

addTeamMembers();
