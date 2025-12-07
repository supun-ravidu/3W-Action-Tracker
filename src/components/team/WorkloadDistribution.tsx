'use client';

import { useActionPlansStore } from '@/store/actionPlansStore';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

export function WorkloadDistribution() {
  const { teamMembers, actionPlans } = useActionPlansStore();

  const getMemberWorkload = (memberId: string) => {
    const memberPlans = actionPlans.filter(
      plan => 
        (plan.who.primaryAssignee.id === memberId ||
        plan.who.supportingMembers.some(m => m.id === memberId)) &&
        plan.status !== 'completed'
    );

    return {
      count: memberPlans.length,
      high: memberPlans.filter(p => p.priority === 'critical' || p.priority === 'high').length,
      medium: memberPlans.filter(p => p.priority === 'medium').length,
      low: memberPlans.filter(p => p.priority === 'low').length,
    };
  };

  const workloadData = teamMembers.map(member => ({
    member,
    workload: getMemberWorkload(member.id),
  })).sort((a, b) => b.workload.count - a.workload.count);

  const maxWorkload = Math.max(...workloadData.map(d => d.workload.count), 1);
  const avgWorkload = workloadData.reduce((sum, d) => sum + d.workload.count, 0) / workloadData.length;

  const getWorkloadStatus = (count: number) => {
    if (count > avgWorkload * 1.5) return { label: 'Overloaded', color: 'destructive', icon: TrendingUp };
    if (count < avgWorkload * 0.5) return { label: 'Available', color: 'default', icon: TrendingDown };
    return { label: 'Balanced', color: 'secondary', icon: BarChart3 };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Workload Distribution</h2>
        </div>
        <Badge variant="outline">
          Avg: {avgWorkload.toFixed(1)} tasks/person
        </Badge>
      </div>

      <div className="grid gap-4">
        {workloadData.map(({ member, workload }) => {
          const status = getWorkloadStatus(workload.count);
          const StatusIcon = status.icon;
          const percentage = (workload.count / maxWorkload) * 100;

          return (
            <Card key={member.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role || 'Team Member'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={status.color as any} className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                  <Badge variant="outline">
                    {workload.count} tasks
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={percentage} className="h-3" />
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {workload.high > 0 && (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        {workload.high} High
                      </span>
                    )}
                    {workload.medium > 0 && (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        {workload.medium} Medium
                      </span>
                    )}
                    {workload.low > 0 && (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        {workload.low} Low
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground">
                    {percentage.toFixed(0)}% of max capacity
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
