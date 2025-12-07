'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  getWorkloadStatistics,
  TeamMemberWorkload,
} from '@/lib/teamWorkloadService';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface WorkloadContextType {
  workloads: TeamMemberWorkload[];
  statistics: ReturnType<typeof getWorkloadStatistics> | null;
  loading: boolean;
  isConnected: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const WorkloadContext = createContext<WorkloadContextType | undefined>(undefined);

export function WorkloadProvider({ children }: { children: ReactNode }) {
  const [workloads, setWorkloads] = useState<TeamMemberWorkload[]>([]);
  const [statistics, setStatistics] = useState<ReturnType<typeof getWorkloadStatistics> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkload = async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'teamMembers')));
      const workloadData: TeamMemberWorkload[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        
        // Use taskCounts if available, otherwise fall back to individual fields
        const taskCounts = data.taskCounts || {
          done: data.completedTasks || 0,
          active: data.inProgressTasks || 0,
          pending: data.pendingTasks || 0,
          blocked: data.blockedTasks || 0,
          total: data.totalTasks || 0,
        };
        
        // If total is not set but individual counts are, calculate it
        if (!taskCounts.total && (taskCounts.done || taskCounts.active || taskCounts.pending || taskCounts.blocked)) {
          taskCounts.total = taskCounts.done + taskCounts.active + taskCounts.pending + taskCounts.blocked;
        }
        
        return {
          memberId: doc.id,
          memberName: data.name || 'Unknown',
          email: data.email || '',
          avatar: data.avatar,
          role: data.role,
          department: data.department,
          taskCounts,
          recentTasks: [],
          lastUpdated: new Date(),
        };
      });
      
      setWorkloads(workloadData);
      setStatistics(getWorkloadStatistics(workloadData));
      setLoading(false);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Workload fetch error:', err);
      setIsConnected(false);
      setLoading(false);
      setError(err as Error);
    }
  };

  useEffect(() => {
    // Initial fetch only - NO real-time subscription
    fetchWorkload();
    
    // Poll every 3 minutes to reduce quota usage
    const interval = setInterval(fetchWorkload, 180000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <WorkloadContext.Provider
      value={{
        workloads,
        statistics,
        loading,
        isConnected,
        error,
        refetch: fetchWorkload,
      }}
    >
      {children}
    </WorkloadContext.Provider>
  );
}

export function useWorkload() {
  const context = useContext(WorkloadContext);
  if (context === undefined) {
    throw new Error('useWorkload must be used within a WorkloadProvider');
  }
  return context;
}
