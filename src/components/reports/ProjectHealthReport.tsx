'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProjectHealthMetrics } from '@/types';
import { Activity, TrendingUp, TrendingDown, Minus, AlertTriangle, Calendar, Clock } from 'lucide-react';

interface ProjectHealthReportProps {
  metrics: ProjectHealthMetrics;
}

export function ProjectHealthReport({ metrics }: ProjectHealthReportProps) {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return { label: 'Low Risk', variant: 'default' as const, color: 'bg-green-600' };
      case 'medium':
        return { label: 'Medium Risk', variant: 'secondary' as const, color: 'bg-yellow-600' };
      case 'high':
        return { label: 'High Risk', variant: 'outline' as const, color: 'bg-orange-600' };
      case 'critical':
        return { label: 'Critical Risk', variant: 'destructive' as const, color: 'bg-red-600' };
      default:
        return { label: 'Unknown', variant: 'outline' as const, color: 'bg-gray-600' };
    }
  };

  const getVelocityIcon = (velocity: string) => {
    switch (velocity) {
      case 'increasing':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-yellow-600" />;
    }
  };

  const riskBadge = getRiskBadge(metrics.riskLevel);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Project Health Report
        </CardTitle>
        <CardDescription>
          Overall project status and health indicators
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Health Score */}
        <div className="rounded-lg border-2 p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Overall Progress</div>
              <div className="text-4xl font-bold">{metrics.overallProgress.toFixed(1)}%</div>
            </div>
            <Badge variant={riskBadge.variant} className="text-sm">
              {riskBadge.label}
            </Badge>
          </div>
          <Progress value={metrics.overallProgress} className="h-3 mb-2" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {getVelocityIcon(metrics.velocityTrend)}
            <span className="capitalize">{metrics.velocityTrend} velocity trend</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</span>
            </div>
            <div className="text-2xl font-bold">{metrics.upcomingDeadlines}</div>
            <div className="text-xs text-muted-foreground mt-1">Next 7 days</div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Overdue Actions</span>
            </div>
            <div className={`text-2xl font-bold ${metrics.overdueActions > 5 ? 'text-red-600' : 'text-yellow-600'}`}>
              {metrics.overdueActions}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Past due date</div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Avg. Cycle Time</span>
            </div>
            <div className="text-2xl font-bold">{metrics.averageCycleTime.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground mt-1">Days to complete</div>
          </div>
        </div>

        {/* Status Distribution */}
        <div>
          <h4 className="font-semibold mb-3">Status Distribution</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-600"></div>
                  Completed
                </span>
                <span className="font-medium">{metrics.statusDistribution.completed}</span>
              </div>
              <Progress value={(metrics.statusDistribution.completed / Object.values(metrics.statusDistribution).reduce((a, b) => a + b, 0)) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  In Progress
                </span>
                <span className="font-medium">{metrics.statusDistribution['in-progress']}</span>
              </div>
              <Progress value={(metrics.statusDistribution['in-progress'] / Object.values(metrics.statusDistribution).reduce((a, b) => a + b, 0)) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
                  Pending
                </span>
                <span className="font-medium">{metrics.statusDistribution.pending}</span>
              </div>
              <Progress value={(metrics.statusDistribution.pending / Object.values(metrics.statusDistribution).reduce((a, b) => a + b, 0)) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-600"></div>
                  Blocked
                </span>
                <span className="font-medium">{metrics.statusDistribution.blocked}</span>
              </div>
              <Progress value={(metrics.statusDistribution.blocked / Object.values(metrics.statusDistribution).reduce((a, b) => a + b, 0)) * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div>
          <h4 className="font-semibold mb-3">Priority Distribution</h4>
          <div className="grid gap-2 md:grid-cols-4">
            <div className="rounded-lg border p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.priorityDistribution.critical}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.priorityDistribution.high}</div>
              <div className="text-xs text-muted-foreground">High</div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">{metrics.priorityDistribution.medium}</div>
              <div className="text-xs text-muted-foreground">Medium</div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.priorityDistribution.low}</div>
              <div className="text-xs text-muted-foreground">Low</div>
            </div>
          </div>
        </div>

        {/* Predicted Completion */}
        {metrics.predictedCompletionDate && (
          <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <div className="font-semibold text-purple-900">Predicted Completion Date</div>
                <div className="text-2xl font-bold text-purple-600 mt-1">
                  {metrics.predictedCompletionDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-sm text-purple-700 mt-1">
                  Based on current velocity and average cycle time
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Insights */}
        <div className="rounded-lg bg-muted p-4">
          <h4 className="font-semibold mb-2">Health Insights</h4>
          <ul className="space-y-2 text-sm">
            {metrics.riskLevel === 'critical' && (
              <li className="flex items-start gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <span><strong>Critical:</strong> Immediate action required. High number of blockers or overdue tasks.</span>
              </li>
            )}
            {metrics.riskLevel === 'high' && (
              <li className="flex items-start gap-2 text-orange-700">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <span><strong>High Risk:</strong> Project health needs attention. Review blockers and overdue items.</span>
              </li>
            )}
            {metrics.blockersCount > 0 && (
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <span>{metrics.blockersCount} blocked task{metrics.blockersCount > 1 ? 's' : ''} requiring resolution.</span>
              </li>
            )}
            {metrics.velocityTrend === 'decreasing' && (
              <li className="flex items-start gap-2">
                <TrendingDown className="h-4 w-4 text-red-600 mt-0.5" />
                <span>Velocity is decreasing. Consider reviewing team capacity and removing obstacles.</span>
              </li>
            )}
            {metrics.velocityTrend === 'increasing' && (
              <li className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Velocity is increasing. Team is gaining momentum!</span>
              </li>
            )}
            {metrics.upcomingDeadlines > 5 && (
              <li className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-yellow-600 mt-0.5" />
                <span>Multiple deadlines approaching in the next 7 days. Ensure proper prioritization.</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
