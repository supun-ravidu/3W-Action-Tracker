'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Zap,
  BarChart3
} from 'lucide-react';
import { useWorkload } from '@/contexts/WorkloadContext';
import { useTeamMembers } from '@/contexts/TeamMembersContext';
import { useAdminDashboard } from '@/contexts/AdminDashboardContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function CurrentWorkloadWidget() {
  const { workloads, statistics, loading, refetch } = useWorkload();
  const { count: teamCount } = useTeamMembers();
  const { pendingTeamRequests, pendingProjectRequests, lastUpdate: adminLastUpdate, refetch: refetchAdmin } = useAdminDashboard();

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchAdmin()]);
  };

  const getWorkloadColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getWorkloadBadge = (percentage: number) => {
    if (percentage >= 80) return { variant: 'destructive' as const, label: 'High Load', icon: AlertCircle };
    if (percentage >= 60) return { variant: 'default' as const, label: 'Moderate', icon: Activity };
    return { variant: 'secondary' as const, label: 'Healthy', icon: CheckCircle2 };
  };

  const topWorkloadMembers = [...workloads]
    .sort((a, b) => b.taskCounts.total - a.taskCounts.total)
    .slice(0, 3);

  const averageWorkload = statistics?.averageTasksPerMember ? parseFloat(statistics.averageTasksPerMember) : 0;
  const totalActiveTasks = statistics?.totalTasks || 0;
  const workloadPercentage = teamCount > 0 ? Math.min((averageWorkload / 20) * 100, 100) : 0;

  const badge = getWorkloadBadge(workloadPercentage);
  const BadgeIcon = badge.icon;

  return (
    <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 opacity-50" />
      
      {/* Content */}
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </motion.div>
              Current Workload
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              {adminLastUpdate ? (
                <span>Updated {formatDistanceToNow(adminLastUpdate, { addSuffix: true })}</span>
              ) : (
                <span>Loading...</span>
              )}
            </CardDescription>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Overall Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={badge.variant} className="gap-1">
                <BadgeIcon className="h-3 w-3" />
                {badge.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {totalActiveTasks} active tasks
              </span>
            </div>
            <span className={cn("text-2xl font-bold", getWorkloadColor(workloadPercentage))}>
              {workloadPercentage.toFixed(0)}%
            </span>
          </div>
          
          <Progress value={workloadPercentage} className="h-3" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Users className="h-4 w-4 text-blue-500" />
                <p className="text-2xl font-bold text-blue-600">{teamCount}</p>
              </div>
              <p className="text-xs text-muted-foreground">Team Members</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Activity className="h-4 w-4 text-green-500" />
                <p className="text-2xl font-bold text-green-600">{averageWorkload.toFixed(1)}</p>
              </div>
              <p className="text-xs text-muted-foreground">Avg Tasks/Member</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Zap className="h-4 w-4 text-purple-500" />
                <p className="text-2xl font-bold text-purple-600">{totalActiveTasks}</p>
              </div>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </div>
          </div>
        </div>

        {/* Pending Requests Alert */}
        {(pendingTeamRequests > 0 || pendingProjectRequests > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-amber-50 border border-amber-200 p-3"
          >
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {pendingTeamRequests} team + {pendingProjectRequests} project requests pending
              </span>
            </div>
          </motion.div>
        )}

        {/* Top Contributors */}
        {topWorkloadMembers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Contributors
            </h4>
            <div className="space-y-2">
              <AnimatePresence>
                {topWorkloadMembers.map((member, index) => {
                  const completionRate = member.taskCounts.total > 0 
                    ? (member.taskCounts.done / member.taskCounts.total) * 100 
                    : 0;
                  
                  return (
                    <motion.div
                      key={member.memberId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                          index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.memberName}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.taskCounts.total} tasks • {completionRate.toFixed(0)}% complete
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {member.taskCounts.done > 0 && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            {member.taskCounts.done}
                          </Badge>
                        )}
                        {member.taskCounts.active > 0 && (
                          <Badge variant="default" className="text-xs gap-1">
                            <Activity className="h-3 w-3" />
                            {member.taskCounts.active}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
