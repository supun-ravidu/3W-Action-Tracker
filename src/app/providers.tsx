'use client';

import { TeamMembersProvider } from '@/contexts/TeamMembersContext';
import { WorkloadProvider } from '@/contexts/WorkloadContext';
import { AdminDashboardProvider } from '@/contexts/AdminDashboardContext';
import { ProjectsProvider } from '@/contexts/ProjectsContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TeamMembersProvider>
      <WorkloadProvider>
        <ProjectsProvider>
          <AdminDashboardProvider>
            {children}
          </AdminDashboardProvider>
        </ProjectsProvider>
      </WorkloadProvider>
    </TeamMembersProvider>
  );
}
