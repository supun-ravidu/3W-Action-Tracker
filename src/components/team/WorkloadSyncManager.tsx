'use client';

import { useEffect } from 'react';
import { useWorkload } from '@/contexts/WorkloadContext';
import { syncTeamMemberWorkload } from '@/lib/teamWorkloadService';

/**
 * This component runs in the background to sync workload data
 * from action plans to team member profiles in Firebase
 * OPTIMIZED: Uses WorkloadContext instead of direct subscriptions
 */
export function WorkloadSyncManager() {
  const { workloads } = useWorkload();

  useEffect(() => {
    // Sync periodically (every 5 minutes) using context data
    const syncInterval = setInterval(async () => {
      try {
        // Sync each team member's workload using data from context
        for (const workload of workloads) {
          await syncTeamMemberWorkload(workload.memberId);
        }
        console.log('✅ Workload sync completed');
      } catch (error) {
        console.error('Periodic sync error:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      clearInterval(syncInterval);
    };
  }, [workloads]);

  // This component renders nothing - it just manages background sync
  return null;
}
