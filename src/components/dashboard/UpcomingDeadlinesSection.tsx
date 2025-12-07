'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionPlan } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';

interface UpcomingDeadlinesProps {
  actionPlans: ActionPlan[];
}

export function UpcomingDeadlinesSection({
  actionPlans,
}: UpcomingDeadlinesProps) {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  // Filter actions due within next 7 days that aren't completed
  const upcomingActions = actionPlans
    .filter(
      (action) =>
        action.status !== 'completed' &&
        action.when.dueDate >= today &&
        action.when.dueDate <= nextWeek
    )
    .sort((a, b) => a.when.dueDate.getTime() - b.when.dueDate.getTime());

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getDaysUntil = (date: Date) => {
    const days = differenceInDays(date, today);
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Deadlines (Next 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingActions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No deadlines in the next 7 days</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingActions.map((action) => (
              <div
                key={action.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm leading-tight">
                      {action.title}
                    </h4>
                    <Badge variant={getPriorityColor(action.priority)}>
                      {action.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {action.who.primaryAssignee.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(action.when.dueDate, 'MMM dd, yyyy')}
                    </div>
                  </div>
                  {action.what.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {action.what.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div
                    className={`text-xs font-medium ${
                      differenceInDays(action.when.dueDate, today) <= 1
                        ? 'text-red-600'
                        : differenceInDays(action.when.dueDate, today) <= 3
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`}
                  >
                    {getDaysUntil(action.when.dueDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      </Card>
    </motion.div>
  );
}
