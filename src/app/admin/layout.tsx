'use client';

import { WorkloadProvider } from '@/contexts/WorkloadContext';
import { AdminDashboardProvider } from '@/contexts/AdminDashboardContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminDashboardProvider>
      <WorkloadProvider>{children}</WorkloadProvider>
    </AdminDashboardProvider>
  );
}
