/**
 * Projects Service (Optimized for Quota Management)
 * REMOVED real-time subscriptions to prevent quota exhaustion
 */

import {
  collection,
  query,
  orderBy,
  Timestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { Project } from '@/types';
import { cachedQuery } from './firebaseCache';

const PROJECTS_COLLECTION = 'projects';

/**
 * REMOVED: subscribeToProjects (deprecated to prevent quota exhaustion)
 * REMOVED: subscribeToActiveProjects (deprecated to prevent quota exhaustion)
 * Use getProjects() with manual polling instead
 */

/**
 * Get all projects (with caching to prevent duplicate reads)
 */
export const getProjects = async (): Promise<Project[]> => {
  return cachedQuery('projects', async () => {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      
      return {
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
      } as Project;
    });
  }, 120000); // Cache for 2 minutes
};

/**
 * Get active projects only (with caching)
 */
export const getActiveProjects = async (): Promise<Project[]> => {
  const allProjects = await getProjects();
  return allProjects.filter(p => p.status === 'active');
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
