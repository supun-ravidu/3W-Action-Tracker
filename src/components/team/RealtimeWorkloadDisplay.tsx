'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useWorkload } from '@/contexts/WorkloadContext';
import {
  CheckCircle2,
  Activity,
  Clock,
  XCircle,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function RealtimeWorkloadDisplay() {
  const { workloads, loading } = useWorkload();
  const [lastUpdate] = useState<Date>(new Date());

  const totalDone = workloads.reduce((sum, w) => sum + w.taskCounts.done, 0);
  const totalActive = workloads.reduce((sum, w) => sum + w.taskCounts.active, 0);
  const totalPending = workloads.reduce((sum, w) => sum + w.taskCounts.pending, 0);
  const totalBlocked = workloads.reduce((sum, w) => sum + w.taskCounts.blocked, 0);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-time Workload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Real-time Team Workload
            </CardTitle>
            <CardDescription>
              Live updates from Firebase • Last updated: {lastUpdate.toLocaleTimeString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CheckCircle2 className="h-5 w-5 text-green-600 mb-2" />
            <p className="text-sm font-medium text-green-700">Done</p>
            <p className="text-2xl font-bold">{totalDone}</p>
          </div>

          <div className="p-4 rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <Activity className="h-5 w-5 text-blue-600 mb-2" />
            <p className="text-sm font-medium text-blue-700">Active</p>
            <p className="text-2xl font-bold">{totalActive}</p>
          </div>

          <div className="p-4 rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
            <Clock className="h-5 w-5 text-amber-600 mb-2" />
            <p className="text-sm font-medium text-amber-700">Pending</p>
            <p className="text-2xl font-bold">{totalPending}</p>
          </div>

          <div className="p-4 rounded-lg border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100">
            <XCircle className="h-5 w-5 text-red-600 mb-2" />
            <p className="text-sm font-medium text-red-700">Blocked</p>
            <p className="text-2xl font-bold">{totalBlocked}</p>
          </div>
        </div>

        {/* Team Members List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Team Members ({workloads.length})</h3>
          <div className="grid gap-3">
            {workloads.map((member, index) => (
              <motion.div
                key={member.memberId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg border-2 hover:border-primary hover:shadow-md transition-all bg-gradient-to-r from-white to-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <img
                      src={
                        member.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.memberName}`
                      }
                      alt={member.memberName}
                    />
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{member.memberName}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.role || 'Team Member'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          {member.taskCounts.total}
                        </p>
                        <p className="text-xs text-muted-foreground">tasks</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        {member.taskCounts.done}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Activity className="h-3 w-3 text-blue-600" />
                        {member.taskCounts.active}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3 text-amber-600" />
                        {member.taskCounts.pending}
                      </Badge>
                      {member.taskCounts.blocked > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          {member.taskCounts.blocked}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {workloads.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No team members found</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <RefreshCw className="h-3 w-3" />
            Updates automatically when tasks change in Firebase
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
