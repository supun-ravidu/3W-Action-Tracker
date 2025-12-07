'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Activity,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkload } from '@/contexts/WorkloadContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function MyWorkloadWidget() {
  const { user } = useAuth();
  const { workloads, loading, refetch } = useWorkload();

  if (!user) return null;

  const myWorkload = workloads.find(w => w.email === user.email);
  
  if (!myWorkload) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="pt-6 text-center">
          <Activity className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No tasks assigned yet</p>
        </CardContent>
      </Card>
    );
  }

  const { taskCounts } = myWorkload;
  const completionRate = taskCounts.total > 0 
    ? (taskCounts.done / taskCounts.total) * 100 
    : 0;

  const getStatusColor = () => {
    if (taskCounts.blocked > 0) return 'text-red-500';
    if (taskCounts.pending > 5) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (taskCounts.blocked > 0) return AlertTriangle;
    if (completionRate > 70) return TrendingUp;
    return Activity;
  };

  const StatusIcon = getStatusIcon();

  return (
    <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50" />
      
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Zap className="h-5 w-5 text-purple-600" />
              </motion.div>
              My Workload
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Live updates every 60s
            </CardDescription>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Completion Progress</span>
            <span className={cn("text-2xl font-bold", getStatusColor())}>
              {completionRate.toFixed(0)}%
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Task Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 rounded-lg p-3 space-y-1"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{taskCounts.done}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 rounded-lg p-3 space-y-1"
          >
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-muted-foreground">Active</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{taskCounts.active}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 rounded-lg p-3 space-y-1"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-xs font-medium text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{taskCounts.pending}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 rounded-lg p-3 space-y-1"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-xs font-medium text-muted-foreground">Blocked</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{taskCounts.blocked}</p>
          </motion.div>
        </div>

        {/* Status Message */}
        <div className={cn(
          "rounded-lg p-3 text-sm font-medium flex items-center gap-2",
          taskCounts.blocked > 0 
            ? "bg-red-50 text-red-700 border border-red-200" 
            : completionRate > 70 
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-blue-50 text-blue-700 border border-blue-200"
        )}>
          <StatusIcon className="h-4 w-4" />
          {taskCounts.blocked > 0 
            ? `${taskCounts.blocked} blocked task${taskCounts.blocked > 1 ? 's' : ''} need attention`
            : completionRate > 70
            ? "Great progress! Keep it up!"
            : `${taskCounts.total} total tasks to complete`
          }
        </div>

        {/* Total Tasks */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Tasks</span>
            <span className="font-bold text-lg">{taskCounts.total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
