'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  getWorkloadStatistics,
  TeamMemberWorkload,
  getTeamWorkload,
} from '@/lib/teamWorkloadService';

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
      const workloadData = await getTeamWorkload();
      
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
    
    // Poll every 30 minutes to drastically reduce quota usage
    const interval = setInterval(fetchWorkload, 1800000);
    
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
