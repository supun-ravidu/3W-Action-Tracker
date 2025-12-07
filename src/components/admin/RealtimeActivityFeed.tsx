'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityItem, formatRelativeTime } from '@/lib/adminAnalyticsService';
import { Users, FolderKanban, CheckCircle2, Clock } from 'lucide-react';

interface RealtimeActivityFeedProps {
  activities: ActivityItem[];
}

export function RealtimeActivityFeed({ activities }: RealtimeActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'team':
        return Users;
      case 'project':
        return FolderKanban;
      case 'action':
        return CheckCircle2;
      default:
        return Clock;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              Recent Activity
            </CardTitle>
            <CardDescription>Real-time updates from your workspace</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-2 w-2 rounded-full bg-green-500"
            />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {activities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-gray-400"
              >
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No recent activity</p>
              </motion.div>
            ) : (
              activities.map((activity, index) => {
                const Icon = getIcon(activity.type);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    {/* Activity indicator */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: index * 0.05 + 0.1 }}
                      className={`h-8 w-8 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </motion.div>
                    
                    {/* Activity content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                    
                    {/* Action badge */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize"
                    >
                      {activity.action}
                    </motion.div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
