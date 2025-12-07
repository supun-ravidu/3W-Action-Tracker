'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CycleTimeMetrics, Priority } from '@/types';
import { Clock, TrendingUp, Users, Zap } from 'lucide-react';

interface CycleTimeAnalysisProps {
  metrics: CycleTimeMetrics;
  teamMembers: { id: string; name: string; avatar?: string }[];
}

export function CycleTimeAnalysisComponent({ metrics, teamMembers }: CycleTimeAnalysisProps) {
  const formatDays = (days: number) => {
    if (days < 1) return `${(days * 24).toFixed(1)} hours`;
    return `${days.toFixed(1)} days`;
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  // Get team member details
  const getMemberName = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member?.name || 'Unknown';
  };

  // Sort assignees by cycle time
  const sortedAssignees = Object.entries(metrics.byAssignee)
    .map(([id, time]) => ({ id, time, name: getMemberName(id) }))
    .sort((a, b) => a.time - b.time);

  // Calculate max for bar chart scaling
  const maxCycleTime = Math.max(...Object.values(metrics.byPriority), metrics.averageCycleTime);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Cycle Time Analysis
        </CardTitle>
        <CardDescription>
          Time taken from task creation to completion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
            <div className="text-sm text-muted-foreground mb-1">Average Cycle Time</div>
            <div className="text-3xl font-bold text-blue-600">
              {formatDays(metrics.averageCycleTime)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Overall average</div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Median Time</div>
            <div className="text-2xl font-bold">{formatDays(metrics.median)}</div>
            <div className="text-xs text-muted-foreground mt-1">50th percentile</div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">90th Percentile</div>
            <div className="text-2xl font-bold text-orange-600">{formatDays(metrics.percentile90)}</div>
            <div className="text-xs text-muted-foreground mt-1">Longest 10%</div>
          </div>
        </div>

        {/* Cycle Time by Priority */}
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Cycle Time by Priority
          </h4>
          <div className="space-y-3">
            {(['critical', 'high', 'medium', 'low'] as Priority[]).map((priority) => {
              const time = metrics.byPriority[priority];
              const barWidth = time > 0 ? (time / maxCycleTime) * 100 : 0;

              return (
                <div key={priority} className={`rounded-lg border p-3 ${getPriorityColor(priority)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{priority} Priority</span>
                    <Badge variant="outline" className="font-bold">
                      {formatDays(time)}
                    </Badge>
                  </div>
                  <div className="relative h-4 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        priority === 'critical' ? 'bg-red-600' :
                        priority === 'high' ? 'bg-orange-600' :
                        priority === 'medium' ? 'bg-yellow-600' :
                        'bg-green-600'
                      } rounded-full transition-all duration-500`}
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                  {time > metrics.averageCycleTime && (
                    <div className="text-xs mt-1 opacity-75">
                      {((time / metrics.averageCycleTime - 1) * 100).toFixed(0)}% above average
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cycle Time by Team Member */}
        {sortedAssignees.length > 0 && (
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Cycle Time by Team Member
            </h4>
            <div className="space-y-3">
              {sortedAssignees.map((assignee, index) => {
                const barWidth = (assignee.time / maxCycleTime) * 100;
                const isFastest = index === 0;
                const isSlowest = index === sortedAssignees.length - 1;

                return (
                  <div key={assignee.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{assignee.name}</span>
                        {isFastest && sortedAssignees.length > 1 && (
                          <Badge variant="default" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Fastest
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline">{formatDays(assignee.time)}</Badge>
                    </div>
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFastest ? 'bg-green-600' :
                          isSlowest && sortedAssignees.length > 2 ? 'bg-orange-600' :
                          'bg-blue-600'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                    {assignee.time !== metrics.averageCycleTime && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {assignee.time < metrics.averageCycleTime ? (
                          <span className="text-green-600">
                            {((1 - assignee.time / metrics.averageCycleTime) * 100).toFixed(0)}% faster than average
                          </span>
                        ) : (
                          <span className="text-orange-600">
                            {((assignee.time / metrics.averageCycleTime - 1) * 100).toFixed(0)}% slower than average
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Trend Chart */}
        <div>
          <h4 className="font-semibold mb-4">12-Month Trend</h4>
          <div className="space-y-2">
            {metrics.trend.map((item, index) => {
              const barHeight = item.value > 0 ? (item.value / Math.max(...metrics.trend.map(t => t.value))) * 100 : 0;
              const isRecent = index >= metrics.trend.length - 3;

              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 text-sm text-muted-foreground">{item.label}</div>
                  <div className="flex-1 relative h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isRecent ? 'bg-blue-600' : 'bg-blue-400'} rounded-full transition-all duration-500`}
                      style={{ width: `${barHeight}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-sm font-medium text-right">
                    {formatDays(item.value)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="rounded-lg bg-muted p-4">
          <h4 className="font-semibold mb-2">Cycle Time Insights</h4>
          <ul className="space-y-2 text-sm">
            {metrics.byPriority.critical > metrics.averageCycleTime * 1.5 && (
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-red-600 mt-0.5" />
                <span>Critical priority tasks are taking significantly longer than average. Review resource allocation.</span>
              </li>
            )}
            {metrics.percentile90 > metrics.averageCycleTime * 2 && (
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                <span>10% of tasks take more than twice the average time. Identify common bottlenecks.</span>
              </li>
            )}
            {sortedAssignees.length > 1 && sortedAssignees[sortedAssignees.length - 1].time > sortedAssignees[0].time * 2 && (
              <li className="flex items-start gap-2">
                <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>Significant variation in cycle times across team members. Consider mentoring or workload balancing.</span>
              </li>
            )}
            {metrics.averageCycleTime < 3 && (
              <li className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Excellent cycle time! Team is completing tasks efficiently.</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
