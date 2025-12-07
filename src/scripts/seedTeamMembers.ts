/**
 * Script to seed initial team members to Firebase
 * Run this script to populate your team collection with sample members
 * 
 * Usage: npm run seed-team
 */

import { addTeamMember } from '@/lib/teamService';

const sampleTeamMembers = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Engineering Manager',
    department: 'Engineering',
    skills: ['Leadership', 'Project Management', 'TypeScript', 'React', 'Agile'],
    bio: 'Passionate about building great products and leading high-performing teams. 10+ years of experience in software development.',
    timezone: 'America/New_York (EST)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    socialLinks: {
      github: 'github.com/sarah-j',
      linkedin: 'linkedin.com/in/sarah-johnson',
      twitter: 'twitter.com/sarahcodes',
      portfolio: 'sarahjohnson.dev',
    },
    workload: 0,
    availability: {
      status: 'available' as const,
      timeOff: [],
    },
    achievements: [
      {
        title: 'Welcome Aboard! 🎉',
        description: 'Joined the team',
        icon: '🎊',
        earnedAt: new Date(),
        rarity: 'common' as const,
      },
      {
        title: 'Team Builder 🏗️',
        description: 'Led a team to successful project completion',
        icon: '👥',
        earnedAt: new Date(),
        rarity: 'rare' as const,
      },
    ],
    joinedAt: new Date('2024-01-15'),
    performanceMetrics: {
      tasksCompleted: 47,
      averageRating: 4.8,
      onTimeDelivery: 95,
    },
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'Senior Full-Stack Developer',
    department: 'Engineering',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Database'],
    bio: 'Full-stack developer with expertise in modern web technologies. Love solving complex problems and mentoring junior developers.',
    timezone: 'America/Los_Angeles (PST)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    socialLinks: {
      github: 'github.com/m-chen',
      linkedin: 'linkedin.com/in/michael-chen-dev',
      portfolio: 'michaelchen.io',
    },
    workload: 0,
    availability: {
      status: 'available' as const,
      timeOff: [],
    },
    achievements: [
      {
        title: 'Welcome Aboard! 🎉',
        description: 'Joined the team',
        icon: '🎊',
        earnedAt: new Date(),
        rarity: 'common' as const,
      },
      {
        title: 'Code Master 💻',
        description: 'Completed 50+ tasks with excellence',
        icon: '⭐',
        earnedAt: new Date(),
        rarity: 'epic' as const,
      },
    ],
    joinedAt: new Date('2023-08-20'),
    performanceMetrics: {
      tasksCompleted: 62,
      averageRating: 4.9,
      onTimeDelivery: 98,
    },
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'Lead UI/UX Designer',
    department: 'Design',
    skills: ['UI/UX', 'Figma', 'User Research', 'Prototyping', 'Design Systems'],
    bio: 'Creating delightful user experiences through thoughtful design. Advocate for accessibility and inclusive design.',
    timezone: 'America/Chicago (CST)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    socialLinks: {
      linkedin: 'linkedin.com/in/emily-rodriguez-design',
      twitter: 'twitter.com/emilydesigns',
      portfolio: 'emilyrodriguez.design',
    },
    workload: 0,
    availability: {
      status: 'busy' as const,
      timeOff: [],
    },
    achievements: [
      {
        title: 'Welcome Aboard! 🎉',
        description: 'Joined the team',
        icon: '🎊',
        earnedAt: new Date(),
        rarity: 'common' as const,
      },
      {
        title: 'Design Wizard 🎨',
        description: 'Created stunning designs loved by users',
        icon: '🌟',
        earnedAt: new Date(),
        rarity: 'epic' as const,
      },
    ],
    joinedAt: new Date('2023-11-10'),
    performanceMetrics: {
      tasksCompleted: 38,
      averageRating: 4.7,
      onTimeDelivery: 92,
    },
  },
  {
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'DevOps Engineer',
    department: 'Engineering',
    skills: ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    bio: 'Infrastructure enthusiast dedicated to automating all the things. Passionate about cloud architecture and reliability.',
    timezone: 'Asia/Seoul (KST)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    socialLinks: {
      github: 'github.com/davidkim-devops',
      linkedin: 'linkedin.com/in/david-kim-devops',
      twitter: 'twitter.com/davidops',
    },
    workload: 0,
    availability: {
      status: 'available' as const,
      timeOff: [],
    },
    achievements: [
      {
        title: 'Welcome Aboard! 🎉',
        description: 'Joined the team',
        icon: '🎊',
        earnedAt: new Date(),
        rarity: 'common' as const,
      },
      {
        title: 'Infrastructure Hero 🚀',
        description: 'Achieved 99.9% uptime',
        icon: '🛡️',
        earnedAt: new Date(),
        rarity: 'legendary' as const,
      },
    ],
    joinedAt: new Date('2024-03-01'),
    performanceMetrics: {
      tasksCompleted: 29,
      averageRating: 4.9,
      onTimeDelivery: 97,
    },
  },
  {
    name: 'Jessica Martinez',
    email: 'jessica.martinez@company.com',
    role: 'Product Manager',
    department: 'Product',
    skills: ['Product Management', 'Agile', 'User Research', 'Data Analysis', 'Communication'],
    bio: 'Product manager focused on delivering value to users. Data-driven decision maker with a passion for innovation.',
    timezone: 'Europe/London (GMT)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    socialLinks: {
      linkedin: 'linkedin.com/in/jessica-martinez-pm',
      twitter: 'twitter.com/jessicapm',
    },
    workload: 0,
    availability: {
      status: 'available' as const,
      timeOff: [],
    },
    achievements: [
      {
        title: 'Welcome Aboard! 🎉',
        description: 'Joined the team',
        icon: '🎊',
        earnedAt: new Date(),
        rarity: 'common' as const,
      },
      {
        title: 'Product Visionary 🔮',
        description: 'Successfully launched major features',
        icon: '🎯',
        earnedAt: new Date(),
        rarity: 'rare' as const,
      },
    ],
    joinedAt: new Date('2023-09-15'),
    performanceMetrics: {
      tasksCompleted: 41,
      averageRating: 4.6,
      onTimeDelivery: 89,
    },
  },
  {
    name: 'Alex Thompson',
    email: 'alex.thompson@company.com',
    role: 'Backend Developer',
    department: 'Engineering',
    skills: ['Python', 'Node.js', 'API Design', 'Database', 'Testing'],
    bio: 'Backend engineer who loves building scalable APIs and optimizing database performance.',
    timezone: 'America/New_York (EST)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    socialLinks: {
      github: 'github.com/alexthompson',
      linkedin: 'linkedin.com/in/alex-thompson-dev',
    },
    workload: 0,
    availability: {
      status: 'away' as const,
      timeOff: [
        {
          start: new Date('2025-12-20'),
          end: new Date('2025-12-27'),
          reason: 'Holiday Break',
        },
      ],
    },
    achievements: [
      {
        title: 'Welcome Aboard! 🎉',
        description: 'Joined the team',
        icon: '🎊',
        earnedAt: new Date(),
        rarity: 'common' as const,
      },
    ],
    joinedAt: new Date('2024-06-01'),
    performanceMetrics: {
      tasksCompleted: 25,
      averageRating: 4.5,
      onTimeDelivery: 88,
    },
  },
];

async function seedTeamMembers() {
  console.log('🌱 Starting to seed team members...\n');

  for (const member of sampleTeamMembers) {
    try {
      const id = await addTeamMember(member);
      console.log(`✅ Added ${member.name} (${member.role}) - ID: ${id}`);
    } catch (error) {
      console.error(`❌ Error adding ${member.name}:`, error);
    }
  }

  console.log('\n🎉 Team seeding complete!');
  console.log(`📊 Total members added: ${sampleTeamMembers.length}`);
}

// Run the seeding function
seedTeamMembers().catch(console.error);
