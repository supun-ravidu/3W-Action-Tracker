'use client';

import { useActionPlansStore } from '@/store/actionPlansStore';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Priority, Status } from '@/types';

export function GanttView() {
  const router = useRouter();
  const { getFilteredActionPlans } = useActionPlansStore();
  const actionPlans = getFilteredActionPlans();

  // Calculate date range for the view
  const today = new Date();
  const viewStart = startOfMonth(today);
  const viewEnd = endOfMonth(today);
  const daysInView = eachDayOfInterval({ start: viewStart, end: viewEnd });
  const totalDays = daysInView.length;

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      case 'blocked': return 'bg-red-500';
    }
  };

  const calculateBarPosition = (dueDate: Date, timeEstimate: number) => {
    // Calculate start date by subtracting estimated hours (assuming 8-hour workdays)
    const estimatedDays = Math.ceil(timeEstimate / 8);
    const startDate = new Date(dueDate);
    startDate.setDate(startDate.getDate() - estimatedDays);

    // Calculate position and width as percentages
    const startOffset = differenceInDays(startDate, viewStart);
    const duration = differenceInDays(dueDate, startDate);

    const left = Math.max(0, (startOffset / totalDays) * 100);
    const width = Math.min(100 - left, (duration / totalDays) * 100);

    return { left: `${left}%`, width: `${width}%` };
  };

  // Show dependency lines
  const getDependencies = (planId: string) => {
    return actionPlans.filter(plan => plan.dependencies.includes(planId));
  };

  return (
    <div className="p-6 overflow-x-auto">
      {/* Timeline Header */}
      <div className="flex mb-4">
        <div className="w-64 flex-shrink-0" />
        <div className="flex-1 flex border-b">
          {daysInView.map((day, index) => {
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            const isToday = differenceInDays(day, today) === 0;
            
            return (
              <div
                key={day.toISOString()}
                className={`flex-1 text-center py-2 text-xs border-l ${
                  isToday ? 'bg-blue-50 font-bold' : ''
                } ${isWeekend ? 'bg-gray-50' : ''}`}
              >
                <div className="font-semibold">{format(day, 'd')}</div>
                <div className="text-gray-500">{format(day, 'EEE')}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Plans */}
      <div className="space-y-2">
        {actionPlans.map((plan) => {
          const barStyle = calculateBarPosition(plan.when.dueDate, plan.when.timeEstimate);
          const dependentPlans = getDependencies(plan.id);

          return (
            <div key={plan.id} className="flex group">
              {/* Action Info */}
              <div className="w-64 flex-shrink-0 pr-4">
                <button
                  onClick={() => router.push(`/actions/${plan.id}`)}
                  className="text-left w-full"
                >
                  <div className="font-medium text-sm text-gray-900 truncate hover:text-purple-600">
                    {plan.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={`text-xs ${
                        plan.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        plan.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        plan.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {plan.priority}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {plan.who.primaryAssignee.name}
                    </span>
                  </div>
                </button>
              </div>

              {/* Timeline Bar */}
              <div className="flex-1 relative h-12 flex items-center">
                {/* Background grid */}
                <div className="absolute inset-0 flex">
                  {daysInView.map((day, index) => {
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                    const isToday = differenceInDays(day, today) === 0;
                    
                    return (
                      <div
                        key={day.toISOString()}
                        className={`flex-1 border-l ${
                          isToday ? 'bg-blue-50' : ''
                        } ${isWeekend ? 'bg-gray-50' : ''}`}
                      />
                    );
                  })}
                </div>

                {/* Progress Bar */}
                <div
                  className={`absolute h-8 rounded ${getStatusColor(plan.status)} opacity-80 hover:opacity-100 transition-opacity cursor-pointer flex items-center px-2`}
                  style={barStyle}
                  onClick={() => router.push(`/actions/${plan.id}`)}
                >
                  <span className="text-xs text-white font-medium truncate">
                    {plan.when.timeEstimate}h
                  </span>
                </div>

                {/* Dependencies indicator */}
                {plan.dependencies.length > 0 && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-purple-400"
                    title={`Depends on ${plan.dependencies.length} action(s)`}
                  />
                )}

                {/* Due date marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 opacity-50"
                  style={{ left: `${(differenceInDays(plan.when.dueDate, viewStart) / totalDays) * 100}%` }}
                >
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {actionPlans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No action plans to display in timeline view.</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-sm text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-400" />
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-sm text-gray-600">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-purple-400" />
            <span className="text-sm text-gray-600">Has Dependencies</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full" />
            <span className="text-sm text-gray-600">Due Date</span>
          </div>
        </div>
      </div>
    </div>
  );
}
