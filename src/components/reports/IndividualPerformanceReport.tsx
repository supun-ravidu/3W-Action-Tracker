'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { IndividualPerformanceReport as IndividualReport } from '@/types';
import { User, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface IndividualPerformanceReportProps {
  reports: IndividualReport[];
}

export function IndividualPerformanceReport({ reports }: IndividualPerformanceReportProps) {
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const formatDays = (value: number) => `${value.toFixed(1)} days`;

  const getPerformanceBadge = (completionRate: number) => {
    if (completionRate >= 80) return { label: 'Excellent', variant: 'default' as const, color: 'bg-green-600' };
    if (completionRate >= 60) return { label: 'Good', variant: 'secondary' as const, color: 'bg-blue-600' };
    if (completionRate >= 40) return { label: 'Fair', variant: 'outline' as const, color: 'bg-yellow-600' };
    return { label: 'Needs Improvement', variant: 'destructive' as const, color: 'bg-red-600' };
  };

  // Sort by contribution score
  const sortedReports = [...reports].sort((a, b) => b.contributionScore - a.contributionScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Individual Performance Reports
        </CardTitle>
        <CardDescription>
          Detailed performance metrics for each team member
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedReports.map((report, index) => {
            const performanceBadge = getPerformanceBadge(report.completionRate);
            const totalTasks = report.tasksCompleted + report.tasksInProgress + report.tasksPending + report.tasksBlocked;

            return (
              <div key={report.member.id} className="rounded-lg border p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={report.member.avatar} alt={report.member.name} />
                      <AvatarFallback>{report.member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {report.member.name}
                        {index === 0 && (
                          <Badge variant="default" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Top Performer
                          </Badge>
                        )}
                      </div>
                      {report.member.role && (
                        <div className="text-sm text-muted-foreground">{report.member.role}</div>
                      )}
                    </div>
                  </div>
                  <Badge variant={performanceBadge.variant}>{performanceBadge.label}</Badge>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-4 md:grid-cols-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Tasks Completed</div>
                    <div className="text-2xl font-bold text-green-600">{report.tasksCompleted}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                    <div className="text-2xl font-bold text-blue-600">{report.tasksInProgress}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg. Time</div>
                    <div className="text-2xl font-bold">{formatDays(report.averageCompletionTime)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">On-Time Rate</div>
                    <div className="text-2xl font-bold">{formatPercentage(report.onTimeCompletionRate)}</div>
                  </div>
                </div>

                {/* Completion Rate Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-sm font-medium">{formatPercentage(report.completionRate)}</span>
                  </div>
                  <Progress value={report.completionRate} className="h-2" />
                </div>

                {/* Task Distribution */}
                <div className="grid gap-2 md:grid-cols-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-green-600"></div>
                    <span>Completed: {report.tasksCompleted}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                    <span>In Progress: {report.tasksInProgress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
                    <span>Pending: {report.tasksPending}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-red-600"></div>
                    <span>Blocked: {report.tasksBlocked}</span>
                  </div>
                </div>

                {/* Contribution Score */}
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Contribution Score</span>
                    </div>
                    <Badge variant="outline" className="text-base font-bold">
                      {Math.round(report.contributionScore)}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Based on tasks completed, timeliness, and overall performance
                  </div>
                </div>

                {/* Insights */}
                {(report.tasksBlocked > 0 || report.onTimeCompletionRate < 70 || report.completionRate < 60) && (
                  <div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm space-y-1">
                        {report.tasksBlocked > 0 && (
                          <div>• {report.tasksBlocked} blocked task{report.tasksBlocked > 1 ? 's' : ''} - needs attention</div>
                        )}
                        {report.onTimeCompletionRate < 70 && (
                          <div>• Low on-time completion rate - consider timeline adjustments</div>
                        )}
                        {report.completionRate < 60 && (
                          <div>• Completion rate below target - may need support or workload review</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {sortedReports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No team member data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
