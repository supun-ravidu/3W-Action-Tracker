'use client';

import React, { useState } from 'react';
import { useProjectsStore } from '@/store/projectsStore';
import { useActionPlansStore } from '@/store/actionPlansStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Calendar,
  Users,
  Target,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Link as LinkIcon,
  Edit,
  MoreVertical,
  GitBranch,
} from 'lucide-react';
import Link from 'next/link';

interface ProjectDetailViewProps {
  projectId: string;
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ projectId }) => {
  const { projects, getProjectStats } = useProjectsStore();
  const { actionPlans } = useActionPlansStore();
  const [activeTab, setActiveTab] = useState('overview');

  const project = projects.find((p) => p.id === projectId);
  const stats = getProjectStats(projectId);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Project not found</h3>
        <Link href="/projects">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const projectActionPlans = actionPlans.filter((ap) =>
    project.actionPlans.includes(ap.id)
  );

  const getDaysRemaining = (targetDate: Date | string) => {
    const date = targetDate instanceof Date ? targetDate : new Date(targetDate);
    const days = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getHealthStatusColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-50';
    if (progress >= 60) return 'text-blue-600 bg-blue-50';
    if (progress >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const daysRemaining = getDaysRemaining(project.targetEndDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${project.color}20` }}
            >
              {project.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
                {stats && (
                  <Badge variant="outline" className={getHealthStatusColor(project.progress)}>
                    {stats.healthStatus}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{project.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={project.lead.avatar} />
                  <AvatarFallback>{project.lead.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  Led by {project.lead.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
            <Progress value={project.progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Remaining</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${daysRemaining < 0 ? 'text-red-600' : ''}`}>
              {daysRemaining > 0 ? `${daysRemaining}d` : `${Math.abs(daysRemaining)}d overdue`}
            </div>
            <p className="text-xs text-muted-foreground">
              Due {new Date(project.targetEndDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">Team members</p>
          </CardContent>
        </Card>

        {project.budget && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((project.budget.spent / project.budget.allocated) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(project.budget.spent)} / {formatCurrency(project.budget.allocated)}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="actions">
            Actions ({projectActionPlans.length})
          </TabsTrigger>
          <TabsTrigger value="team">Team ({project.teamMembers.length})</TabsTrigger>
          <TabsTrigger value="dependencies">
            Dependencies ({project.dependencies.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Stats */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Total Actions</div>
                      <div className="text-2xl font-bold">{stats.totalActions}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Completed</div>
                      <div className="text-2xl font-bold text-green-600">
                        {stats.completedActions}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">In Progress</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.inProgressActions}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Pending</div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {stats.pendingActions}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-semibold">{stats.completionRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg. Cycle Time</span>
                      <span className="font-semibold">{stats.averageCycleTime} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Overdue Actions</span>
                      <span className="font-semibold text-red-600">{stats.overdueActions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Start Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {new Date(project.startDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Target End Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {new Date(project.targetEndDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {project.actualEndDate && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Actual End Date</div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="font-medium">
                        {new Date(project.actualEndDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Duration</div>
                  <div className="text-2xl font-bold">
                    {Math.ceil(
                      (new Date(project.targetEndDate).getTime() - new Date(project.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Action Plans</CardTitle>
              <CardDescription>
                All action plans associated with this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projectActionPlans.length > 0 ? (
                <div className="space-y-3">
                  {projectActionPlans.map((action) => (
                    <Link key={action.id} href={`/actions/${action.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{action.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {action.what.description}
                              </p>
                              <div className="flex items-center gap-3">
                                <Badge>{action.status}</Badge>
                                <Badge variant="outline">{action.priority}</Badge>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(action.when.dueDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No action plans yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People working on this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                    {member.role && <Badge variant="outline">{member.role}</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dependencies Tab */}
        <TabsContent value="dependencies">
          <Card>
            <CardHeader>
              <CardTitle>Project Dependencies</CardTitle>
              <CardDescription>Cross-project relationships and blockers</CardDescription>
            </CardHeader>
            <CardContent>
              {project.dependencies.length > 0 ? (
                <div className="space-y-3">
                  {project.dependencies.map((dep) => {
                    const dependentProject = projects.find(
                      (p) => p.id === dep.dependsOnProjectId
                    );
                    return (
                      <Card key={dep.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <GitBranch className="h-5 w-5 text-muted-foreground mt-1" />
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">
                                    {dependentProject?.name || 'Unknown Project'}
                                  </span>
                                  <Badge variant="outline">{dep.dependencyType}</Badge>
                                  <Badge
                                    variant={
                                      dep.status === 'resolved' ? 'default' : 'secondary'
                                    }
                                  >
                                    {dep.status}
                                  </Badge>
                                </div>
                                {dep.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {dep.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No dependencies defined
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailView;
