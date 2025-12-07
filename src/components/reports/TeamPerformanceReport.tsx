'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TeamPerformanceMetrics } from '@/types';
import { TrendingUp, TrendingDown, Minus, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

interface TeamPerformanceReportProps {
  metrics: TeamPerformanceMetrics;
}

export function TeamPerformanceReport({ metrics }: TeamPerformanceReportProps) {
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const formatDays = (value: number) => `${value.toFixed(1)} days`;

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Team Performance Report
        </CardTitle>
        <CardDescription>
          {metrics.period.start.toLocaleDateString()} - {metrics.period.end.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">Completion Rate</div>
            <div className={`text-2xl font-bold ${getCompletionRateColor(metrics.completionRate)}`}>
              {formatPercentage(metrics.completionRate)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {metrics.totalCompleted} of {metrics.totalCompleted + metrics.totalInProgress + metrics.totalPending} tasks
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">Avg. Completion Time</div>
            <div className="text-2xl font-bold">{formatDays(metrics.averageCompletionTime)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              From creation to completion
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">On-Time Rate</div>
            <div className={`text-2xl font-bold ${getCompletionRateColor(metrics.onTimeCompletionRate)}`}>
              {formatPercentage(metrics.onTimeCompletionRate)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Completed before deadline
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">Overdue Tasks</div>
            <div className={`text-2xl font-bold ${metrics.overdueCount > 5 ? 'text-red-600' : 'text-yellow-600'}`}>
              {metrics.overdueCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Past their due date
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div>
          <h4 className="font-semibold mb-3">Status Breakdown</h4>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.totalCompleted}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.totalInProgress}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Minus className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.totalPending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.totalBlocked}</div>
                <div className="text-xs text-muted-foreground">Blocked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="rounded-lg bg-muted p-4">
          <h4 className="font-semibold mb-2">Performance Insights</h4>
          <ul className="space-y-2 text-sm">
            {metrics.completionRate >= 80 && (
              <li className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Excellent completion rate! The team is performing exceptionally well.</span>
              </li>
            )}
            {metrics.completionRate < 60 && (
              <li className="flex items-start gap-2">
                <TrendingDown className="h-4 w-4 text-red-600 mt-0.5" />
                <span>Completion rate is below target. Consider reviewing workload distribution.</span>
              </li>
            )}
            {metrics.onTimeCompletionRate < 70 && (
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <span>Many tasks are completing past their deadlines. Review time estimates and priorities.</span>
              </li>
            )}
            {metrics.totalBlocked > 0 && (
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <span>{metrics.totalBlocked} blocked tasks require immediate attention to unblock progress.</span>
              </li>
            )}
            {metrics.overdueCount > 5 && (
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <span>High number of overdue tasks. Consider reprioritizing or redistributing work.</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
