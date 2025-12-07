'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BottleneckAnalysis as BottleneckData } from '@/types';
import { AlertTriangle, Clock, XCircle, Link as LinkIcon, TrendingUp } from 'lucide-react';

interface BottleneckAnalysisProps {
  bottlenecks: BottleneckData[];
}

export function BottleneckAnalysisComponent({ bottlenecks }: BottleneckAnalysisProps) {
  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score >= 25) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 75) return 'Critical';
    if (score >= 50) return 'High';
    if (score >= 25) return 'Medium';
    return 'Low';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'blocked':
        return { label: 'Blocked', variant: 'destructive' as const };
      case 'in-progress':
        return { label: 'In Progress', variant: 'default' as const };
      case 'pending':
        return { label: 'Pending', variant: 'secondary' as const };
      default:
        return { label: status, variant: 'outline' as const };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Bottleneck Analysis
        </CardTitle>
        <CardDescription>
          Identifies tasks that are stuck and require attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bottlenecks.length > 0 ? (
          <div className="space-y-4">
            {bottlenecks.map((bottleneck) => {
              const statusBadge = getStatusBadge(bottleneck.currentStatus);
              const riskColor = getRiskColor(bottleneck.riskScore);

              return (
                <div
                  key={bottleneck.actionPlanId}
                  className={`rounded-lg border-2 p-4 ${riskColor}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{bottleneck.actionTitle}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={bottleneck.assignee.avatar} alt={bottleneck.assignee.name} />
                          <AvatarFallback className="text-xs">
                            {bottleneck.assignee.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{bottleneck.assignee.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      <Badge variant="outline" className="font-bold">
                        Risk: {bottleneck.riskScore}
                      </Badge>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid gap-3 md:grid-cols-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <div>
                        <div className="text-sm text-muted-foreground">Days in Status</div>
                        <div className="font-bold">{bottleneck.daysInStatus} days</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <div>
                        <div className="text-sm text-muted-foreground">Risk Level</div>
                        <div className="font-bold">{getRiskLabel(bottleneck.riskScore)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Blocking Factors */}
                  {bottleneck.blockingFactors.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm font-medium mb-2">
                        <XCircle className="h-4 w-4" />
                        <span>Blocking Factors:</span>
                      </div>
                      <ul className="space-y-1 text-sm ml-6">
                        {bottleneck.blockingFactors.map((factor, index) => (
                          <li key={index} className="list-disc">{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggested Actions */}
                  {bottleneck.suggestedActions.length > 0 && (
                    <div className="rounded-lg bg-white/50 p-3 border">
                      <div className="flex items-center gap-2 text-sm font-medium mb-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Suggested Actions:</span>
                      </div>
                      <ul className="space-y-1 text-sm ml-6">
                        {bottleneck.suggestedActions.map((action, index) => (
                          <li key={index} className="list-disc">{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Bottlenecks Detected</h3>
            <p className="text-sm text-muted-foreground">
              All tasks are progressing normally. Great work!
            </p>
          </div>
        )}

        {/* Summary */}
        {bottlenecks.length > 0 && (
          <div className="mt-6 rounded-lg bg-muted p-4">
            <h4 className="font-semibold mb-2">Summary</h4>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {bottlenecks.filter(b => b.riskScore >= 75).length}
                </div>
                <div className="text-sm text-muted-foreground">Critical Risk</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {bottlenecks.filter(b => b.riskScore >= 50 && b.riskScore < 75).length}
                </div>
                <div className="text-sm text-muted-foreground">High Risk</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {bottlenecks.reduce((sum, b) => sum + b.daysInStatus, 0) / bottlenecks.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Avg. Days Stuck</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
