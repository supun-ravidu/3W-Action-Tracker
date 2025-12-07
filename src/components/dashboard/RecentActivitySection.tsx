'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityLog } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  CheckCircle2,
  Plus,
  Edit,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface RecentActivityProps {
  activities: ActivityLog[];
}

export function RecentActivitySection({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'created':
        return <Plus className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'updated':
        return <Edit className="h-4 w-4 text-yellow-600" />;
      case 'status_changed':
        return <RefreshCw className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'created':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-yellow-100 text-yellow-800';
      case 'status_changed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedActivities = [...activities].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm leading-tight">
                      {activity.actionTitle}
                    </h4>
                    <Badge
                      variant="secondary"
                      className={getActivityColor(activity.type)}
                    >
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{activity.performedBy}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(activity.timestamp, {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      </Card>
    </motion.div>
  );
}
