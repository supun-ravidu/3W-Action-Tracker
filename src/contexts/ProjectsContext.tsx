'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const projectsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Untitled Project',
          description: data.description || '',
          status: data.status || 'active',
          progress: data.progress || 0,
          workspace: data.workspace || 'default',
          actionPlans: data.actionPlans || [],
          budget: data.budget,
          ...data,
        } as Project;
      });

      // Identify recently added projects (last 5 minutes)
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      const recentIds = new Set(
        projectsData
          .filter((p) => {
            const createdAt = p.createdAt?.toMillis?.() || 0;
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
    fetchProjects();
    
    // Poll every 5 minutes to drastically reduce quota usage
    const interval = setInterval(fetchProjects, 300000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        isConnected,
        error,
        refetch: fetchProjects,
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
