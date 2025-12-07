'use client';

import { useState } from 'react';
import { useActionPlansStore } from '@/store/actionPlansStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Priority } from '@/types';

export function CalendarView() {
  const router = useRouter();
  const { getFilteredActionPlans } = useActionPlansStore();
  const actionPlans = getFilteredActionPlans();
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = monthStart.getDay();
  
  // Add empty cells for days before the month starts
  const emptyDays = Array(firstDayOfWeek).fill(null);

  const getActionsForDay = (date: Date) => {
    return actionPlans.filter(plan => 
      isSameDay(plan.when.dueDate, date)
    );
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={today}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-700 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells before month starts */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="bg-gray-50 rounded-lg min-h-[120px]" />
        ))}

        {/* Days of the month */}
        {daysInMonth.map((day) => {
          const actions = getActionsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`bg-white border rounded-lg p-2 min-h-[120px] hover:shadow-md transition-shadow ${
                isToday ? 'border-blue-500 border-2' : 'border-gray-200'
              }`}
            >
              <div className={`text-sm font-semibold mb-2 ${
                isToday ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {format(day, 'd')}
              </div>

              <div className="space-y-1">
                {actions.slice(0, 3).map(action => (
                  <button
                    key={action.id}
                    onClick={() => router.push(`/actions/${action.id}`)}
                    className={`w-full text-left text-xs px-2 py-1 rounded hover:opacity-80 transition-opacity text-white ${
                      getPriorityColor(action.priority)
                    }`}
                  >
                    <div className="font-medium truncate">
                      {action.title}
                    </div>
                    <div className="text-xs opacity-90 truncate">
                      {action.who.primaryAssignee.name}
                    </div>
                  </button>
                ))}

                {actions.length > 3 && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    +{actions.length - 3} more
                  </div>
                )}

                {actions.length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-2">
                    No items
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-sm text-gray-600">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span className="text-sm text-gray-600">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span className="text-sm text-gray-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-sm text-gray-600">Low</span>
        </div>
      </div>
    </div>
  );
}
