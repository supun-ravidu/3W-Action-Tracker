/**
 * Admin Analytics Service
 * Real-time Firebase analytics for admin dashboard
 */

import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface DashboardStats {
  totalTeamMembers: number;
  totalProjects: number;
  totalActions: number;
  activeProjects: number;
  completedActions: number;
  pendingActions: number;
  teamMembersThisMonth: number;
  projectsThisMonth: number;
  actionsThisMonth: number;
}

export interface ActivityItem {
  id: string;
  type: 'team' | 'project' | 'action';
  action: 'created' | 'updated' | 'deleted' | 'completed';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  color: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

/**
 * Get dashboard statistics (non-realtime fetch)
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthTimestamp = Timestamp.fromDate(startOfMonth);

    const teamMembersSnapshot = await getDocs(collection(db, 'teamMembers'));
    
    let thisMonth = 0;
    teamMembersSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.joinDate && data.joinDate >= monthTimestamp) {
        thisMonth++;
      }
    });

    return {
      totalTeamMembers: teamMembersSnapshot.size,
      totalProjects: 12,
      totalActions: 156,
      activeProjects: 8,
      completedActions: 98,
      pendingActions: 58,
      teamMembersThisMonth: thisMonth,
      projectsThisMonth: 3,
      actionsThisMonth: 24,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time dashboard statistics
 * DEPRECATED: Use getDashboardStats() with manual polling instead
 */
export const subscribeToDashboardStats = (
  onUpdate: (stats: DashboardStats) => void,
  onError?: (error: Error) => void
) => {
  let intervalId: NodeJS.Timeout;

  const fetchStats = async () => {
    try {
      const stats = await getDashboardStats();
      onUpdate(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      onError?.(error as Error);
    }
  };

  fetchStats();
  intervalId = setInterval(fetchStats, 120000); // 2 minutes

  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
};

/**
 * Get recent activity (non-realtime fetch)
 */
export const getRecentActivity = async (limit: number = 10): Promise<ActivityItem[]> => {
  try {
    const teamMembersSnapshot = await getDocs(collection(db, 'teamMembers'));
    const activities: ActivityItem[] = [];

    teamMembersSnapshot.forEach((doc) => {
      const data = doc.data();
      const changeTime = data.joinDate?.toDate() || data.updatedAt?.toDate() || new Date();

      activities.push({
        id: doc.id,
        type: 'team',
        action: 'created',
        title: `${data.name} joined the team`,
        description: data.role || 'Team Member',
        timestamp: changeTime,
        user: data.email,
        color: 'bg-green-500',
      });
    });

    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return activities.slice(0, limit);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return [];
  }
};

/**
 * Subscribe to recent activity feed
 * DEPRECATED: Use getRecentActivity() with manual polling instead
 */
export const subscribeToRecentActivity = (
  limit: number = 10,
  onUpdate: (activities: ActivityItem[]) => void,
  onError?: (error: Error) => void
) => {
  let intervalId: NodeJS.Timeout;

  const fetchActivity = async () => {
    try {
      const activities = await getRecentActivity(limit);
      onUpdate(activities);
    } catch (error) {
      console.error('Error fetching activity:', error);
      onError?.(error as Error);
    }
  };

  fetchActivity();
  intervalId = setInterval(fetchActivity, 120000); // 2 minutes

  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
};

/**
 * Get team performance data for charts
 */
export const getTeamPerformanceData = async (): Promise<ChartData[]> => {
  try {
    const teamMembersRef = collection(db, 'teamMembers');
    const snapshot = await getDocs(teamMembersRef);

    const roleCount: Record<string, number> = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      const role = data.role || 'Unknown';
      roleCount[role] = (roleCount[role] || 0) + 1;
    });

    const colors = [
      '#8b5cf6', // purple
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // amber
      '#ef4444', // red
      '#ec4899', // pink
    ];

    return Object.entries(roleCount).map(([role, count], index) => ({
      name: role,
      value: count,
      color: colors[index % colors.length],
    }));
  } catch (error) {
    console.error('Error getting team performance data:', error);
    return [];
  }
};

/**
 * Get project status distribution
 */
export const getProjectStatusData = (): ChartData[] => {
  // Mock data - replace with real Firestore query when projects collection exists
  return [
    { name: 'Active', value: 8, color: '#10b981' },
    { name: 'Planning', value: 2, color: '#3b82f6' },
    { name: 'Completed', value: 1, color: '#8b5cf6' },
    { name: 'On Hold', value: 1, color: '#f59e0b' },
  ];
};

/**
 * Get action priority distribution
 */
export const getActionPriorityData = (): ChartData[] => {
  // Mock data - replace with real Firestore query when actions collection exists
  return [
    { name: 'High', value: 32, color: '#ef4444' },
    { name: 'Medium', value: 78, color: '#f59e0b' },
    { name: 'Low', value: 46, color: '#10b981' },
  ];
};

/**
 * Get monthly activity trend
 */
export const getMonthlyTrendData = (): ChartData[] => {
  // Mock data - replace with real Firestore aggregation
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const values = [45, 52, 61, 73, 68, 82];
  
  return months.map((month, index) => ({
    name: month,
    value: values[index],
  }));
};

/**
 * Calculate growth percentage
 */
export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 100;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * Format relative time
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};
