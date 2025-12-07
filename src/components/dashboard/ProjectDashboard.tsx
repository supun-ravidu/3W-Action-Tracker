'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useProjectsStore } from '@/store/projectsStore';
import { getAllWorkspacesFromFirestore } from '@/lib/firestoreUtils';
import { useProjects } from '@/contexts/ProjectsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  FolderKanban,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Target,
  DollarSign,
  Calendar,
  ArrowRight,
  Briefcase,
  Sparkles,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import { RealtimeSyncIndicator } from '@/components/ui/RealtimeSyncIndicator';

const ProjectDashboard = () => {
  const { projects: contextProjects, loading: contextLoading, isConnected, lastUpdate, recentlyAddedIds } = useProjects();
  const { workspaces, getProjectStats, getWorkspaceProjects, setProjects, setWorkspaces } = useProjectsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'on-hold' | 'archived'>('all');
  const [workspaceFilter, setWorkspaceFilter] = useState<'all' | string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [newProjectNotification, setNewProjectNotification] = useState<string | null>(null);
  const [prevProjectCount, setPrevProjectCount] = useState(0);

  // Load workspaces and sync projects from context
  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const workspacesResult = await getAllWorkspacesFromFirestore();
        if (workspacesResult.success && workspacesResult.data) {
          setWorkspaces(workspacesResult.data);
        }
        setIsMounted(true);
      } catch (error) {
        console.error('Error loading workspaces:', error);
        setIsMounted(true);
      }
    };

    loadWorkspaces();
  }, [setWorkspaces]);

  // Sync projects from context to store
  useEffect(() => {
    if (contextProjects.length > 0) {
      // Check for new projects
      if (prevProjectCount > 0 && contextProjects.length > prevProjectCount) {
        const newCount = contextProjects.length - prevProjectCount;
        setNewProjectNotification(`🎉 ${newCount} new project${newCount > 1 ? 's' : ''} added!`);
        setTimeout(() => setNewProjectNotification(null), 8000);
      }
      
      setProjects(contextProjects as any);
      setPrevProjectCount(contextProjects.length);
    }
  }, [contextProjects, setProjects, prevProjectCount]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return contextProjects.filter((project) => {
      const matchesSearch =
        searchQuery === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

      const matchesWorkspace =
        workspaceFilter === 'all' || project.workspace === workspaceFilter;

      return matchesSearch && matchesStatus && matchesWorkspace;
    });
  }, [contextProjects, searchQuery, statusFilter, workspaceFilter]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const totalProjects = filteredProjects.length;
    const activeProjects = filteredProjects.filter((p) => p.status === 'active').length;
    const totalActions = filteredProjects.reduce((sum, p) => sum + p.actionPlans.length, 0);
    const avgProgress =
      filteredProjects.reduce((sum, p) => sum + p.progress, 0) / (totalProjects || 1);
    const totalBudget = filteredProjects.reduce(
      (sum, p) => sum + (p.budget?.allocated || 0),
      0
    );
    const totalSpent = filteredProjects.reduce((sum, p) => sum + (p.budget?.spent || 0), 0);

    return {
      totalProjects,
      activeProjects,
      totalActions,
      avgProgress: Math.round(avgProgress),
      totalBudget,
      totalSpent,
      budgetUtilization: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
    };
  }, [filteredProjects]);

  // Memoize workspace project counts to prevent hydration mismatch
  const workspaceProjectCounts = useMemo(() => {
    if (!isMounted) return {};
    const counts: Record<string, number> = {};
    workspaces.forEach((workspace) => {
      counts[workspace.id] = getWorkspaceProjects(workspace.id).length;
    });
    return counts;
  }, [workspaces, contextProjects, getWorkspaceProjects, isMounted]);

  const getHealthStatusColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-50';
    if (progress >= 60) return 'text-blue-600 bg-blue-50';
    if (progress >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getHealthStatusIcon = (progress: number) => {
    if (progress >= 80) return <CheckCircle2 className="h-4 w-4" />;
    if (progress >= 60) return <TrendingUp className="h-4 w-4" />;
    if (progress >= 40) return <Clock className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysRemaining = (targetDate: Date | string) => {
    const date = targetDate instanceof Date ? targetDate : new Date(targetDate);
    const days = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Show loading state
  if (contextLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-muted-foreground">Loading projects and workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-Time Sync Indicator */}
      <RealtimeSyncIndicator 
        isConnected={isConnected}
        lastSync={lastUpdate || new Date()}
        showOnlyWhenActive={false}
      />

      {/* New Project Notification */}
      <AnimatePresence>
        {newProjectNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-4 rounded-2xl shadow-2xl border-2 border-white/20"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
              <p className="font-bold text-lg flex-1">{newProjectNotification}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNewProjectNotification(null)}
                className="text-white hover:bg-white/20"
              >
                Dismiss
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects & Workspaces</h1>
          <p className="text-muted-foreground">
            Manage your projects and track 3W progress across workspaces
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FolderKanban className="h-4 w-4 mr-2" />
            Manage Workspaces
          </Button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="sm" 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {overallStats.activeProjects} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalActions}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.avgProgress}%</div>
            <Progress value={overallStats.avgProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.budgetUtilization}%</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(overallStats.totalSpent)} / {formatCurrency(overallStats.totalBudget)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={workspaceFilter}
              onValueChange={(value: any) => setWorkspaceFilter(value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Workspace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workspaces</SelectItem>
                {workspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Projects ({filteredProjects.length})</TabsTrigger>
          {workspaces.map((workspace) => (
            <TabsTrigger key={workspace.id} value={workspace.id}>
              {workspace.name} ({workspaceProjectCounts[workspace.id] || 0})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ProjectsGrid projects={filteredProjects} viewMode={viewMode} recentlyAddedIds={recentlyAddedIds} />
        </TabsContent>

        {workspaces.map((workspace) => (
          <TabsContent key={workspace.id} value={workspace.id} className="space-y-4">
            <ProjectsGrid
              projects={getWorkspaceProjects(workspace.id)}
              viewMode={viewMode}
              recentlyAddedIds={recentlyAddedIds}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Create Project Modal */}
      <CreateProjectModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />
    </div>
  );
};

// Projects Grid/List Component
const ProjectsGrid = ({
  projects,
  viewMode,
  recentlyAddedIds = new Set<string>(),
}: {
  projects: any[];
  viewMode: 'grid' | 'list';
  recentlyAddedIds?: Set<string>;
}) => {
  const { getProjectStats } = useProjectsStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getHealthStatusColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-50';
    if (progress >= 60) return 'text-blue-600 bg-blue-50';
    if (progress >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getHealthStatusIcon = (progress: number) => {
    if (progress >= 80) return <CheckCircle2 className="h-4 w-4" />;
    if (progress >= 60) return <TrendingUp className="h-4 w-4" />;
    if (progress >= 40) return <Clock className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const getDaysRemaining = (targetDate: Date | string) => {
    const date = targetDate instanceof Date ? targetDate : new Date(targetDate);
    const days = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground text-center mb-4">
            Get started by creating your first project
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {projects.map((project) => {
          const stats = getProjectStats(project.id);
          const daysRemaining = isMounted ? getDaysRemaining(project.targetEndDate) : 0;

          return (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${project.color}20` }}
                    >
                      {project.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <Badge
                          variant={project.status === 'active' ? 'default' : 'secondary'}
                        >
                          {project.status}
                        </Badge>
                        {project.id && recentlyAddedIds.has(project.id) && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                              <Star className="h-3 w-3 mr-1" />
                              NEW
                            </Badge>
                          </motion.div>
                        )}
                        {isMounted && stats && (
                          <Badge
                            variant="outline"
                            className={getHealthStatusColor(project.progress)}
                          >
                            {getHealthStatusIcon(project.progress)}
                            <span className="ml-1">{stats.healthStatus}</span>
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {project.description}
                      </p>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{project.teamMembers.length} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span>{project.actionPlans.length} actions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {!isMounted ? 'Loading...' : daysRemaining > 0
                              ? `${daysRemaining} days remaining`
                              : `${Math.abs(daysRemaining)} days overdue`}
                          </span>
                        </div>
                        {project.budget && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {formatCurrency(project.budget.spent)} /{' '}
                              {formatCurrency(project.budget.allocated)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{project.progress}%</div>
                      <p className="text-xs text-muted-foreground">Complete</p>
                    </div>
                    <Progress value={project.progress} className="w-32" />
                    <Link href={`/projects/${project.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => {
        const stats = getProjectStats(project.id);
        const daysRemaining = isMounted ? getDaysRemaining(project.targetEndDate) : 0;

        return (
          <motion.div
            key={project.id}
            initial={project.id && recentlyAddedIds.has(project.id) ? { scale: 0, rotate: -10 } : false}
            animate={project.id && recentlyAddedIds.has(project.id) ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Card className={`hover:shadow-lg transition-shadow ${project.id && recentlyAddedIds.has(project.id) ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${project.color}20` }}
                  >
                    {project.icon}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                    {project.id && recentlyAddedIds.has(project.id) && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                      >
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                          <Star className="h-3 w-3 mr-1" />
                          NEW
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </div>
                <CardTitle className="line-clamp-1">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-semibold">{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
              </div>

              {isMounted && stats && (
                <div
                  className={`flex items-center gap-2 p-2 rounded-md ${getHealthStatusColor(
                    project.progress
                  )}`}
                >
                  {getHealthStatusIcon(project.progress)}
                  <span className="text-sm font-medium capitalize">
                    {stats.healthStatus}
                  </span>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Team</span>
                  <span className="font-medium">{project.teamMembers.length} members</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Actions</span>
                  <span className="font-medium">{project.actionPlans.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time Left</span>
                  <span
                    className={`font-medium ${
                      daysRemaining < 0 ? 'text-red-600' : ''
                    }`}
                  >
                    {!isMounted ? '...' : daysRemaining > 0 ? `${daysRemaining}d` : `${Math.abs(daysRemaining)}d overdue`}
                  </span>
                </div>
                {project.budget && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">
                      {Math.round((project.budget.spent / project.budget.allocated) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Link href={`/projects/${project.id}`} className="flex-1">
                  <Button variant="default" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProjectDashboard;
