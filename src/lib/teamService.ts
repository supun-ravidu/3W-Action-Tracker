import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { TeamMember } from '@/types';
import { cachedQuery } from './firebaseCache';

const TEAM_COLLECTION = 'teamMembers';

/**
 * REMOVED: subscribeToTeamMembers (deprecated to prevent quota exhaustion)
 * Use getTeamMembers() with manual polling instead
 */

// Get all team members (with caching to prevent duplicate reads)
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  return cachedQuery('team-members', async () => {
    const q = query(collection(db, TEAM_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        role: data.role,
        department: data.department,
        skills: data.skills || [],
        workload: data.workload || 0,
        availability: {
          status: data.availability?.status || 'available',
          timeOff: data.availability?.timeOff?.map((to: any) => ({
            start: to.start?.toDate ? to.start.toDate() : new Date(to.start),
            end: to.end?.toDate ? to.end.toDate() : new Date(to.end),
            reason: to.reason,
          })) || [],
        },
        timezone: data.timezone,
        bio: data.bio,
        socialLinks: data.socialLinks,
        achievements: data.achievements || [],
        joinedAt: data.joinedAt?.toDate ? data.joinedAt.toDate() : new Date(),
        performanceMetrics: data.performanceMetrics,
      };
    });
  }, 90000); // Cache for 90 seconds
};

// Add a new team member
export const addTeamMember = async (member: Omit<TeamMember, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, TEAM_COLLECTION), {
    ...member,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    achievements: member.achievements || [],
    performanceMetrics: member.performanceMetrics || {
      tasksCompleted: 0,
      averageRating: 0,
      onTimeDelivery: 100,
    },
  });
  return docRef.id;
};

// Update a team member
export const updateTeamMember = async (
  id: string,
  updates: Partial<TeamMember>
): Promise<void> => {
  const docRef = doc(db, TEAM_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// Delete a team member
export const deleteTeamMember = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, TEAM_COLLECTION, id));
};

// Update team member availability
export const updateMemberAvailability = async (
  id: string,
  status: 'available' | 'busy' | 'away' | 'offline'
): Promise<void> => {
  const docRef = doc(db, TEAM_COLLECTION, id);
  await updateDoc(docRef, {
    'availability.status': status,
    updatedAt: serverTimestamp(),
  });
};

// Add achievement to team member
export const addAchievement = async (
  memberId: string,
  achievement: {
    title: string;
    description: string;
    icon: string;
    earnedAt: Date;
  }
): Promise<void> => {
  const docRef = doc(db, TEAM_COLLECTION, memberId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const currentAchievements = docSnap.data().achievements || [];
    await updateDoc(docRef, {
      achievements: [...currentAchievements, achievement],
      updatedAt: serverTimestamp(),
    });
  }
};

// Update performance metrics
export const updatePerformanceMetrics = async (
  memberId: string,
  metrics: {
    tasksCompleted?: number;
    averageRating?: number;
    onTimeDelivery?: number;
  }
): Promise<void> => {
  const docRef = doc(db, TEAM_COLLECTION, memberId);
  const updates: any = {
    updatedAt: serverTimestamp(),
  };
  
  if (metrics.tasksCompleted !== undefined) {
    updates['performanceMetrics.tasksCompleted'] = metrics.tasksCompleted;
  }
  if (metrics.averageRating !== undefined) {
    updates['performanceMetrics.averageRating'] = metrics.averageRating;
  }
  if (metrics.onTimeDelivery !== undefined) {
    updates['performanceMetrics.onTimeDelivery'] = metrics.onTimeDelivery;
  }
  
  await updateDoc(docRef, updates);
};

// Bulk update workload based on action plans
export const syncWorkloadFromActionPlans = async (
  workloadMap: Record<string, number>
): Promise<void> => {
  const promises = Object.entries(workloadMap).map(([memberId, workload]) => {
    const docRef = doc(db, TEAM_COLLECTION, memberId);
    return updateDoc(docRef, {
      workload,
      updatedAt: serverTimestamp(),
    });
  });
  
  await Promise.all(promises);
};
