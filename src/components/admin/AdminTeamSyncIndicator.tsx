'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, Users, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTeamMembers } from '@/contexts/TeamMembersContext';

interface SyncEvent {
  id: string;
  type: 'member_added';
  memberName: string;
  timestamp: Date;
}

export function AdminTeamSyncIndicator() {
  const [syncEvents, setSyncEvents] = useState<SyncEvent[]>([]);
  const [previousCount, setPreviousCount] = useState(0);
  const { members, count: teamCount } = useTeamMembers();

  useEffect(() => {
    // Detect new member addition
    if (teamCount > previousCount && previousCount > 0) {
      const newMember = members[members.length - 1];
      const newEvent: SyncEvent = {
        id: `sync-${Date.now()}`,
        type: 'member_added',
        memberName: newMember.name,
        timestamp: new Date(),
      };

      setSyncEvents((prev) => [newEvent, ...prev].slice(0, 3));

      // Remove event after 8 seconds
      setTimeout(() => {
        setSyncEvents((prev) => prev.filter((e) => e.id !== newEvent.id));
      }, 8000);
    }
    
    setPreviousCount(teamCount);
  }, [teamCount, members, previousCount]);

  if (syncEvents.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {syncEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ zIndex: 50 - index }}
          >
            <Card className="w-[400px] border-2 border-green-500 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/90 dark:via-emerald-950/90 dark:to-teal-950/90 shadow-2xl">
              <div className="p-4">
                {/* Header with animated icon */}
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <Zap className="h-5 w-5 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="font-bold text-green-900 dark:text-green-100 flex items-center gap-2">
                      Live Sync Active
                      <Badge className="bg-green-600 text-white">Real-time</Badge>
                    </h4>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Team page updated instantly
                    </p>
                  </div>
                </div>

                {/* Sync Flow Animation */}
                <div className="flex items-center justify-between bg-white/80 dark:bg-black/20 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900">
                      <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Admin Approved
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[100px]">
                        {event.memberName}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="h-6 w-6 text-green-600" />
                  </motion.div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900">
                      <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Team Page
                      </p>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">
                        +1 Member
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <motion.div
                  className="mt-3 h-1 bg-green-200 dark:bg-green-900 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 8, ease: 'linear' }}
                  />
                </motion.div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
