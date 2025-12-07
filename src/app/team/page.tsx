'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamOverview } from '@/components/team/TeamOverview';
import { WorkloadDistribution } from '@/components/team/WorkloadDistribution';
import { SkillMatrix } from '@/components/team/SkillMatrix';
import { AvailabilityCalendar } from '@/components/team/AvailabilityCalendar';
import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';
import { CreativeNavBar } from '@/components/CreativeNavBar';
import { CreativeAdminNavbar } from '@/components/admin/CreativeAdminNavbar';
import { TeamMemberNotifications } from '@/components/team/TeamMemberNotifications';
import { NewMemberSpotlight } from '@/components/team/NewMemberSpotlight';
import { NewMemberApprovedNotification } from '@/components/team/NewMemberApprovedNotification';
import { WorkloadSyncManager } from '@/components/team/WorkloadSyncManager';
import { RealtimeWorkloadDisplay } from '@/components/team/RealtimeWorkloadDisplay';
import { AdvancedTeamWorkload } from '@/components/team/AdvancedTeamWorkload';
import { Users, BarChart3, Award, Calendar, Bell } from 'lucide-react';

export default function TeamPage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Optional: Track current user if logged in, but don't require it
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Real-time Notifications - Temporarily disabled to reduce Firebase quota usage
      <TeamMemberNotifications />
      <NewMemberSpotlight />
      <NewMemberApprovedNotification />
      <WorkloadSyncManager /> */}
      
      {/* Main Navigation Bar - Always visible */}
      <CreativeNavBar />

      <div className="container mx-auto p-8 space-y-8 mt-20">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Team Collaboration</h1>
          <p className="text-muted-foreground">
            Manage your team, track workload, and view availability
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="overview" className="gap-2">
            <Users className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="workload" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Workload
          </TabsTrigger>
          <TabsTrigger value="skills" className="gap-2">
            <Award className="h-4 w-4" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="availability" className="gap-2">
            <Calendar className="h-4 w-4" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <TeamOverview />
        </TabsContent>

        <TabsContent value="workload" className="space-y-6">
          <AdvancedTeamWorkload />
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <SkillMatrix />
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <AvailabilityCalendar />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="max-w-4xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Notification Settings</h2>
              <p className="text-muted-foreground">
                Configure how and when you want to receive notifications
              </p>
            </div>
            <NotificationPreferences />
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
