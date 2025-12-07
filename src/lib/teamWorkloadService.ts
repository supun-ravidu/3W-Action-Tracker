import {
  collection,
  query,
  getDocs,
  where,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { ActionPlan, TeamMember } from '@/types';
import { cachedQuery } from './firebaseCache';

export interface TeamMemberWorkload {
  memberId: string;
  memberName: string;
  email: string;
  avatar?: string;
  role?: string;
  department?: string;
  taskCounts: {
    done: number;
    active: number;
    pending: number;
    blocked: number;
    total: number;
  };
  recentTasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
  }[];
}

const ACTION_PLANS_COLLECTION = 'actionPlans';
const TEAM_COLLECTION = 'teamMembers';

/**
 * REMOVED: subscribeToTeamWorkload (deprecated to prevent quota exhaustion)
 * Use getTeamWorkload() with manual polling instead
 */

/**
 * Get team workload data (with caching to prevent duplicate reads)
 */
export const getTeamWorkload = async (): Promise<TeamMemberWorkload[]> => {
  return cachedQuery('team-workload', async () => {
    const [actionsSnapshot, teamSnapshot] = await Promise.all([
      getDocs(query(collection(db, ACTION_PLANS_COLLECTION))),
      getDocs(query(collection(db, TEAM_COLLECTION)))
    ]);

    const actionsData: ActionPlan[] = actionsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
      } as ActionPlan;
    });

    const teamData: (TeamMember & { storedTaskCounts?: any })[] = teamSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        role: data.role,
        department: data.department,
        storedTaskCounts: data.taskCounts, // Get admin-edited task counts from Firebase
      } as TeamMember & { storedTaskCounts?: any };
    });

    return teamData.map((member) => {
      const memberActions = actionsData.filter(
        (action) => action.who?.primaryAssignee?.id === member.id
      );

      // Calculate task counts from action plans (fallback)
      const calculatedDone = memberActions.filter((a) => a.status === 'completed').length;
      const calculatedActive = memberActions.filter((a) => a.status === 'in-progress').length;
      const calculatedPending = memberActions.filter((a) => a.status === 'pending').length;
      const calculatedBlocked = memberActions.filter((a) => a.status === 'blocked').length;

      // Use stored task counts if available (admin-edited), otherwise use calculated counts
      const taskCounts = member.storedTaskCounts ? {
        done: member.storedTaskCounts.done || 0,
        active: member.storedTaskCounts.active || 0,
        pending: member.storedTaskCounts.pending || 0,
        blocked: member.storedTaskCounts.blocked || 0,
        total: member.storedTaskCounts.total || 0,
      } : {
        done: calculatedDone,
        active: calculatedActive,
        pending: calculatedPending,
        blocked: calculatedBlocked,
        total: calculatedDone + calculatedActive + calculatedPending + calculatedBlocked,
      };

      const recentTasks = memberActions
        .sort((a, b) => {
          const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt);
          const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 5)
        .map((action) => ({
          id: action.id,
          title: action.title,
          status: action.status,
          priority: action.priority,
        }));

      return {
        memberId: member.id,
        memberName: member.name,
        email: member.email,
        avatar: member.avatar,
        role: member.role,
        department: member.department,
        taskCounts,
        recentTasks,
      };
    });
  }, 90000);
};

/**
 * Get workload data for a specific team member
 */
export const getTeamMemberWorkload = async (
  memberId: string
): Promise<TeamMemberWorkload | null> => {
  try {
    // Get team member
    const teamSnapshot = await getDocs(
      query(collection(db, TEAM_COLLECTION), where('__name__', '==', memberId))
    );

    if (teamSnapshot.empty) {
      return null;
    }

    const memberDoc = teamSnapshot.docs[0];
    const memberData = memberDoc.data();

    // Get member's actions
    const actionsSnapshot = await getDocs(
      query(
        collection(db, ACTION_PLANS_COLLECTION),
        where('who.primaryAssignee.id', '==', memberId)
      )
    );

    const memberActions: ActionPlan[] = actionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ActionPlan));

    // Count by status
    const done = memberActions.filter((a) => a.status === 'completed').length;
    const active = memberActions.filter((a) => a.status === 'in-progress').length;
    const pending = memberActions.filter((a) => a.status === 'pending').length;
    const blocked = memberActions.filter((a) => a.status === 'blocked').length;

    // Get recent tasks
    const recentTasks = memberActions
      .sort((a, b) => {
        const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt);
        const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5)
      .map((action) => ({
        id: action.id,
        title: action.title,
        status: action.status,
        priority: action.priority,
      }));

    return {
      memberId: memberDoc.id,
      memberName: memberData.name,
      email: memberData.email,
      avatar: memberData.avatar,
      role: memberData.role,
      department: memberData.department,
      taskCounts: {
        done,
        active,
        pending,
        blocked,
        total: done + active + pending + blocked,
      },
      recentTasks,
    };
  } catch (error) {
    console.error('Error getting team member workload:', error);
    return null;
  }
};

/**
 * Update team member workload in their profile
 * (This keeps the workload field in sync with actual task counts)
 */
export const syncTeamMemberWorkload = async (memberId: string): Promise<void> => {
  try {
    const workload = await getTeamMemberWorkload(memberId);
    if (!workload) return;

    const memberRef = doc(db, TEAM_COLLECTION, memberId);
    await updateDoc(memberRef, {
      workload: workload.taskCounts.total,
      taskCounts: workload.taskCounts,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error syncing team member workload:', error);
  }
};

/**
 * Manually update team member task counts
 * (For admin override/adjustment)
 */
export const updateTeamMemberTaskCounts = async (
  memberId: string,
  taskCounts: {
    done: number;
    active: number;
    pending: number;
    blocked: number;
  }
): Promise<{ success: boolean; error?: any }> => {
  try {
    const memberRef = doc(db, TEAM_COLLECTION, memberId);
    const total = taskCounts.done + taskCounts.active + taskCounts.pending + taskCounts.blocked;
    
    await updateDoc(memberRef, {
      taskCounts: {
        ...taskCounts,
        total,
      },
      workload: total,
      updatedAt: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating team member task counts:', error);
    return { success: false, error };
  }
};

/**
 * Get aggregated workload statistics from local workload data
 * Optimized to avoid extra Firebase reads
 */
export const getWorkloadStatistics = (workloads: TeamMemberWorkload[]) => {
  if (!workloads || workloads.length === 0) {
    return {
      totalMembers: 0,
      totalTasks: 0,
      averageTasksPerMember: '0',
      tasksByStatus: {
        done: 0,
        active: 0,
        pending: 0,
        blocked: 0,
      },
      completionRate: '0',
      averageCompletion: 0,
    };
  }

  const totalMembers = workloads.length;
  
  let totalDone = 0;
  let totalActive = 0;
  let totalPending = 0;
  let totalBlocked = 0;

  workloads.forEach((workload) => {
    totalDone += workload.taskCounts.done;
    totalActive += workload.taskCounts.active;
    totalPending += workload.taskCounts.pending;
    totalBlocked += workload.taskCounts.blocked;
  });

  const totalTasks = totalDone + totalActive + totalPending + totalBlocked;

  return {
    totalMembers,
    totalTasks,
    averageTasksPerMember: totalMembers > 0 ? (totalTasks / totalMembers).toFixed(1) : '0',
    tasksByStatus: {
      done: totalDone,
      active: totalActive,
      pending: totalPending,
      blocked: totalBlocked,
    },
    completionRate:
      totalTasks > 0 ? ((totalDone / totalTasks) * 100).toFixed(1) : '0',
    averageCompletion:
      totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0,
  };
};

/**
 * Delete a team member and optionally unassign their tasks
 */
export const deleteTeamMember = async (
  memberId: string,
  unassignTasks: boolean = true
): Promise<{ success: boolean; error?: any }> => {
  try {
    const batch = writeBatch(db);

    // Delete the team member document
    const memberRef = doc(db, TEAM_COLLECTION, memberId);
    batch.delete(memberRef);

    // If unassignTasks is true, unassign all tasks assigned to this member
    if (unassignTasks) {
      const actionsSnapshot = await getDocs(
        query(
          collection(db, ACTION_PLANS_COLLECTION),
          where('who.primaryAssignee.id', '==', memberId)
        )
      );

      actionsSnapshot.docs.forEach((actionDoc) => {
        const actionRef = doc(db, ACTION_PLANS_COLLECTION, actionDoc.id);
        batch.update(actionRef, {
          'who.primaryAssignee': null,
          updatedAt: serverTimestamp(),
        });
      });
    }

    // Commit the batch
    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error('Error deleting team member:', error);
    return { success: false, error };
  }
};

/**
 * Bulk delete multiple team members
 */
export const bulkDeleteTeamMembers = async (
  memberIds: string[],
  unassignTasks: boolean = true
): Promise<{ success: boolean; deletedCount: number; error?: any }> => {
  try {
    let deletedCount = 0;

    // Process in batches of 500 (Firestore batch limit)
    for (let i = 0; i < memberIds.length; i += 500) {
      const batchIds = memberIds.slice(i, i + 500);
      const batch = writeBatch(db);

      for (const memberId of batchIds) {
        const memberRef = doc(db, TEAM_COLLECTION, memberId);
        batch.delete(memberRef);

        if (unassignTasks) {
          const actionsSnapshot = await getDocs(
            query(
              collection(db, ACTION_PLANS_COLLECTION),
              where('who.primaryAssignee.id', '==', memberId)
            )
          );

          actionsSnapshot.docs.forEach((actionDoc) => {
            const actionRef = doc(db, ACTION_PLANS_COLLECTION, actionDoc.id);
            batch.update(actionRef, {
              'who.primaryAssignee': null,
              updatedAt: serverTimestamp(),
            });
          });
        }

        deletedCount++;
      }

      await batch.commit();
    }

    return { success: true, deletedCount };
  } catch (error) {
    console.error('Error bulk deleting team members:', error);
    return { success: false, deletedCount: 0, error };
  }
};;
