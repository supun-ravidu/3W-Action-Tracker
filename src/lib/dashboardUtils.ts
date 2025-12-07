import { ActionPlan, DashboardStats, PriorityDistribution, TeamPerformance } from '@/types';
import { differenceInDays } from 'date-fns';

export function calculateDashboardStats(actionPlans: ActionPlan[]): DashboardStats {
  const total = actionPlans.length;
  const completed = actionPlans.filter((a) => a.status === 'completed').length;
  const inProgress = actionPlans.filter((a) => a.status === 'in-progress').length;
  const pending = actionPlans.filter((a) => a.status === 'pending').length;
  const today = new Date();
  const overdue = actionPlans.filter((a) => a.status !== 'completed' && a.when.dueDate < today).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Calculate average completion time for completed tasks
  const completedTasks = actionPlans.filter(
    (a) => a.status === 'completed' && a.completedAt
  );
  const totalCompletionTime = completedTasks.reduce((sum, task) => {
    if (task.completedAt) {
      return sum + differenceInDays(task.completedAt, task.createdAt);
    }
    return sum;
  }, 0);
  const averageCompletionTime =
    completedTasks.length > 0
      ? Math.round(totalCompletionTime / completedTasks.length)
      : 0;

  return {
    total,
    completed,
    inProgress,
    pending,
    overdue,
    completionRate,
    averageCompletionTime,
  };
}

export function calculatePriorityDistribution(
  actionPlans: ActionPlan[]
): PriorityDistribution {
  const high = actionPlans.filter((a) => a.priority === 'high').length;
  const medium = actionPlans.filter((a) => a.priority === 'medium').length;
  const low = actionPlans.filter((a) => a.priority === 'low').length;

  return { high, medium, low };
}

export function calculateTeamPerformance(
  actionPlans: ActionPlan[],
  teamMembers: string[]
): TeamPerformance[] {
  return teamMembers.map((memberName) => {
    const memberTasks = actionPlans.filter((a) => a.who.primaryAssignee.name === memberName);
    const completedTasks = memberTasks.filter((a) => a.status === 'completed');
    const tasksInProgress = memberTasks.filter(
      (a) => a.status === 'in-progress'
    ).length;

    // Calculate average completion time
    const totalCompletionTime = completedTasks.reduce((sum, task) => {
      if (task.completedAt) {
        return sum + differenceInDays(task.completedAt, task.createdAt);
      }
      return sum;
    }, 0);

    const averageCompletionTime =
      completedTasks.length > 0
        ? totalCompletionTime / completedTasks.length
        : 0;

    return {
      memberId: memberName.toLowerCase().replace(/\s+/g, '-'),
      memberName,
      completedTasks: completedTasks.length,
      averageCompletionTime,
      tasksInProgress,
    };
  });
}
