import {
  ActionPlan,
  TeamMember,
  TeamPerformanceMetrics,
  IndividualPerformanceReport,
  ProjectHealthMetrics,
  BottleneckAnalysis,
  CompletionTrend,
  CycleTimeMetrics,
  ForecastData,
  TrendData,
  Status,
  Priority,
} from '@/types';

/**
 * Calculate team performance metrics
 */
export function calculateTeamPerformance(
  actionPlans: ActionPlan[],
  startDate: Date,
  endDate: Date
): TeamPerformanceMetrics {
  const filteredPlans = actionPlans.filter(
    (plan) => plan.createdAt >= startDate && plan.createdAt <= endDate
  );

  const completed = filteredPlans.filter((p) => p.status === 'completed');
  const inProgress = filteredPlans.filter((p) => p.status === 'in-progress');
  const pending = filteredPlans.filter((p) => p.status === 'pending');
  const blocked = filteredPlans.filter((p) => p.status === 'blocked');

  // Calculate completion rate
  const completionRate =
    filteredPlans.length > 0 ? (completed.length / filteredPlans.length) * 100 : 0;

  // Calculate average completion time
  const completionTimes = completed
    .filter((p) => p.completedAt)
    .map((p) => {
      const start = new Date(p.createdAt).getTime();
      const end = new Date(p.completedAt!).getTime();
      return (end - start) / (1000 * 60 * 60 * 24); // days
    });

  const averageCompletionTime =
    completionTimes.length > 0
      ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
      : 0;

  // Calculate on-time completion rate
  const completedOnTime = completed.filter((p) => {
    if (!p.completedAt) return false;
    return new Date(p.completedAt) <= new Date(p.when.dueDate);
  });

  const onTimeCompletionRate =
    completed.length > 0 ? (completedOnTime.length / completed.length) * 100 : 0;

  // Count overdue tasks
  const now = new Date();
  const overdueCount = filteredPlans.filter(
    (p) => p.status !== 'completed' && new Date(p.when.dueDate) < now
  ).length;

  return {
    completionRate,
    averageCompletionTime,
    totalCompleted: completed.length,
    totalInProgress: inProgress.length,
    totalPending: pending.length,
    totalBlocked: blocked.length,
    onTimeCompletionRate,
    overdueCount,
    period: { start: startDate, end: endDate },
  };
}

/**
 * Calculate individual performance reports for each team member
 */
export function calculateIndividualReports(
  actionPlans: ActionPlan[],
  teamMembers: TeamMember[]
): IndividualPerformanceReport[] {
  return teamMembers.map((member) => {
    // Get all tasks assigned to this member
    const memberTasks = actionPlans.filter(
      (plan) => plan.who.primaryAssignee.id === member.id
    );

    const completed = memberTasks.filter((p) => p.status === 'completed');
    const inProgress = memberTasks.filter((p) => p.status === 'in-progress');
    const pending = memberTasks.filter((p) => p.status === 'pending');
    const blocked = memberTasks.filter((p) => p.status === 'blocked');

    // Calculate completion rate
    const completionRate =
      memberTasks.length > 0 ? (completed.length / memberTasks.length) * 100 : 0;

    // Calculate average completion time
    const completionTimes = completed
      .filter((p) => p.completedAt)
      .map((p) => {
        const start = new Date(p.createdAt).getTime();
        const end = new Date(p.completedAt!).getTime();
        return (end - start) / (1000 * 60 * 60 * 24);
      });

    const averageCompletionTime =
      completionTimes.length > 0
        ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
        : 0;

    // Calculate on-time completion rate
    const completedOnTime = completed.filter((p) => {
      if (!p.completedAt) return false;
      return new Date(p.completedAt) <= new Date(p.when.dueDate);
    });

    const onTimeCompletionRate =
      completed.length > 0 ? (completedOnTime.length / completed.length) * 100 : 0;

    // Calculate contribution score (weighted metric)
    const contributionScore =
      completed.length * 10 +
      inProgress.length * 5 +
      onTimeCompletionRate * 0.5 +
      (completionRate > 80 ? 20 : 0);

    // Get recent activity (last 10 actions)
    const recentActivity = memberTasks
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
      .map((plan) => ({
        id: `activity-${plan.id}`,
        actionPlanId: plan.id,
        actionTitle: plan.title,
        type: 'updated' as const,
        performedBy: member.name,
        timestamp: plan.updatedAt,
        description: `Updated ${plan.title}`,
      }));

    return {
      member,
      tasksCompleted: completed.length,
      tasksInProgress: inProgress.length,
      tasksPending: pending.length,
      tasksBlocked: blocked.length,
      completionRate,
      averageCompletionTime,
      onTimeCompletionRate,
      contributionScore,
      recentActivity,
    };
  });
}

/**
 * Calculate project health metrics
 */
export function calculateProjectHealth(actionPlans: ActionPlan[]): ProjectHealthMetrics {
  const now = new Date();

  // Calculate overall progress
  const completed = actionPlans.filter((p) => p.status === 'completed').length;
  const overallProgress = actionPlans.length > 0 ? (completed / actionPlans.length) * 100 : 0;

  // Status distribution
  const statusDistribution: Record<Status, number> = {
    completed: actionPlans.filter((p) => p.status === 'completed').length,
    'in-progress': actionPlans.filter((p) => p.status === 'in-progress').length,
    pending: actionPlans.filter((p) => p.status === 'pending').length,
    blocked: actionPlans.filter((p) => p.status === 'blocked').length,
  };

  // Priority distribution
  const priorityDistribution: Record<Priority, number> = {
    critical: actionPlans.filter((p) => p.priority === 'critical').length,
    high: actionPlans.filter((p) => p.priority === 'high').length,
    medium: actionPlans.filter((p) => p.priority === 'medium').length,
    low: actionPlans.filter((p) => p.priority === 'low').length,
  };

  // Upcoming deadlines (next 7 days)
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingDeadlines = actionPlans.filter(
    (p) =>
      p.status !== 'completed' &&
      new Date(p.when.dueDate) >= now &&
      new Date(p.when.dueDate) <= nextWeek
  ).length;

  // Overdue actions
  const overdueActions = actionPlans.filter(
    (p) => p.status !== 'completed' && new Date(p.when.dueDate) < now
  ).length;

  // Blocked count
  const blockersCount = statusDistribution.blocked;

  // Calculate average cycle time
  const completedWithDates = actionPlans.filter(
    (p) => p.status === 'completed' && p.completedAt
  );
  const cycleTimes = completedWithDates.map((p) => {
    const start = new Date(p.createdAt).getTime();
    const end = new Date(p.completedAt!).getTime();
    return (end - start) / (1000 * 60 * 60 * 24);
  });
  const averageCycleTime =
    cycleTimes.length > 0
      ? cycleTimes.reduce((sum, time) => sum + time, 0) / cycleTimes.length
      : 0;

  // Determine velocity trend (simplified)
  const velocityTrend: 'increasing' | 'stable' | 'decreasing' =
    overallProgress > 70 ? 'increasing' : overallProgress > 40 ? 'stable' : 'decreasing';

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (overdueActions > 10 || blockersCount > 5) riskLevel = 'critical';
  else if (overdueActions > 5 || blockersCount > 2) riskLevel = 'high';
  else if (overdueActions > 2 || blockersCount > 0) riskLevel = 'medium';

  // Predict completion date (simplified)
  const inProgressCount = statusDistribution['in-progress'] + statusDistribution.pending;
  const predictedDays = inProgressCount > 0 ? inProgressCount * averageCycleTime : 0;
  const predictedCompletionDate = new Date(now.getTime() + predictedDays * 24 * 60 * 60 * 1000);

  return {
    overallProgress,
    velocityTrend,
    riskLevel,
    statusDistribution,
    priorityDistribution,
    upcomingDeadlines,
    overdueActions,
    blockersCount,
    averageCycleTime,
    predictedCompletionDate,
  };
}

/**
 * Identify bottlenecks in the workflow
 */
export function identifyBottlenecks(actionPlans: ActionPlan[]): BottleneckAnalysis[] {
  const now = new Date();
  const bottlenecks: BottleneckAnalysis[] = [];

  // Consider tasks that have been in the same status for too long
  const thresholdDays = 7; // Consider it a bottleneck if stuck for 7+ days

  actionPlans
    .filter((p) => p.status !== 'completed')
    .forEach((plan) => {
      // Get the latest status change or creation date
      const latestStatusChange = plan.statusHistory.length > 0
        ? plan.statusHistory[plan.statusHistory.length - 1]
        : null;

      const statusStartDate = latestStatusChange
        ? new Date(latestStatusChange.changedAt)
        : new Date(plan.createdAt);

      const daysInStatus = (now.getTime() - statusStartDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysInStatus >= thresholdDays) {
        // Identify blocking factors
        const blockingFactors: string[] = [];
        const suggestedActions: string[] = [];

        if (plan.status === 'blocked') {
          blockingFactors.push('Task marked as blocked');
          suggestedActions.push('Review blocking issues and assign resources to resolve');
        }

        if (plan.dependencies.length > 0) {
          blockingFactors.push(`Has ${plan.dependencies.length} dependencies`);
          suggestedActions.push('Check status of dependent tasks');
        }

        if (new Date(plan.when.dueDate) < now) {
          blockingFactors.push('Task is overdue');
          suggestedActions.push('Re-evaluate timeline and priority');
        }

        if (plan.who.supportingMembers.length === 0) {
          blockingFactors.push('No supporting team members assigned');
          suggestedActions.push('Consider adding supporting members');
        }

        // Calculate risk score (0-100)
        let riskScore = daysInStatus * 5;
        if (plan.status === 'blocked') riskScore += 30;
        if (plan.priority === 'critical' || plan.priority === 'high') riskScore += 20;
        if (new Date(plan.when.dueDate) < now) riskScore += 25;
        riskScore = Math.min(100, riskScore);

        bottlenecks.push({
          actionPlanId: plan.id,
          actionTitle: plan.title,
          assignee: plan.who.primaryAssignee,
          daysInStatus: Math.round(daysInStatus),
          currentStatus: plan.status,
          blockingFactors,
          suggestedActions,
          riskScore: Math.round(riskScore),
        });
      }
    });

  // Sort by risk score descending
  return bottlenecks.sort((a, b) => b.riskScore - a.riskScore);
}

/**
 * Calculate completion trends over time
 */
export function calculateCompletionTrends(
  actionPlans: ActionPlan[],
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly'
): CompletionTrend {
  const now = new Date();
  const data: TrendData[] = [];

  // Determine the number of periods to analyze
  const periodsToAnalyze = period === 'daily' ? 30 : period === 'weekly' ? 12 : period === 'monthly' ? 12 : 4;

  // Generate trend data
  for (let i = periodsToAnalyze - 1; i >= 0; i--) {
    let startDate: Date;
    let endDate: Date;
    let label: string;

    if (period === 'daily') {
      startDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      label = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (period === 'weekly') {
      startDate = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      label = `Week ${periodsToAnalyze - i}`;
    } else if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      label = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } else {
      // quarterly
      const quarter = Math.floor(now.getMonth() / 3) - i;
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
      label = `Q${quarter + 1} ${startDate.getFullYear()}`;
    }

    const completedInPeriod = actionPlans.filter((p) => {
      if (!p.completedAt) return false;
      const completedDate = new Date(p.completedAt);
      return completedDate >= startDate && completedDate < endDate;
    }).length;

    data.push({
      label,
      value: completedInPeriod,
      date: startDate,
    });
  }

  // Calculate percentage change
  const currentPeriod = data[data.length - 1];
  const previousPeriod = data[data.length - 2] || { label: '', value: 0, date: now };

  const percentageChange =
    previousPeriod.value > 0
      ? ((currentPeriod.value - previousPeriod.value) / previousPeriod.value) * 100
      : 0;

  return {
    period,
    data,
    currentPeriod,
    previousPeriod,
    percentageChange,
  };
}

/**
 * Calculate cycle time metrics
 */
export function calculateCycleTimeMetrics(actionPlans: ActionPlan[]): CycleTimeMetrics {
  const completedPlans = actionPlans.filter((p) => p.status === 'completed' && p.completedAt);

  // Calculate cycle times
  const cycleTimes = completedPlans.map((p) => {
    const start = new Date(p.createdAt).getTime();
    const end = new Date(p.completedAt!).getTime();
    return (end - start) / (1000 * 60 * 60 * 24);
  });

  const averageCycleTime =
    cycleTimes.length > 0
      ? cycleTimes.reduce((sum, time) => sum + time, 0) / cycleTimes.length
      : 0;

  // Calculate by priority
  const byPriority: Record<Priority, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  (['critical', 'high', 'medium', 'low'] as Priority[]).forEach((priority) => {
    const priorityPlans = completedPlans.filter((p) => p.priority === priority);
    const times = priorityPlans.map((p) => {
      const start = new Date(p.createdAt).getTime();
      const end = new Date(p.completedAt!).getTime();
      return (end - start) / (1000 * 60 * 60 * 24);
    });
    byPriority[priority] =
      times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0;
  });

  // Calculate by assignee
  const byAssignee: Record<string, number> = {};
  completedPlans.forEach((p) => {
    const assigneeId = p.who.primaryAssignee.id;
    const cycleTime =
      (new Date(p.completedAt!).getTime() - new Date(p.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (!byAssignee[assigneeId]) {
      byAssignee[assigneeId] = cycleTime;
    } else {
      byAssignee[assigneeId] = (byAssignee[assigneeId] + cycleTime) / 2;
    }
  });

  // Calculate median and 90th percentile
  const sortedTimes = [...cycleTimes].sort((a, b) => a - b);
  const median = sortedTimes.length > 0 ? sortedTimes[Math.floor(sortedTimes.length / 2)] : 0;
  const percentile90 =
    sortedTimes.length > 0 ? sortedTimes[Math.floor(sortedTimes.length * 0.9)] : 0;

  // Generate trend data (last 12 months)
  const trend: TrendData[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

    const monthPlans = completedPlans.filter((p) => {
      const completedDate = new Date(p.completedAt!);
      return completedDate >= monthStart && completedDate <= monthEnd;
    });

    const monthTimes = monthPlans.map((p) => {
      const start = new Date(p.createdAt).getTime();
      const end = new Date(p.completedAt!).getTime();
      return (end - start) / (1000 * 60 * 60 * 24);
    });

    const avgTime =
      monthTimes.length > 0
        ? monthTimes.reduce((sum, time) => sum + time, 0) / monthTimes.length
        : 0;

    trend.push({
      label: monthStart.toLocaleDateString('en-US', { month: 'short' }),
      value: avgTime,
      date: monthStart,
    });
  }

  return {
    averageCycleTime,
    byPriority,
    byAssignee,
    trend,
    median,
    percentile90,
  };
}

/**
 * Generate forecasts for incomplete action plans
 */
export function generateForecasts(
  actionPlans: ActionPlan[],
  cycleTimeMetrics: CycleTimeMetrics
): ForecastData[] {
  const now = new Date();
  const incompletePlans = actionPlans.filter((p) => p.status !== 'completed');

  return incompletePlans.map((plan) => {
    // Estimate completion based on priority average cycle time
    const estimatedDays = cycleTimeMetrics.byPriority[plan.priority] || cycleTimeMetrics.averageCycleTime;

    // Adjust based on current status
    let adjustedDays = estimatedDays;
    if (plan.status === 'in-progress') {
      adjustedDays = estimatedDays * 0.7; // 70% of average since already started
    } else if (plan.status === 'blocked') {
      adjustedDays = estimatedDays * 1.5; // 150% due to blocking issues
    }

    const estimatedCompletionDate = new Date(now.getTime() + adjustedDays * 24 * 60 * 60 * 1000);

    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    if (plan.status === 'blocked' || plan.dependencies.length > 3) {
      confidence = 'low';
    } else if (plan.status === 'in-progress' && plan.dependencies.length === 0) {
      confidence = 'high';
    }

    // Identify factors
    const factorsConsidered = [
      `Average cycle time for ${plan.priority} priority tasks`,
      `Current status: ${plan.status}`,
    ];

    if (plan.dependencies.length > 0) {
      factorsConsidered.push(`${plan.dependencies.length} dependencies`);
    }

    // Identify risk factors
    const riskFactors: string[] = [];
    if (plan.status === 'blocked') riskFactors.push('Currently blocked');
    if (plan.dependencies.length > 2) riskFactors.push('Multiple dependencies');
    if (new Date(plan.when.dueDate) < estimatedCompletionDate)
      riskFactors.push('Estimated completion after due date');
    if (plan.who.supportingMembers.length === 0)
      riskFactors.push('No supporting team members');

    const daysRemaining = Math.ceil(
      (estimatedCompletionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      actionPlanId: plan.id,
      actionTitle: plan.title,
      currentStatus: plan.status,
      estimatedCompletionDate,
      confidence,
      factorsConsidered,
      daysRemaining,
      riskFactors,
    };
  });
}

/**
 * Generate chart data for various visualizations
 */
export function generateChartData(
  type: 'status' | 'priority' | 'completion-trend' | 'cycle-time',
  actionPlans: ActionPlan[],
  additionalData?: any
): any {
  switch (type) {
    case 'status':
      return {
        labels: ['Completed', 'In Progress', 'Pending', 'Blocked'],
        datasets: [
          {
            label: 'Tasks by Status',
            data: [
              actionPlans.filter((p) => p.status === 'completed').length,
              actionPlans.filter((p) => p.status === 'in-progress').length,
              actionPlans.filter((p) => p.status === 'pending').length,
              actionPlans.filter((p) => p.status === 'blocked').length,
            ],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
          },
        ],
      };

    case 'priority':
      return {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [
          {
            label: 'Tasks by Priority',
            data: [
              actionPlans.filter((p) => p.priority === 'critical').length,
              actionPlans.filter((p) => p.priority === 'high').length,
              actionPlans.filter((p) => p.priority === 'medium').length,
              actionPlans.filter((p) => p.priority === 'low').length,
            ],
            backgroundColor: ['#dc2626', '#f97316', '#eab308', '#22c55e'],
          },
        ],
      };

    case 'completion-trend':
      if (additionalData && additionalData.trendData) {
        return {
          labels: additionalData.trendData.map((d: TrendData) => d.label),
          datasets: [
            {
              label: 'Completed Tasks',
              data: additionalData.trendData.map((d: TrendData) => d.value),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 2,
            },
          ],
        };
      }
      return null;

    case 'cycle-time':
      if (additionalData && additionalData.cycleTimeMetrics) {
        return {
          labels: additionalData.cycleTimeMetrics.trend.map((d: TrendData) => d.label),
          datasets: [
            {
              label: 'Average Cycle Time (days)',
              data: additionalData.cycleTimeMetrics.trend.map((d: TrendData) => d.value),
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              borderWidth: 2,
            },
          ],
        };
      }
      return null;

    default:
      return null;
  }
}
