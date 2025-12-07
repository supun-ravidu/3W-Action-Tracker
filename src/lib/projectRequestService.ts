/**
 * Project Request Service
 * Handles project creation approval workflow
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { cachedQuery } from './firebaseCache';

export interface ProjectRequest {
  id?: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  workspace: string;
  startDate: Date;
  targetEndDate: Date;
  budget?: {
    allocated: number;
    spent: number;
    currency: string;
  };
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: {
    id: string;
    name: string;
    email: string;
  };
  requestedAt: Date;
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  };
  reviewedAt?: Date;
  rejectionReason?: string;
}

const COLLECTION_NAME = 'projectRequests';

/**
 * Submit a new project creation request
 */
export const submitProjectRequest = async (
  projectData: Omit<ProjectRequest, 'id' | 'status' | 'requestedAt' | 'reviewedBy' | 'reviewedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const requestData = {
      ...projectData,
      startDate: Timestamp.fromDate(projectData.startDate),
      targetEndDate: Timestamp.fromDate(projectData.targetEndDate),
      status: 'pending',
      requestedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), requestData);

    console.log('✅ Project request submitted:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error submitting project request:', error);
    return { success: false, error: (error as Error).message };
  }
};

/**
 * REMOVED: subscribeToPendingProjectRequests (deprecated to prevent quota exhaustion)
 * Use getPendingProjectRequests() with manual polling instead
 */

/**
 * Get pending project requests (with caching to prevent duplicate reads)
 */
export const getPendingProjectRequests = async (): Promise<{ 
  success: boolean; 
  data?: ProjectRequest[]; 
  error?: string 
}> => {
  try {
    return {
      success: true,
      data: await cachedQuery('project-requests-pending', async () => {
        const q = query(
          collection(db, COLLECTION_NAME),
          where('status', '==', 'pending')
        );

        const snapshot = await getDocs(q);
        
        const requests: ProjectRequest[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            icon: data.icon,
            color: data.color,
            workspace: data.workspace,
            startDate: data.startDate?.toDate() || new Date(),
            targetEndDate: data.targetEndDate?.toDate() || new Date(),
            budget: data.budget,
            tags: data.tags || [],
            status: data.status,
            requestedBy: data.requestedBy,
            requestedAt: data.requestedAt?.toDate() || new Date(),
            reviewedBy: data.reviewedBy,
            reviewedAt: data.reviewedAt?.toDate(),
            rejectionReason: data.rejectionReason,
          };
        });

        // Sort by requestedAt descending
        return requests.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
      }, 60000) // Cache for 1 minute
    };
  } catch (error) {
    console.error('❌ Error getting project requests:', error);
    return { success: false, error: (error as Error).message };
  }
};

/**
 * Approve a project request and create the actual project
 */
export const approveProjectRequest = async (
  requestId: string,
  adminUser: { id: string; name: string; email: string }
): Promise<{ success: boolean; projectId?: string; error?: string }> => {
  try {
    const requestRef = doc(db, COLLECTION_NAME, requestId);

    // Get the request data to create the project
    const { addProjectToFirestore } = await import('./firestoreUtils');
    
    // Fetch the request document
    const requestDoc = await import('firebase/firestore').then(m => m.getDoc(requestRef));
    
    if (!requestDoc.exists()) {
      return { success: false, error: 'Request not found' };
    }

    const requestData = requestDoc.data();

    // Create the actual project
    const projectData = {
      name: requestData.name,
      description: requestData.description,
      icon: requestData.icon,
      color: requestData.color,
      workspace: requestData.workspace,
      startDate: requestData.startDate?.toDate() || new Date(),
      targetEndDate: requestData.targetEndDate?.toDate() || new Date(),
      budget: requestData.budget,
      tags: requestData.tags || [],
      actionPlans: [],
      teamMembers: [],
      lead: requestData.requestedBy,
      status: 'active' as const,
      dependencies: [],
    };

    const result = await addProjectToFirestore(projectData);

    if (result.success && result.id) {
      // Update the request status
      await updateDoc(requestRef, {
        status: 'approved',
        reviewedBy: adminUser,
        reviewedAt: serverTimestamp(),
      });

      console.log('✅ Project request approved and project created:', result.id);
      return { success: true, projectId: result.id };
    }

    return { success: false, error: 'Failed to create project' };
  } catch (error) {
    console.error('❌ Error approving project request:', error);
    return { success: false, error: (error as Error).message };
  }
};

/**
 * Reject a project request
 */
export const rejectProjectRequest = async (
  requestId: string,
  adminUser: { id: string; name: string; email: string },
  reason?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const requestRef = doc(db, COLLECTION_NAME, requestId);

    await updateDoc(requestRef, {
      status: 'rejected',
      reviewedBy: adminUser,
      reviewedAt: serverTimestamp(),
      rejectionReason: reason || 'No reason provided',
    });

    console.log('✅ Project request rejected:', requestId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error rejecting project request:', error);
    return { success: false, error: (error as Error).message };
  }
};

/**
 * Delete a project request (cleanup after approval/rejection)
 */
export const deleteProjectRequest = async (
  requestId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const requestRef = doc(db, COLLECTION_NAME, requestId);
    await deleteDoc(requestRef);

    console.log('✅ Project request deleted:', requestId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting project request:', error);
    return { success: false, error: (error as Error).message };
  }
};

/**
 * Get pending project requests (non-realtime fetch)
 */
export const getPendingProjectRequests = async (): Promise<{ success: boolean; data?: ProjectRequest[]; error?: string }> => {
  try {
    const { getDocs } = await import('firebase/firestore');
    // Remove orderBy to avoid composite index requirement - sort client-side instead
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    
    const requests: ProjectRequest[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
        workspace: data.workspace,
        startDate: data.startDate?.toDate() || new Date(),
        targetEndDate: data.targetEndDate?.toDate() || new Date(),
        budget: data.budget,
        tags: data.tags || [],
        status: data.status,
        requestedBy: data.requestedBy,
        requestedAt: data.requestedAt?.toDate() || new Date(),
        reviewedBy: data.reviewedBy,
        reviewedAt: data.reviewedAt?.toDate(),
        rejectionReason: data.rejectionReason,
      };
    });
    
    // Sort client-side by requestedAt descending
    requests.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
    
    return { success: true, data: requests };
  } catch (error) {
    console.error('❌ Error getting pending requests:', error);
    return { success: false, error: (error as Error).message };
  }
};

/**
 * Get count of pending project requests
 */
export const getPendingProjectRequestsCount = async (): Promise<number> => {
  try {
    const { getDocs } = await import('firebase/firestore');
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('❌ Error getting pending count:', error);
    return 0;
  }
};

/**
 * REMOVED: subscribeToProjectRequestCount (deprecated to prevent quota exhaustion)
 * Use getProjectRequestCount() with manual polling instead
 */

/**
 * Get project request count (with caching)
 */
export const getProjectRequestCount = async (): Promise<number> => {
  const result = await getPendingProjectRequests();
  return result.success && result.data ? result.data.length : 0;
};
