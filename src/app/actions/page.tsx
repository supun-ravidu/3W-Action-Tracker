'use client';

import { useState, useEffect } from 'react';
import { useActionPlansStore } from '@/store/actionPlansStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ListIcon,
  LayoutGridIcon,
  CalendarIcon,
  GanttChartIcon,
  PlusIcon,
  FilterIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Priority, Status } from '@/types';
import { TableView, KanbanView, CalendarView, GanttView } from '@/components/actions';
import { CreativeNavBar } from '@/components/CreativeNavBar';
import { ThemeCustomizer } from '@/components/ColorCustomizer';

export default function ActionsPage() {
  const {
    filters,
    setFilters,
    resetFilters,
    viewMode,
    setViewMode,
    loadActionPlansFromFirestore,
    actionPlans,
  } = useActionPlansStore();

  const [showFilters, setShowFilters] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load action plans from Firestore on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadActionPlansFromFirestore();
      setLoading(false);
    };
    loadData();
  }, [loadActionPlansFromFirestore]);

  const priorityOptions: Priority[] = ['critical', 'high', 'medium', 'low'];
  const statusOptions: Status[] = ['pending', 'in-progress', 'completed', 'blocked'];

  const activeFiltersCount = 
    filters.status.length + 
    filters.priority.length + 
    filters.assignees.length + 
    filters.tags.length +
    (filters.searchQuery ? 1 : 0) +
    (filters.dateRange.start || filters.dateRange.end ? 1 : 0);

  const handleStatusFilter = (status: Status) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    setFilters({ status: newStatus });
  };

  const handlePriorityFilter = (priority: Priority) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    setFilters({ priority: newPriority });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 hover:bg-red-600';
      case 'high': return 'bg-orange-500 hover:bg-orange-600';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low': return 'bg-green-500 hover:bg-green-600';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'completed': return 'bg-green-500 hover:bg-green-600';
      case 'in-progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'pending': return 'bg-gray-500 hover:bg-gray-600';
      case 'blocked': return 'bg-red-500 hover:bg-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Creative Navigation Bar */}
      <CreativeNavBar
        showCustomizer={showCustomizer}
        setShowCustomizer={setShowCustomizer}
      />

      {/* Theme Customizer Panel */}
      {showCustomizer && (
        <div className="fixed top-0 right-0 h-screen w-full md:w-96 bg-background border-l shadow-2xl z-40 overflow-y-auto p-6">
          <button
            onClick={() => setShowCustomizer(false)}
            className="absolute top-4 right-4 text-2xl"
          >
            ✕
          </button>
          <ThemeCustomizer />
        </div>
      )}

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Action Plans</h1>
            <p className="text-gray-600">Manage and track all action items</p>
          </div>
          <Link href="/actions/new">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <PlusIcon className="w-4 h-4 mr-2" />
              New Action Plan
            </Button>
          </Link>
        </div>

        {/* View Mode Switcher & Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <ListIcon className="w-4 h-4 mr-2" />
                Table
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <LayoutGridIcon className="w-4 h-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === 'gantt' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('gantt')}
              >
                <GanttChartIcon className="w-4 h-4 mr-2" />
                Gantt
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search action plans..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ searchQuery: e.target.value })}
                  className="pl-9 w-64"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2" variant="secondary">{activeFiltersCount}</Badge>
                )}
              </Button>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t space-y-4">
              {/* Status Filters */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <Badge
                      key={status}
                      className={`cursor-pointer ${
                        filters.status.includes(status)
                          ? getStatusColor(status) + ' text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => handleStatusFilter(status)}
                    >
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Priority Filters */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
                <div className="flex flex-wrap gap-2">
                  {priorityOptions.map(priority => (
                    <Badge
                      key={priority}
                      className={`cursor-pointer ${
                        filters.priority.includes(priority)
                          ? getPriorityColor(priority) + ' text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => handlePriorityFilter(priority)}
                    >
                      {priority}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">From Date</label>
                  <Input
                    type="date"
                    value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setFilters({ 
                      dateRange: { 
                        ...filters.dateRange, 
                        start: e.target.value ? new Date(e.target.value) : undefined 
                      } 
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">To Date</label>
                  <Input
                    type="date"
                    value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setFilters({ 
                      dateRange: { 
                        ...filters.dateRange, 
                        end: e.target.value ? new Date(e.target.value) : undefined 
                      } 
                    })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading action plans from Firestore...</p>
              </div>
            </div>
          ) : actionPlans.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No action plans yet</h3>
              <p className="text-gray-600 mb-6">Create your first action plan to get started!</p>
              <Link href="/actions/new">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Action Plan
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {viewMode === 'table' && <TableView />}
              {viewMode === 'kanban' && <KanbanView />}
              {viewMode === 'calendar' && <CalendarView />}
              {viewMode === 'gantt' && <GanttView />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
