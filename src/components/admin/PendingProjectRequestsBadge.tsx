'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useAdminDashboard } from '@/contexts/AdminDashboardContext';

export function PendingProjectRequestsBadge() {
  const { pendingProjectRequests: count } = useAdminDashboard();

  if (count === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500 }}
    >
      <Badge
        variant="destructive"
        className="ml-2 animate-pulse"
      >
        {count}
      </Badge>
    </motion.div>
  );
}
