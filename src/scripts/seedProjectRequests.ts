/**
 * Seed Project Requests to Firebase
 * Run: npx ts-node src/scripts/seedProjectRequests.ts
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { submitProjectRequest } from '../lib/projectRequestService';

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

const projectRequests = [
  {
    name: "AI-Powered Analytics Platform",
    description: "Build a comprehensive analytics dashboard using machine learning to predict customer behavior and automate reporting workflows.",
    icon: "🤖",
    color: "#3B82F6",
    workspace: "analytics-hub",
    startDate: new Date('2025-01-15'),
    targetEndDate: new Date('2025-06-30'),
    budget: {
      allocated: 250000,
      spent: 0,
      currency: 'USD'
    },
    tags: ["AI", "Analytics", "Machine Learning", "Dashboard"],
    requestedBy: {
      id: "user_001",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com"
    }
  },
  {
    name: "Mobile Shopping Experience",
    description: "Redesign and rebuild our mobile e-commerce application with AR features for virtual product try-ons and seamless checkout.",
    icon: "🛍️",
    color: "#EC4899",
    workspace: "mobile-commerce",
    startDate: new Date('2025-02-01'),
    targetEndDate: new Date('2025-08-15'),
    budget: {
      allocated: 180000,
      spent: 0,
      currency: 'USD'
    },
    tags: ["Mobile", "E-commerce", "AR", "UX Design"],
    requestedBy: {
      id: "user_002",
      name: "Michael Chen",
      email: "michael.chen@company.com"
    }
  },
  {
    name: "Cloud Migration Initiative",
    description: "Migrate legacy infrastructure to AWS cloud with zero downtime. Implement CI/CD pipelines and infrastructure as code.",
    icon: "☁️",
    color: "#8B5CF6",
    workspace: "cloud-ops",
    startDate: new Date('2025-01-20'),
    targetEndDate: new Date('2025-12-31'),
    budget: {
      allocated: 450000,
      spent: 0,
      currency: 'USD'
    },
    tags: ["Cloud", "AWS", "DevOps", "Infrastructure"],
    requestedBy: {
      id: "user_003",
      name: "David Park",
      email: "david.park@company.com"
    }
  },
  {
    name: "Customer Support Chatbot",
    description: "Develop an intelligent chatbot using GPT-4 to handle tier-1 customer support queries and integrate with our CRM system.",
    icon: "💬",
    color: "#10B981",
    workspace: "support-ai",
    startDate: new Date('2025-01-10'),
    targetEndDate: new Date('2025-04-30'),
    budget: {
      allocated: 120000,
      spent: 0,
      currency: 'USD'
    },
    tags: ["AI", "Chatbot", "Customer Support", "GPT-4"],
    requestedBy: {
      id: "user_004",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com"
    }
  },
  {
    name: "Blockchain Supply Chain",
    description: "Implement blockchain technology to track products through our supply chain, ensuring transparency and authenticity.",
    icon: "⛓️",
    color: "#F59E0B",
    workspace: "blockchain-supply",
    startDate: new Date('2025-03-01'),
    targetEndDate: new Date('2025-11-30'),
    budget: {
      allocated: 350000,
      spent: 0,
      currency: 'USD'
    },
    tags: ["Blockchain", "Supply Chain", "Web3", "Security"],
    requestedBy: {
      id: "user_005",
      name: "James Wilson",
      email: "james.wilson@company.com"
    }
  },
  {
    name: "Employee Wellness Portal",
    description: "Create an internal platform for employee wellness programs including mental health resources, fitness tracking, and team challenges.",
    icon: "🧘",
    color: "#06B6D4",
    workspace: "wellness-portal",
    startDate: new Date('2025-02-15'),
    targetEndDate: new Date('2025-07-31'),
    budget: {
      allocated: 95000,
      spent: 0,
      currency: 'USD'
    },
    tags: ["HR", "Wellness", "Internal Tools", "Employee Experience"],
    requestedBy: {
      id: "user_006",
      name: "Lisa Martinez",
      email: "lisa.martinez@company.com"
    }
  },
  {
    name: "Real-Time Collaboration Suite",
    description: "Build a comprehensive collaboration platform with video conferencing, whiteboarding, and document co-editing capabilities.",
    icon: "🚀",
    color: "#EF4444",
    workspace: "collab-suite",
    startDate: new Date('2025-01-25'),
    targetEndDate: new Date('2025-09-30'),
    budget: {
      allocated: 320000,
      spent: 0,
      currency: 'USD'
    },
    tags: ["Collaboration", "Video", "Real-time", "Productivity"],
    requestedBy: {
      id: "user_007",
      name: "Robert Taylor",
      email: "robert.taylor@company.com"
    }
  },
  {
    name: "IoT Smart Office System",
    description: "Deploy IoT sensors and automation throughout office spaces for climate control, occupancy tracking, and energy optimization.",
    icon: "🏢",
    color: "#6366F1",
    workspace: "iot-office",
    startDate: new Date('2025-02-20'),
    targetEndDate: new Date('2025-10-15'),
    budget: {
      allocated: 280000,
      spent: 0,
      currency: 'USD'
    },
    tags: ["IoT", "Smart Building", "Automation", "Energy"],
    requestedBy: {
      id: "user_008",
      name: "Amanda White",
      email: "amanda.white@company.com"
    }
  }
];

async function seedProjectRequests() {
  console.log('🌱 Starting to seed project requests...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const project of projectRequests) {
    try {
      const result = await submitProjectRequest(project);
      
      if (result.success) {
        console.log(`✅ Added: ${project.name}`);
        console.log(`   📧 By: ${project.requestedBy.name}`);
        console.log(`   💰 Budget: $${project.budget.allocated.toLocaleString()}`);
        console.log(`   🏷️  Tags: ${project.tags.join(', ')}\n`);
        successCount++;
      } else {
        console.error(`❌ Failed: ${project.name} - ${result.error}\n`);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error with ${project.name}:`, error);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Seeding Complete!`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📦 Total: ${projectRequests.length}`);
  console.log('='.repeat(50));
  
  process.exit(0);
}

seedProjectRequests();
