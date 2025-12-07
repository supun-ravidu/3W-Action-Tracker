'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Users, FolderKanban, BarChart3, Settings, UserPlus, TrendingUp, Activity, Zap, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { AdminApprovalPanel } from '@/components/admin/AdminApprovalPanel';
import { PendingRequestsBadge } from '@/components/admin/PendingRequestsBadge';
import { PendingProjectRequestsBadge } from '@/components/admin/PendingProjectRequestsBadge';
import { CreativeAdminNavbar } from '@/components/admin/CreativeAdminNavbar';
import { AnimatedStatCard } from '@/components/admin/AnimatedStatCard';
import { RealtimeActivityFeed } from '@/components/admin/RealtimeActivityFeed';
import { AnimatedChart } from '@/components/admin/AnimatedChart';
import { AdminTeamSyncIndicator } from '@/components/admin/AdminTeamSyncIndicator';
import { LiveSyncDashboard } from '@/components/admin/LiveSyncDashboard';
import { CurrentWorkloadWidget } from '@/components/admin/CurrentWorkloadWidget';
import {
  DashboardStats,
  ActivityItem,
  subscribeToDashboardStats,
  subscribeToRecentActivity,
  getTeamPerformanceData,
  getProjectStatusData,
  getActionPriorityData,
  getMonthlyTrendData,
  ChartData,
} from '@/lib/adminAnalyticsService';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalTeamMembers: 0,
    totalProjects: 0,
    totalActions: 0,
    activeProjects: 0,
    completedActions: 0,
    pendingActions: 0,
    teamMembersThisMonth: 0,
    projectsThisMonth: 0,
    actionsThisMonth: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<ChartData[]>([]);
  const [projectStatus, setProjectStatus] = useState<ChartData[]>([]);
  const [actionPriority, setActionPriority] = useState<ChartData[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<ChartData[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === 'admin@gmail.com') {
        setUser(currentUser);
        setLoading(false);
      } else {
        // Not authenticated or not admin, redirect to login
        router.push('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Load dashboard data with polling
  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        const { getDashboardStats, getRecentActivity } = await import('@/lib/adminAnalyticsService');
        const newStats = await getDashboardStats();
        const newActivities = await getRecentActivity(10);
        setStats(newStats);
        setActivities(newActivities);
      } catch (error) {
        console.error('Dashboard data error:', error);
      }
    };

    loadDashboardData();
    // Poll every 15 minutes to reduce quota usage
    const interval = setInterval(loadDashboardData, 900000);

    return () => clearInterval(interval);
  }, [user]);

  // Load chart data
  useEffect(() => {
    if (!user) return;

    const loadChartData = async () => {
      const teamData = await getTeamPerformanceData();
      setTeamPerformance(teamData);
      setProjectStatus(getProjectStatusData());
      setActionPriority(getActionPriorityData());
      setMonthlyTrend(getMonthlyTrendData());
    };

    loadChartData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Real-time Sync Indicator */}
      <AdminTeamSyncIndicator />
      
      {/* Live Sync Dashboard - Temporarily disabled to reduce Firebase quota usage
      <LiveSyncDashboard /> */}
      
      {/* Creative Admin Navbar */}
      <CreativeAdminNavbar user={user!} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                  <Zap className="h-10 w-10 text-yellow-400" />
                  Welcome Back, Admin!
                </h2>
                <p className="text-purple-200 text-lg">
                  Here's what's happening with your projects today.
                </p>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Activity className="h-16 w-16 text-purple-400 opacity-50" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
            {/* Animated Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedStatCard
                title="Team Members"
                value={stats.totalTeamMembers}
                subtitle={`+${stats.teamMembersThisMonth} this month`}
                icon={Users}
                trend={stats.teamMembersThisMonth > 0 ? 20 : 0}
                color="#8b5cf6"
                delay={0}
              />
              <AnimatedStatCard
                title="Active Projects"
                value={stats.activeProjects}
                subtitle={`${stats.totalProjects} total projects`}
                icon={FolderKanban}
                trend={15}
                color="#3b82f6"
                delay={0.1}
              />
              <AnimatedStatCard
                title="Total Actions"
                value={stats.totalActions}
                subtitle={`${stats.completedActions} completed`}
                icon={Target}
                trend={8}
                color="#10b981"
                delay={0.2}
              />
              <AnimatedStatCard
                title="Pending Actions"
                value={stats.pendingActions}
                subtitle={`${stats.actionsThisMonth} created this month`}
                icon={AlertCircle}
                trend={-5}
                color="#f59e0b"
                delay={0.3}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatedChart
                title="Team Performance"
                description="Distribution by role"
                data={teamPerformance}
                type="pie"
              />
              <AnimatedChart
                title="Project Status"
                description="Current project distribution"
                data={projectStatus}
                type="bar"
              />
            </div>

            {/* Activity Feed and Priority */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealtimeActivityFeed activities={activities} />
              
              <AnimatedChart
                title="Action Priority"
                description="Tasks by priority level"
                data={actionPriority}
                type="bar"
              />
            </div>

            {/* Monthly Trend */}
            <AnimatedChart
              title="Monthly Activity Trend"
              description="Actions completed over the last 6 months"
              data={monthlyTrend}
              type="line"
            />

            {/* Current Workload Widget - Real-time via Polling */}
            <CurrentWorkloadWidget />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="hover:shadow-2xl transition-all cursor-pointer group bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-xl border border-white/10" onClick={() => router.push('/admin/project-approvals')}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center gap-3">
                      <motion.div 
                        className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg relative"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <FolderKanban className="h-7 w-7 text-white" />
                        <PendingProjectRequestsBadge />
                      </motion.div>
                      <div>
                        <p className="font-bold text-white">Project Approvals</p>
                        <p className="text-xs text-purple-300">Review requests</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="hover:shadow-2xl transition-all cursor-pointer group bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-xl border border-white/10" onClick={() => router.push('/team')}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center gap-3">
                      <motion.div 
                        className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Users className="h-7 w-7 text-white" />
                      </motion.div>
                      <div>
                        <p className="font-bold text-white">Manage Team</p>
                        <p className="text-xs text-purple-300">{stats.totalTeamMembers} members</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="hover:shadow-2xl transition-all cursor-pointer group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10" onClick={() => router.push('/projects')}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center gap-3">
                      <motion.div 
                        className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <FolderKanban className="h-7 w-7 text-white" />
                      </motion.div>
                      <div>
                        <p className="font-bold text-white">Projects</p>
                        <p className="text-xs text-purple-300">{stats.totalProjects} total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="hover:shadow-2xl transition-all cursor-pointer group bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-white/10" onClick={() => router.push('/reports')}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center gap-3">
                      <motion.div 
                        className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <BarChart3 className="h-7 w-7 text-white" />
                      </motion.div>
                      <div>
                        <p className="font-bold text-white">Reports</p>
                        <p className="text-xs text-purple-300">Analytics</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="hover:shadow-2xl transition-all cursor-pointer group bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-white/10">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center gap-3">
                      <motion.div 
                        className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Settings className="h-7 w-7 text-white" />
                      </motion.div>
                      <div>
                        <p className="font-bold text-white">Settings</p>
                        <p className="text-xs text-purple-300">Configure</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 border-green-400/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-300 text-2xl">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <CheckCircle className="h-7 w-7" />
                    </motion.div>
                    System Status
                  </CardTitle>
                  <CardDescription className="text-purple-300 font-semibold">All services operational and running smoothly</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div 
                      className="flex items-center gap-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm"
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <div className="relative">
                        <div className="h-4 w-4 rounded-full bg-green-400 animate-pulse" />
                        <div className="absolute inset-0 h-4 w-4 rounded-full bg-green-400 animate-ping" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Firebase</p>
                        <p className="text-xs text-green-300">Connected</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm"
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <div className="relative">
                        <div className="h-4 w-4 rounded-full bg-green-400 animate-pulse" />
                        <div className="absolute inset-0 h-4 w-4 rounded-full bg-green-400 animate-ping" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Authentication</p>
                        <p className="text-xs text-green-300">Active</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm"
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <div className="relative">
                        <div className="h-4 w-4 rounded-full bg-green-400 animate-pulse" />
                        <div className="absolute inset-0 h-4 w-4 rounded-full bg-green-400 animate-ping" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Database</p>
                        <p className="text-xs text-green-300">Healthy</p>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
        </div>
      </main>
    </div>
  );
}
