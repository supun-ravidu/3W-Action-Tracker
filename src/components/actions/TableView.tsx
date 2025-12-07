'use client';

import { useState, useMemo } from 'react';
import { useActionPlansStore } from '@/store/actionPlansStore';
import { ActionPlan, Priority, Status } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  MoreVerticalIcon,
  EyeIcon,
  Edit2Icon,
  CopyIcon,
  Trash2Icon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

type SortField = 'title' | 'priority' | 'status' | 'dueDate' | 'assignee';
type SortDirection = 'asc' | 'desc';

export function TableView() {
  const router = useRouter();
  const { getFilteredActionPlans, deleteActionPlan, duplicateActionPlan } = useActionPlansStore();
  const actionPlans = getFilteredActionPlans();
  
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedActionPlans = useMemo(() => {
    return [...actionPlans].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'status':
          const statusOrder = { blocked: 0, 'in-progress': 1, pending: 2, completed: 3 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        case 'dueDate':
          aValue = a.when.dueDate.getTime();
          bValue = b.when.dueDate.getTime();
          break;
        case 'assignee':
          aValue = a.who.primaryAssignee.name.toLowerCase();
          bValue = b.who.primaryAssignee.name.toLowerCase();
          break;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [actionPlans, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
    >
      {label}
      {sortField === field && (
        sortDirection === 'asc' ? 
          <ArrowUpIcon className="w-4 h-4" /> : 
          <ArrowDownIcon className="w-4 h-4" />
      )}
    </button>
  );

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteActionPlan(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs">
              <SortButton field="title" label="TITLE" />
            </th>
            <th className="px-6 py-3 text-left text-xs">
              <SortButton field="priority" label="PRIORITY" />
            </th>
            <th className="px-6 py-3 text-left text-xs">
              <SortButton field="status" label="STATUS" />
            </th>
            <th className="px-6 py-3 text-left text-xs">
              <SortButton field="assignee" label="ASSIGNEE" />
            </th>
            <th className="px-6 py-3 text-left text-xs">
              <SortButton field="dueDate" label="DUE DATE" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
              TAGS
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
              PROGRESS
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {sortedActionPlans.map((plan) => (
            <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div>
                  <button
                    onClick={() => router.push(`/actions/${plan.id}`)}
                    className="font-medium text-gray-900 hover:text-purple-600 text-left"
                  >
                    {plan.title}
                  </button>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {plan.what.description}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge className={getPriorityColor(plan.priority)}>
                  {plan.priority}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <Badge className={getStatusColor(plan.status)}>
                  {plan.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {plan.who.primaryAssignee.avatar ? (
                    <Avatar className="w-8 h-8">
                      <img 
                        src={plan.who.primaryAssignee.avatar} 
                        alt={plan.who.primaryAssignee.name}
                      />
                    </Avatar>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-semibold text-xs">
                      {plan.who.primaryAssignee.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {plan.who.primaryAssignee.name}
                    </div>
                    {plan.who.supportingMembers.length > 0 && (
                      <div className="text-xs text-gray-500">
                        +{plan.who.supportingMembers.length} more
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {format(plan.when.dueDate, 'MMM dd, yyyy')}
                </div>
                <div className="text-xs text-gray-500">
                  {plan.when.timeEstimate}h estimated
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {plan.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {plan.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{plan.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      plan.status === 'completed' ? 'bg-green-500' :
                      plan.status === 'in-progress' ? 'bg-blue-500' :
                      plan.status === 'blocked' ? 'bg-red-500' :
                      'bg-gray-400'
                    }`}
                    style={{
                      width: plan.status === 'completed' ? '100%' :
                             plan.status === 'in-progress' ? '50%' :
                             plan.status === 'blocked' ? '25%' : '0%'
                    }}
                  />
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVerticalIcon className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/actions/${plan.id}`)}>
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/actions/${plan.id}/edit`)}>
                      <Edit2Icon className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicateActionPlan(plan.id)}>
                      <CopyIcon className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDelete(plan.id, plan.title)}
                      className="text-red-600"
                    >
                      <Trash2Icon className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sortedActionPlans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No action plans found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
