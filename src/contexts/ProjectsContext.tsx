'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getProjects as fetchProjects } from '@/lib/projectsRealtimeService';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'on-hold' | 'archived';
  progress: number;
  workspace: string;
  actionPlans: any[];
  budget?: {
    allocated: number;
    spent: number;
  };
  [key: string]: any;
}

interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  isConnected: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  lastUpdate: Date | null;
  recentlyAddedIds: Set<string>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [recentlyAddedIds, setRecentlyAddedIds] = useState<Set<string>>(new Set());

  const loadProjects = async () => {
    try {
      const projectsData = await fetchProjects();

      // Identify recently added projects (last 5 minutes)
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      const recentIds = new Set(
        projectsData
          .filter((p) => {
            const createdAt = p.createdAt?.getTime?.() || 0;
            return createdAt > fiveMinutesAgo;
          })
          .map((p) => p.id)
      );

      setProjects(projectsData);
      setRecentlyAddedIds(recentIds);
      setLastUpdate(new Date());
      setLoading(false);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Projects fetch error:', err);
      setIsConnected(false);
      setLoading(false);
      setError(err as Error);
    }
  };

  useEffect(() => {
    // Initial fetch
    loadProjects();
    
    // Poll every 10 minutes to drastically reduce quota usage
    const interval = setInterval(loadProjects, 600000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        isConnected,
        error,
        refetch: loadProjects,
        lastUpdate,
        recentlyAddedIds,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
