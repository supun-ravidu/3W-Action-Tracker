'use client';

import { DashboardStatsSection } from '@/components/dashboard/DashboardStatsSection';
import { PriorityDistributionSection } from '@/components/dashboard/PriorityDistributionSection';
import { UpcomingDeadlinesSection } from '@/components/dashboard/UpcomingDeadlinesSection';
import { TeamPerformanceSection } from '@/components/dashboard/TeamPerformanceSection';
import { RecentActivitySection } from '@/components/dashboard/RecentActivitySection';
import { MyWorkloadWidget } from '@/components/dashboard/MyWorkloadWidget';
import { actionPlans, activityLogs, teamMembers } from '@/store/mockData';
import {
  calculateDashboardStats,
  calculatePriorityDistribution,
  calculateTeamPerformance,
} from '@/lib/dashboardUtils';
import { Button } from '@/components/ui/button';
import { Plus, LayoutDashboard, Sparkles, Palette, Music, ListChecks, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatedMascot } from '@/components/AnimatedMascot';
import { AnimatedBusinessBackground } from '@/components/AnimatedBusinessBackground';
import { FloatingBalls, PhysicsCard } from '@/components/PhysicsInteractions';
import { HighlightedText, AnimatedMetric } from '@/components/RoughAnnotations';
import { SpringCard, AnimatedCounter, FloatingElement } from '@/components/SpringAnimations';
import { ScrollReveal, StaggeredCards } from '@/components/GSAPAnimations';
import { SoundToggle, AmbientMusicPlayer } from '@/components/SoundEffects';
import { ThemeCustomizer } from '@/components/ColorCustomizer';
import { CreativeShowcase } from '@/components/CreativeShowcase';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { CreativeNavBar } from '@/components/CreativeNavBar';


export default function Home() {
  const router = useRouter();
  
  // Calculate dashboard data
  const dashboardStats = calculateDashboardStats(actionPlans);
  const priorityDistribution = calculatePriorityDistribution(actionPlans);
  const teamPerformance = calculateTeamPerformance(
    actionPlans,
    teamMembers.map((m) => m.name)
  );

  // Welcome effect
  useEffect(() => {
    // Show welcome toast
    setTimeout(() => {
      toast.success('Welcome to 3W Action Plan Tracker!', {
        description: 'Track your tasks with What, Who, and When',
        duration: 4000,
      });
    }, 500);

    // Trigger confetti
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899']
      });
    }, 1000);
  }, []);

  const handleNewActionPlan = () => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b']
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b']
    });
    toast.success('Opening Action Plan Form...', {
      description: 'Create a new task with What, Who, and When',
    });
  };


  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showPhysics, setShowPhysics] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Advanced Animated Background */}
      <AnimatedBusinessBackground />
      
      <Toaster position="top-right" richColors />
      
      {/* Sound & Music Controls */}
      <SoundToggle />
      <AmbientMusicPlayer />
      
      
      
      {/* Creative Navigation Bar */}
      <CreativeNavBar
        showCustomizer={showCustomizer}
        setShowCustomizer={setShowCustomizer}
      />

      {/* Theme Customizer Panel */}
      {showCustomizer && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-0 right-0 h-screen w-full md:w-96 bg-background border-l shadow-2xl z-40 overflow-y-auto p-6"
        >
          <button
            onClick={() => setShowCustomizer(false)}
            className="absolute top-4 right-4 text-2xl"
          >
            ✕
          </button>
          <ThemeCustomizer />
        </motion.div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Dashboard Stats with Enhanced Animations */}
        <ScrollReveal>
          <DashboardStatsSection stats={dashboardStats} />
        </ScrollReveal>

        {/* My Workload Widget - Shows user's personal workload */}
        <ScrollReveal>
          <MyWorkloadWidget />
        </ScrollReveal>
        
        {/* Physics Interactive Demo Section */}
        {showPhysics && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <FloatingBalls />
          </motion.section>
        )}
        
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => setShowPhysics(!showPhysics)}
            variant="outline"
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {showPhysics ? 'Hide' : 'Show'} Interactive Physics Demo
          </Button>
        </div>

        {/* Priority & Deadlines Row with Spring Cards */}
        <ScrollReveal direction="left">
          <div className="grid gap-6 md:grid-cols-2">
            <PhysicsCard className="transition-all hover:shadow-xl">
              <PriorityDistributionSection distribution={priorityDistribution} />
            </PhysicsCard>
            <PhysicsCard className="transition-all hover:shadow-xl">
              <UpcomingDeadlinesSection actionPlans={actionPlans} />
            </PhysicsCard>
          </div>
        </ScrollReveal>

        {/* Team Performance & Recent Activity Row */}
        <ScrollReveal direction="right">
          <div className="grid gap-6 md:grid-cols-2">
            <SpringCard className="transition-all hover:shadow-xl">
              <TeamPerformanceSection performance={teamPerformance} />
            </SpringCard>
            <SpringCard className="transition-all hover:shadow-xl">
              <RecentActivitySection activities={activityLogs} />
            </SpringCard>
          </div>
        </ScrollReveal>

        {/* Floating Action Button */}
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        >
          <motion.button
            onClick={handleNewActionPlan}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.5)',
                '0 0 40px rgba(139, 92, 246, 0.8)',
                '0 0 20px rgba(59, 130, 246, 0.5)',
              ],
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity },
            }}
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        </motion.div>

        {/* Creative Features Showcase */}
        <ScrollReveal>
          <section className="mt-12">
            <CreativeShowcase />
          </section>
        </ScrollReveal>

        {/* Animated Mascot */}
        <AnimatedMascot completionRate={dashboardStats.completionRate} />
      </main>
    </div>
  );
}
