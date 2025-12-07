'use client';

import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminDashboard } from '@/contexts/AdminDashboardContext';

export function PendingRequestsBadge() {
  const { pendingTeamRequests: count } = useAdminDashboard();

  if (count === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="relative inline-flex"
      >
        <Bell className="h-5 w-5" />
        <motion.span
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="absolute -top-1 -right-1"
        >
          <Badge
            variant="destructive"
            className="h-5 w-5 p-0 flex items-center justify-center text-xs font-bold"
          >
            {count > 9 ? '9+' : count}
          </Badge>
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
}
