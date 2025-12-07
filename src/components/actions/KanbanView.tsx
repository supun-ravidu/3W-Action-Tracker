'use client';

import { useActionPlansStore } from '@/store/actionPlansStore';
import { Status, Priority, ActionPlan } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ClockIcon, UserIcon, TagIcon } from 'lucide-react';

export function KanbanView() {
  const router = useRouter();
  const { getFilteredActionPlans, updateActionPlan } = useActionPlansStore();
  const actionPlans = getFilteredActionPlans();

  const statuses: { value: Status; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-100' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100' },
    { value: 'blocked', label: 'Blocked', color: 'bg-red-100' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100' },
  ];

  const getActionsByStatus = (status: Status) => {
    return actionPlans.filter(plan => plan.status === status);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'critical': return 'border-l-4 border-l-red-500';
      case 'high': return 'border-l-4 border-l-orange-500';
      case 'medium': return 'border-l-4 border-l-yellow-500';
      case 'low': return 'border-l-4 border-l-green-500';
    }
  };

  const handleDragStart = (e: React.DragEvent, planId: string) => {
    e.dataTransfer.setData('planId', planId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Status) => {
    e.preventDefault();
    const planId = e.dataTransfer.getData('planId');
    const plan = actionPlans.find(p => p.id === planId);
    
    if (plan && plan.status !== newStatus) {
      updateActionPlan(planId, { status: newStatus });
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-4">
        {statuses.map(({ value, label, color }) => (
          <div key={value} className="flex flex-col">
            <div className={`${color} rounded-t-lg px-4 py-3`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{label}</h3>
                <Badge variant="secondary">
                  {getActionsByStatus(value).length}
                </Badge>
              </div>
            </div>
            
            <div
              className="bg-gray-50 rounded-b-lg p-2 min-h-[600px] space-y-3"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, value)}
            >
              {getActionsByStatus(value).map((plan) => (
                <Card
                  key={plan.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, plan.id)}
                  onClick={() => router.push(`/actions/${plan.id}`)}
                  className={`p-4 cursor-pointer hover:shadow-lg transition-shadow ${getPriorityColor(plan.priority)}`}
                >
                  {/* Priority Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      className={
                        plan.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        plan.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        plan.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }
                    >
                      {plan.priority}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {plan.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {plan.what.description}
                  </p>

                  {/* Assignee */}
                  <div className="flex items-center gap-2 mb-3">
                    {plan.who.primaryAssignee.avatar ? (
                      <Avatar className="w-6 h-6">
                        <img
                          src={plan.who.primaryAssignee.avatar}
                          alt={plan.who.primaryAssignee.name}
                        />
                      </Avatar>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-semibold text-[10px]">
                        {plan.who.primaryAssignee.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs text-gray-600">
                      {plan.who.primaryAssignee.name}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <ClockIcon className="w-3 h-3" />
                    <span>{format(plan.when.dueDate, 'MMM dd')}</span>
                    <span className="ml-2">
                      {plan.when.timeEstimate}h
                    </span>
                  </div>

                  {/* Tags */}
                  {plan.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {plan.tags.slice(0, 2).map(tag => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {plan.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{plan.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Team Size */}
                  {plan.who.supportingMembers.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                      <UserIcon className="w-3 h-3" />
                      <span>{plan.who.supportingMembers.length + 1} members</span>
                    </div>
                  )}
                </Card>
              ))}

              {getActionsByStatus(value).length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No items
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
