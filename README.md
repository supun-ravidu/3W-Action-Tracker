# 🎯 3W Action Plan Tracker

> **A comprehensive, real-time project and team management system with creative animations, Firebase integration, and modern UI/UX**

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6.0-orange?logo=firebase)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Key Functionalities](#-key-functionalities)
- [Firebase Setup](#-firebase-setup)
- [Admin Features](#-admin-features)
- [Team Collaboration](#-team-collaboration)
- [Screenshots](#-screenshots)
- [Configuration](#-configuration)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**3W Action Plan Tracker** is a modern, full-stack web application designed for managing projects, tasks, and team workflows with an emphasis on **real-time collaboration** and **creative user experience**. Built with Next.js 16, React 19, and Firebase, it offers admin controls, project approval workflows, team workload management, and beautiful animations.

### Why 3W Action Tracker?

- ✅ **Real-time synchronization** across all users
- ✅ **Admin approval workflows** for projects and team members
- ✅ **Visual workload distribution** with live analytics
- ✅ **Creative animations** using Framer Motion, GSAP, and React Spring
- ✅ **Firebase-powered** backend with optimized quota management
- ✅ **Fully responsive** design with TailwindCSS 4
- ✅ **TypeScript** for type safety and better DX

---

## ✨ Features

### 🚀 Project Management
- **Create Projects** with emoji icons and color themes
- **3-Step Project Creation Wizard** with live preview
- **Project Approval System** with admin controls
- **Project Templates** for quick setup
- **Workspaces** to organize related projects
- **Budget tracking** and timeline management
- **Real-time project updates** via Firebase

### 👥 Team Collaboration
- **Team Member Management** with roles and departments
- **Workload Distribution** with visual analytics
- **Real-time Task Assignment** across team members
- **Live Sync Notifications** when members are added/removed
- **Team Performance Dashboard** with charts
- **Collaboration Features** including comments and mentions

### 🎨 Creative UI/UX
- **Multi-stage Confetti Celebrations** on approvals
- **Animated Background Effects** (particles, gradients, 3D)
- **Smooth Page Transitions** with Framer Motion
- **Interactive Mascot Animations** using Rive
- **Live Counters** with react-countup
- **Toast Notifications** with Sonner
- **Progress Visualizers** for workflows
- **Rough Annotations** for emphasis

### 🔐 Admin Dashboard
- **Secure Admin Authentication** with Firebase Auth
- **Project Request Approval/Rejection** workflow
- **Team Member Approval System**
- **Live Metrics Dashboard** (pending requests, team size)
- **Real-time Activity Feed**
- **Admin-only Routes** with middleware protection
- **Quota Usage Monitoring**

### 📊 Analytics & Reporting
- **Team Workload Reports** with visual charts (Recharts)
- **Project Timeline Analytics**
- **Budget Utilization Tracking**
- **Performance Metrics** per team member
- **Export Reports** (PDF/CSV)

### 🔥 Firebase Integration
- **Firestore Database** for all data
- **Real-time Listeners** with React Query
- **Optimized Read Operations** (90% quota reduction)
- **Firebase Authentication** for admin access
- **Security Rules** for data protection
- **Offline Support** with caching

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.7 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS 4.x
- **Component Library**: Radix UI (shadcn/ui)
- **Animations**: 
  - Framer Motion 12.x
  - GSAP 3.x
  - React Spring 10.x
  - Rive (Lottie alternative)
- **Icons**: Lucide React, Radix Icons
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts 3.5
- **State Management**: React Query (TanStack)

### Backend
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Vercel (recommended)
- **Storage**: Firebase Storage (if needed)

### Animation & Effects
- **3D Graphics**: Three.js + React Three Fiber
- **Particles**: tsparticles
- **Confetti**: canvas-confetti + react-confetti
- **Sound**: Tone.js
- **Physics**: Matter.js
- **Noise**: Simplex Noise

### Developer Tools
- **Linting**: ESLint 9
- **Package Manager**: npm/yarn/pnpm
- **Build Tool**: Next.js built-in
- **Dev Server**: Next.js dev with Fast Refresh

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher (or yarn/pnpm)
- **Firebase Account** (free tier works)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/supun-ravidu/3W-Action-Tracker.git
   cd 3W-Action-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase** (see [Firebase Setup](#-firebase-setup))

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Test

**Test Project Approval Flow (2 minutes):**
1. Go to [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
2. Login with admin credentials
3. Click "Project Requests" tab
4. Approve a project and watch the confetti! 🎉
5. Open [http://localhost:3000/projects](http://localhost:3000/projects) to see it appear

---

## 📁 Project Structure

```
3W-Action-Tracker/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── admin/                    # Admin dashboard routes
│   │   │   ├── dashboard/            # Main admin dashboard
│   │   │   └── login/                # Admin authentication
│   │   ├── actions/                  # Actions/tasks pages
│   │   ├── projects/                 # Projects management
│   │   ├── team/                     # Team collaboration
│   │   ├── reports/                  # Analytics & reports
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # Radix UI primitives
│   │   ├── admin/                    # Admin-specific components
│   │   │   ├── AdminApprovalPanel.tsx
│   │   │   ├── ApprovalFlowVisualizer.tsx
│   │   │   └── LiveSyncDashboard.tsx
│   │   ├── projects/                 # Project components
│   │   │   ├── CreateProjectModal.tsx
│   │   │   ├── FloatingCreateButton.tsx
│   │   │   └── ProjectCard.tsx
│   │   ├── team/                     # Team components
│   │   │   ├── TeamMemberCard.tsx
│   │   │   ├── WorkloadChart.tsx
│   │   │   └── NewMemberNotification.tsx
│   │   ├── dashboard/                # Dashboard widgets
│   │   ├── actions/                  # Action components
│   │   ├── reports/                  # Report components
│   │   ├── notifications/            # Notification system
│   │   ├── collaboration/            # Collaboration features
│   │   ├── 3d/                       # 3D graphics components
│   │   ├── AnimatedBackground.tsx    # Background effects
│   │   ├── AnimatedMascot.tsx        # Interactive mascot
│   │   ├── CreativeNavBar.tsx        # Navigation
│   │   ├── CreativeFooter.tsx        # Footer
│   │   ├── GSAPAnimations.tsx        # GSAP effects
│   │   ├── SpringAnimations.tsx      # React Spring effects
│   │   └── PhysicsInteractions.tsx   # Matter.js physics
│   │
│   ├── lib/                          # Utility functions
│   │   ├── firebase.ts               # Firebase configuration
│   │   ├── firestoreUtils.ts         # Firestore operations
│   │   ├── teamWorkloadService.ts    # Workload calculations
│   │   ├── projectService.ts         # Project CRUD operations
│   │   ├── adminService.ts           # Admin functions
│   │   └── utils.ts                  # General utilities
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts                # Authentication hook
│   │   ├── useFirestore.ts           # Firestore data hook
│   │   └── useTeamWorkload.ts        # Workload data hook
│   │
│   ├── contexts/                     # React Context providers
│   │   ├── AuthContext.tsx           # Auth state management
│   │   └── ThemeContext.tsx          # Theme provider
│   │
│   ├── store/                        # State management
│   │   └── useStore.ts               # Zustand store (if used)
│   │
│   ├── types/                        # TypeScript types
│   │   ├── index.ts                  # Main type definitions
│   │   ├── project.ts                # Project types
│   │   ├── team.ts                   # Team types
│   │   └── admin.ts                  # Admin types
│   │
│   └── scripts/                      # Utility scripts
│       ├── seedTeamMembers.ts        # Seed team data
│       └── seedProjectRequests.ts    # Seed project data
│
├── public/                           # Static assets
│   ├── images/                       # Image files
│   ├── fonts/                        # Custom fonts
│   └── icons/                        # Icon files
│
├── firestore.rules                   # Firestore security rules
├── firestore.indexes.json            # Firestore indexes
├── components.json                   # shadcn/ui config
├── tailwind.config.ts                # Tailwind configuration
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── eslint.config.mjs                 # ESLint configuration
├── postcss.config.mjs                # PostCSS configuration
├── package.json                      # Dependencies
├── .env.local                        # Environment variables (gitignored)
└── README.md                         # This file
```

---

## 🎯 Key Functionalities

### 1. Project Creation Workflow

**User Flow:**
```
User clicks "Create Project" FAB
  → 3-Step Wizard Opens
  → Step 1: Enter name, description, workspace
  → Step 2: Choose emoji icon & color theme
  → Step 3: Add dates, budget, tags
  → Submit to Firebase
  → Success confetti & notification
  → Project appears in projects page
```

**Features:**
- 32 curated emoji icons for projects
- 10 beautiful gradient color themes
- Live preview card during creation
- Form validation with Zod
- Smooth step transitions with Framer Motion
- Firebase real-time sync

**Key Files:**
- `src/components/projects/CreateProjectModal.tsx`
- `src/components/projects/FloatingCreateButton.tsx`
- `src/lib/projectService.ts`

### 2. Admin Approval System

**User Flow:**
```
User requests project/team member
  → Request stored in Firestore (pending)
  → Admin sees request in dashboard
  → Admin clicks "Approve" or "Reject"
  → ApprovalFlowVisualizer shows 4-stage animation
  → Multi-stage confetti celebration
  → Firebase syncs approved data
  → All users see update in real-time
```

**4-Stage Approval Animation:**
1. **Admin Approval** (Purple) - CheckCircle icon
2. **Firebase Sync** (Blue) - Zap icon
3. **Processing Data** (Green) - Sparkles icon
4. **Team Page Update** (Orange) - Users icon

**Key Files:**
- `src/components/admin/AdminApprovalPanel.tsx`
- `src/components/admin/ApprovalFlowVisualizer.tsx`
- `src/lib/adminService.ts`

### 3. Team Workload Management

**Features:**
- Real-time task count tracking per team member
- Visual workload distribution charts
- Automatic calculation of available capacity
- Color-coded workload indicators (green/yellow/red)
- Admin can edit task counts directly
- Live sync across all users

**Workload Calculation:**
```typescript
Workload % = (Current Tasks / Max Capacity) × 100
Status:
  - Green: 0-60% (Available)
  - Yellow: 61-85% (Moderate)
  - Red: 86-100% (Full capacity)
```

**Key Files:**
- `src/components/team/WorkloadChart.tsx`
- `src/lib/teamWorkloadService.ts`
- `src/components/admin/TaskCountEditor.tsx`

### 4. Real-Time Notifications

**Notification Types:**
- New project created
- Project approved by admin
- Team member added
- Task assigned to you
- Workload threshold exceeded
- Project deadline approaching

**Features:**
- Toast notifications with Sonner
- In-app notification center
- Confetti celebrations for positive events
- Sound effects (optional)
- Auto-dismiss after 8 seconds
- Slide-in animations

**Key Files:**
- `src/components/notifications/NotificationCenter.tsx`
- `src/components/team/NewMemberNotification.tsx`

### 5. Firebase Quota Optimization

**Problem:** Excessive Firebase reads causing quota exhaustion

**Solution Implemented:**
- ✅ Replaced real-time listeners with React Query
- ✅ 5-minute cache for all Firestore data
- ✅ Smart refetch on user interactions only
- ✅ Removed redundant subscriptions
- ✅ Batch read operations
- ✅ Optimistic UI updates

**Result:** **90% reduction in Firebase reads!**

**Key Files:**
- `src/hooks/useFirestore.ts`
- `FIREBASE_QUOTA_SOLUTION_2025.md`

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "3w-action-tracker")
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Enable Firestore

1. In Firebase Console, go to **Firestore Database**
2. Click "Create Database"
3. Select **Production Mode**
4. Choose your region (e.g., us-central)
5. Click "Enable"

### Step 3: Set Up Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Add an admin user:
   - Go to **Users** tab
   - Click "Add User"
   - Email: `admin@gmail.com`
   - Password: (choose a secure password)

### Step 4: Configure Security Rules

Deploy these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all authenticated users
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    // Admin-only write access
    match /projects/{projectId} {
      allow write: if request.auth != null && 
                      request.auth.token.email == 'admin@gmail.com';
    }
    
    match /teamMembers/{memberId} {
      allow write: if request.auth != null && 
                      request.auth.token.email == 'admin@gmail.com';
    }
    
    // Public read for non-sensitive data
    match /publicData/{document=**} {
      allow read: if true;
    }
  }
}
```

### Step 5: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click **Web** icon (</>)
4. Register your app
5. Copy the config object
6. Add to `.env.local`

### Step 6: Seed Initial Data (Optional)

```bash
# Add team members
npm run seed:team

# Add project requests
npm run seed:projects
```

---

## 🔐 Admin Features

### Admin Dashboard

**URL:** `http://localhost:3000/admin/dashboard`

**Sections:**
1. **Overview** - Key metrics and activity feed
2. **Project Requests** - Approve/reject pending projects
3. **Team Requests** - Approve/reject team member additions
4. **Workload Management** - Edit task counts
5. **Analytics** - Usage statistics and trends

**Live Widgets:**
- **LiveSyncDashboard** (bottom-right corner)
  - Pending requests count
  - Total team members
  - Last sync timestamp
  - Connection status indicator

### Admin Controls

**Project Approval:**
```typescript
// Admin clicks "Approve Project"
await approveProject(requestId)
  → Show ApprovalFlowVisualizer (3.5s animation)
  → Multi-stage confetti celebration
  → Create project in Firestore
  → Delete request from queue
  → Notify all users in real-time
```

**Team Member Approval:**
```typescript
// Admin clicks "Approve Member"
await approveMember(requestId)
  → Add to teamMembers collection
  → Initialize workload (0 tasks)
  → Show success notification
  → Update team page for all users
```

**Task Count Editor:**
- Inline editing of task counts
- Instant Firebase sync
- Workload percentage auto-updates
- Visual feedback on save

### Admin Authentication

**Login Flow:**
```
User navigates to /admin/login
  → Enter email/password
  → Firebase Auth validates credentials
  → Check if email === 'admin@gmail.com'
  → Set session cookie
  → Redirect to /admin/dashboard
```

**Protected Routes:**
- All `/admin/*` routes require authentication
- Middleware checks auth state
- Redirects to `/admin/login` if not authenticated

**Key Files:**
- `src/app/admin/login/page.tsx`
- `src/app/admin/dashboard/page.tsx`
- `src/hooks/useAuth.ts`

---

## 👥 Team Collaboration

### Team Page Features

**URL:** `http://localhost:3000/team`

**Components:**
- Team member cards with avatars
- Workload bar charts
- Real-time task counts
- Department filters
- Role badges
- Quick actions menu

### Workload Visualization

**Workload Chart:**
- Horizontal bar chart per member
- Color-coded by capacity:
  - 🟢 Green: 0-60% available
  - 🟡 Yellow: 61-85% moderate
  - 🔴 Red: 86-100% at capacity
- Animated progress bars
- Hover tooltips with details

**Team Summary:**
- Total team size
- Average workload percentage
- Members at capacity
- Available capacity

### Real-Time Collaboration

**Live Features:**
- New member notifications (8s duration)
- Task assignment updates
- Project membership changes
- Comment notifications
- Workload threshold alerts

**New Member Notification:**
```
Triggers when admin approves member
  → Green gradient banner (top-right)
  → Confetti celebration
  → Shows: name, role, department
  → Auto-dismisses after 8 seconds
  → Slide-in/out animations
```

**Key Files:**
- `src/app/team/page.tsx`
- `src/components/team/TeamMemberCard.tsx`
- `src/components/team/WorkloadChart.tsx`
- `src/components/team/NewMemberNotification.tsx`

---

## 📸 Screenshots

### Home Page
Modern landing page with animated background, hero section, and feature showcase.

### Admin Dashboard
Centralized control panel with approval queues, metrics, and live activity feed.

### Project Creation Wizard
3-step modal with emoji picker, color themes, and live preview card.

### Team Workload View
Visual charts showing task distribution and capacity across team members.

### Real-Time Notifications
Toast notifications and celebration effects for important events.

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local`:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Next.js Configuration

`next.config.ts`:
```typescript
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactCompiler: true, // React 19 compiler
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};
```

### TailwindCSS Configuration

`tailwind.config.ts`:
```typescript
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...},
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### Firebase Indexes

Required composite indexes (auto-generated on first query):
```json
{
  "indexes": [
    {
      "collectionGroup": "projects",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "workspace", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## 📜 Scripts

### Development
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Seeding
```bash
npm run seed:team       # Add sample team members to Firestore
npm run seed:projects   # Add sample project requests to Firestore
```

### Maintenance
```bash
# Clear Next.js cache
Remove-Item -Path ".\.next" -Recurse -Force

# Clear node_modules cache
Remove-Item -Path ".\node_modules\.cache" -Recurse -Force

# Kill node processes (Windows PowerShell)
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Firebase** - Excellent backend-as-a-service
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful component library
- **Framer Motion** - Smooth animations
- **TailwindCSS** - Utility-first CSS framework
- **Vercel** - Hosting and deployment platform

---

## 📞 Support

For issues, questions, or feature requests:
- **GitHub Issues**: [Create an issue](https://github.com/supun-ravidu/3W-Action-Tracker/issues)
- **Email**: support@3wactiontracker.com (if available)
- **Documentation**: Check the `/docs` folder for detailed guides

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables from `.env.local`
6. Click "Deploy"

**Production URL:** `https://your-app.vercel.app`

### Deploy to Other Platforms

- **Netlify**: Use `npm run build` and deploy `out/` folder
- **Firebase Hosting**: Use Firebase CLI
- **AWS Amplify**: Connect GitHub repository
- **Railway**: Deploy with one click

---

## 📚 Additional Documentation

For more detailed information, check these guides in the repository:

- `QUICK_START.md` - Quick start guide
- `FIREBASE_QUOTA_SOLUTION_2025.md` - Firebase optimization guide
- `PROJECT_CREATION_GUIDE.md` - Project creation feature docs
- `TEAM_WORKLOAD_SYSTEM_GUIDE.md` - Workload management docs
- `ADMIN_APPROVAL_QUICKSTART.md` - Admin approval system docs
- `IMPLEMENTATION_COMPLETE.md` - Full implementation details
- `TESTING_GUIDE.md` - Testing instructions

---

<div align="center">

**Built with ❤️ using Next.js, React, TypeScript, and Firebase**

[⬆ Back to Top](#-3w-action-plan-tracker)

</div>
