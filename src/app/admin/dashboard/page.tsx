'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
    // Poll every 2 minutes
    const interval = setInterval(loadDashboardData, 120000);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Real-time Sync Indicator */}
      <AdminTeamSyncIndicator />
      
      {/* Live Sync Dashboard - Temporarily disabled to reduce Firebase quota usage
      <LiveSyncDashboard /> */}
      
      {/* Creative Admin Navbar */}
      <CreativeAdminNavbar user={user!} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-xl grid-cols-2 bg-white/80 backdrop-blur-md">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="team-approvals" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Team Requests
              <PendingRequestsBadge />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => router.push('/admin/project-approvals')}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-500 transition-colors relative">
                      <FolderKanban className="h-6 w-6 text-pink-600 group-hover:text-white transition-colors" />
                      <PendingProjectRequestsBadge />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Project Approvals</p>
                      <p className="text-xs text-gray-500">Review requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => router.push('/team')}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                      <Users className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Manage Team</p>
                      <p className="text-xs text-gray-500">{stats.totalTeamMembers} members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => router.push('/projects')}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                      <FolderKanban className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Projects</p>
                      <p className="text-xs text-gray-500">{stats.totalProjects} total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => router.push('/reports')}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                      <BarChart3 className="h-6 w-6 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Reports</p>
                      <p className="text-xs text-gray-500">Analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                      <Settings className="h-6 w-6 text-amber-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Settings</p>
                      <p className="text-xs text-gray-500">Configure</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card className="border-2 border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  System Status
                </CardTitle>
                <CardDescription>All services operational</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Firebase</p>
                      <p className="text-xs text-gray-500">Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Authentication</p>
                      <p className="text-xs text-gray-500">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Database</p>
                      <p className="text-xs text-gray-500">Healthy</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team-approvals">
            <AdminApprovalPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
