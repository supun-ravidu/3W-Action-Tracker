import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { TeamMember } from '@/types';
import { cachedQuery } from './firebaseCache';

const REQUESTS_COLLECTION = 'teamMemberRequests';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface TeamMemberRequest {
  id: string;
  memberData: Omit<TeamMember, 'id'>;
  status: RequestStatus;
  requestedAt: Date;
  requestedBy: string; // email or user ID
  processedAt?: Date;
  processedBy?: string;
  rejectionReason?: string;
  priority: 'normal' | 'urgent';
}

/**
 * Submit a request to add a new team member
 */
export const submitTeamMemberRequest = async (
  memberData: Omit<TeamMember, 'id'>,
  requestedBy: string,
  priority: 'normal' | 'urgent' = 'normal'
): Promise<string> => {
  const docRef = await addDoc(collection(db, REQUESTS_COLLECTION), {
    memberData,
    status: 'pending',
    requestedAt: serverTimestamp(),
    requestedBy,
    priority,
  });
  return docRef.id;
};

/**
 * REMOVED: subscribeToPendingRequests (deprecated to prevent quota exhaustion)
 * Use getPendingRequests() with manual polling instead
 */

/**
 * Get pending requests (with caching to prevent duplicate reads)
 */
export const getPendingRequests = async (): Promise<{ success: boolean; data?: TeamMemberRequest[]; error?: string }> => {
  try {
    const data = await cachedQuery('team-requests-pending', async () => {
      const q = query(
        collection(db, REQUESTS_COLLECTION),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);

      const requests = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          memberData: data.memberData,
          status: data.status,
          requestedAt: data.requestedAt?.toDate() || new Date(),
          requestedBy: data.requestedBy,
          processedAt: data.processedAt?.toDate(),
          processedBy: data.processedBy,
          rejectionReason: data.rejectionReason,
          priority: data.priority || 'normal',
        };
      });

      // Sort client-side by requestedAt descending
      return requests.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
    }, 60000); // Cache for 1 minute

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return { success: false, error: String(error) };
  }
};

/**
 * Get all requests (for admin dashboard)
 */
export const getAllRequests = async (): Promise<TeamMemberRequest[]> => {
  const q = query(
    collection(db, REQUESTS_COLLECTION),
    orderBy('requestedAt', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      memberData: data.memberData,
      status: data.status,
      requestedAt: data.requestedAt?.toDate() || new Date(),
      requestedBy: data.requestedBy,
      processedAt: data.processedAt?.toDate(),
      processedBy: data.processedBy,
      rejectionReason: data.rejectionReason,
      priority: data.priority || 'normal',
    };
  });
};

/**
 * Approve a team member request and add to team
 */
export const approveTeamMemberRequest = async (
  requestId: string,
  approvedBy: string
): Promise<string> => {
  try {
    // Get the request document
    const { getDoc } = await import('firebase/firestore');
    const requestDoc = doc(db, REQUESTS_COLLECTION, requestId);
    const requestSnapshot = await getDoc(requestDoc);

    if (!requestSnapshot.exists()) {
      throw new Error('Request not found');
    }

    const requestData = requestSnapshot.data();

    // Add the team member
    const { addTeamMember } = await import('./teamService');
    const memberId = await addTeamMember(requestData.memberData);

    // Update request status
    await updateDoc(requestDoc, {
      status: 'approved',
      processedAt: serverTimestamp(),
      processedBy: approvedBy,
    });

    console.log('✅ Team member request approved:', requestId);
    return memberId;
  } catch (error) {
    console.error('❌ Error approving team member request:', error);
    throw error;
  }
};

/**
 * Reject a team member request
 */
export const rejectTeamMemberRequest = async (
  requestId: string,
  rejectedBy: string,
  reason?: string
): Promise<void> => {
  try {
    const requestDoc = doc(db, REQUESTS_COLLECTION, requestId);
    await updateDoc(requestDoc, {
      status: 'rejected',
      processedAt: serverTimestamp(),
      processedBy: rejectedBy,
      rejectionReason: reason || 'No reason provided',
    });
    console.log('✅ Team member request rejected:', requestId);
  } catch (error) {
    console.error('❌ Error rejecting team member request:', error);
    throw error;
  }
};

/**
 * Delete a request (cleanup)
 */
export const deleteRequest = async (requestId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, REQUESTS_COLLECTION, requestId));
    console.log('✅ Team member request deleted:', requestId);
  } catch (error) {
    console.error('❌ Error deleting team member request:', error);
    throw error;
  }
};

/**
 * REMOVED DUPLICATE - Using cached version above
 */

/**
 * Get pending requests count
 */
export const getPendingRequestsCount = async (): Promise<number> => {
  const q = query(
    collection(db, REQUESTS_COLLECTION),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
};

/**
 * Subscribe to pending requests count
 */
export const subscribeToPendingRequestsCount = (
  callback: (count: number) => void
) => {
  const q = query(
    collection(db, REQUESTS_COLLECTION),
    where('status', '==', 'pending')
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  });
};
