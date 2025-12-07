/**
 * Real-time Projects Service
 * Manages real-time subscriptions for approved projects
 */

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Project } from '@/types';

const PROJECTS_COLLECTION = 'projects';

/**
 * Subscribe to all projects in real-time
 * Automatically updates when admin approves new projects
 */
export const subscribeToProjects = (
  onUpdate: (projects: Project[]) => void,
  onError?: (error: Error) => void
) => {
  console.log('🔌 Setting up real-time projects subscription...');
  
  const q = query(
    collection(db, PROJECTS_COLLECTION),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      console.log('📡 Projects snapshot received:', {
        size: snapshot.size,
        empty: snapshot.empty,
        docChanges: snapshot.docChanges().length,
      });
      
      const projects: Project[] = [];
      const changes = snapshot.docChanges();
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Convert Firestore Timestamps to JavaScript Dates
        projects.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          icon: data.icon,
          color: data.color,
          workspace: data.workspace,
          startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(data.startDate),
          targetEndDate: data.targetEndDate instanceof Timestamp ? data.targetEndDate.toDate() : new Date(data.targetEndDate),
          budget: data.budget,
          tags: data.tags || [],
          actionPlans: data.actionPlans || [],
          teamMembers: data.teamMembers || [],
          lead: data.lead,
          status: data.status || 'active',
          dependencies: data.dependencies || [],
          progress: data.progress || 0,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
        });
      });

      // Log additions (newly approved projects)
      changes.forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          console.log('✨ New project added:', data.name);
        }
      });

      console.log(`📊 Loaded ${projects.length} projects from Firebase`);
      onUpdate(projects);
    },
    (error) => {
      console.error('❌ Error in projects subscription:', error);
      onError?.(error as Error);
    }
  );

  return unsubscribe;
};

/**
 * Subscribe to active projects only
 */
export const subscribeToActiveProjects = (
  onUpdate: (projects: Project[]) => void,
  onError?: (error: Error) => void
) => {
  console.log('🔌 Setting up active projects subscription...');
  
  const q = query(
    collection(db, PROJECTS_COLLECTION),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const projects: Project[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'active') {
          projects.push({
            id: doc.id,
            ...data,
            startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(data.startDate),
            targetEndDate: data.targetEndDate instanceof Timestamp ? data.targetEndDate.toDate() : new Date(data.targetEndDate),
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
          } as Project);
        }
      });

      console.log(`📊 ${projects.length} active projects`);
      onUpdate(projects);
    },
    (error) => onError?.(error as Error)
  );
};

/**
 * Get newly added project IDs in the last N minutes
 * Used for highlighting recently approved projects
 */
export const getRecentlyAddedProjectIds = (
  projects: Project[],
  minutesThreshold: number = 5
): Set<string> => {
  const now = new Date();
  const threshold = minutesThreshold * 60 * 1000; // Convert to milliseconds
  
  const recentIds = new Set<string>();
  
  projects.forEach((project) => {
    if (project.createdAt && project.id) {
      const timeDiff = now.getTime() - new Date(project.createdAt).getTime();
      if (timeDiff <= threshold) {
        recentIds.add(project.id);
      }
    }
  });
  
  return recentIds;
};
