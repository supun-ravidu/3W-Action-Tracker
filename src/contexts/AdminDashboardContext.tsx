'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AdminDashboardContextType {
  pendingTeamRequests: number;
  pendingProjectRequests: number;
  totalTeamMembers: number;
  totalProjects: number;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  lastUpdate: Date | null;
}

const AdminDashboardContext = createContext<AdminDashboardContextType | undefined>(undefined);

export function AdminDashboardProvider({ children }: { children: ReactNode }) {
  const [pendingTeamRequests, setPendingTeamRequests] = useState(0);
  const [pendingProjectRequests, setPendingProjectRequests] = useState(0);
  const [totalTeamMembers, setTotalTeamMembers] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchAdminStats = async () => {
    try {
      // Fetch all data in parallel
      const [teamRequestsSnap, projectRequestsSnap, teamMembersSnap, projectsSnap] = await Promise.all([
        getDocs(query(collection(db, 'teamMemberRequests'), where('status', '==', 'pending'))),
        getDocs(query(collection(db, 'projectRequests'), where('status', '==', 'pending'))),
        getDocs(query(collection(db, 'teamMembers'))),
        getDocs(query(collection(db, 'projects'))),
      ]);

      setPendingTeamRequests(teamRequestsSnap.size);
      setPendingProjectRequests(projectRequestsSnap.size);
      setTotalTeamMembers(teamMembersSnap.size);
      setTotalProjects(projectsSnap.size);
      setLastUpdate(new Date());
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Admin stats fetch error:', err);
      setLoading(false);
      setError(err as Error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAdminStats();
    
    // Poll every 2 minutes for admin dashboard (more frequent than regular data)
    const interval = setInterval(fetchAdminStats, 120000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminDashboardContext.Provider
      value={{
        pendingTeamRequests,
        pendingProjectRequests,
        totalTeamMembers,
        totalProjects,
        loading,
        error,
        refetch: fetchAdminStats,
        lastUpdate,
      }}
    >
      {children}
    </AdminDashboardContext.Provider>
  );
}

export function useAdminDashboard() {
  const context = useContext(AdminDashboardContext);
  if (context === undefined) {
    throw new Error('useAdminDashboard must be used within an AdminDashboardProvider');
  }
  return context;
}
