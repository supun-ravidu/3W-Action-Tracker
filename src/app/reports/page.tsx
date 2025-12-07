'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useActionPlansStore } from '@/store/actionPlansStore';
import {
  calculateTeamPerformance,
  calculateIndividualReports,
  calculateProjectHealth,
  identifyBottlenecks,
  calculateCompletionTrends,
  calculateCycleTimeMetrics,
  generateForecasts,
} from '@/lib/analyticsUtils';
import { TeamPerformanceReport } from '@/components/reports/TeamPerformanceReport';
import { IndividualPerformanceReport } from '@/components/reports/IndividualPerformanceReport';
import { ProjectHealthReport } from '@/components/reports/ProjectHealthReport';
import { BottleneckAnalysisComponent } from '@/components/reports/BottleneckAnalysis';
import { CompletionTrendsComponent } from '@/components/reports/CompletionTrends';
import { CycleTimeAnalysisComponent } from '@/components/reports/CycleTimeAnalysis';
import { ForecastingComponent } from '@/components/reports/ForecastingChart';
import { PDFExport } from '@/components/reports/PDFExport';
import { ExcelExport } from '@/components/reports/ExcelExport';
import { ShareableLink } from '@/components/reports/ShareableLink';
import {
  BarChart3,
  FileText,
  TrendingUp,
  AlertCircle,
  Calendar,
  Download,
  RefreshCw,
} from 'lucide-react';

export default function ReportsPage() {
  const { actionPlans, teamMembers } = useActionPlansStore();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    end: new Date(),
  });

  // Check if data is available
  if (!actionPlans || actionPlans.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <BarChart3 className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">No Data Available</h2>
          <p className="text-muted-foreground text-center max-w-md">
            There are no action plans to generate reports from. Create some action plans first to see analytics and insights.
          </p>
          <Button onClick={() => window.location.href = '/actions'}>
            Go to Actions
          </Button>
        </div>
      </div>
    );
  }

  // Calculate all metrics
  const metrics = useMemo(() => {
    try {
      const teamPerformance = calculateTeamPerformance(actionPlans, dateRange.start, dateRange.end);
      const individualReports = calculateIndividualReports(actionPlans, teamMembers || []);
      const projectHealth = calculateProjectHealth(actionPlans);
      const bottlenecks = identifyBottlenecks(actionPlans);
      
      const dailyTrend = calculateCompletionTrends(actionPlans, 'daily');
      const weeklyTrend = calculateCompletionTrends(actionPlans, 'weekly');
      const monthlyTrend = calculateCompletionTrends(actionPlans, 'monthly');
      const quarterlyTrend = calculateCompletionTrends(actionPlans, 'quarterly');
      
      const cycleTimeMetrics = calculateCycleTimeMetrics(actionPlans);
      const forecasts = generateForecasts(actionPlans, cycleTimeMetrics);

      return {
        teamPerformance,
        individualReports,
        projectHealth,
        bottlenecks,
        dailyTrend,
        weeklyTrend,
        monthlyTrend,
        quarterlyTrend,
        cycleTimeMetrics,
        forecasts,
      };
    } catch (error) {
      console.error('Error calculating metrics:', error);
      // Return default values
      return {
        teamPerformance: {
          completionRate: 0,
          averageCompletionTime: 0,
          totalCompleted: 0,
          totalInProgress: 0,
          totalPending: 0,
          totalBlocked: 0,
          onTimeCompletionRate: 0,
          overdueCount: 0,
          period: { start: dateRange.start, end: dateRange.end },
        },
        individualReports: [],
        projectHealth: {
          overallProgress: 0,
          velocityTrend: 'stable' as const,
          riskLevel: 'low' as const,
          statusDistribution: { completed: 0, 'in-progress': 0, pending: 0, blocked: 0 },
          priorityDistribution: { critical: 0, high: 0, medium: 0, low: 0 },
          upcomingDeadlines: 0,
          overdueActions: 0,
          blockersCount: 0,
          averageCycleTime: 0,
        },
        bottlenecks: [],
        dailyTrend: { period: 'daily' as const, data: [], currentPeriod: { label: '', value: 0, date: new Date() }, previousPeriod: { label: '', value: 0, date: new Date() }, percentageChange: 0 },
        weeklyTrend: { period: 'weekly' as const, data: [], currentPeriod: { label: '', value: 0, date: new Date() }, previousPeriod: { label: '', value: 0, date: new Date() }, percentageChange: 0 },
        monthlyTrend: { period: 'monthly' as const, data: [], currentPeriod: { label: '', value: 0, date: new Date() }, previousPeriod: { label: '', value: 0, date: new Date() }, percentageChange: 0 },
        quarterlyTrend: { period: 'quarterly' as const, data: [], currentPeriod: { label: '', value: 0, date: new Date() }, previousPeriod: { label: '', value: 0, date: new Date() }, percentageChange: 0 },
        cycleTimeMetrics: { averageCycleTime: 0, byPriority: { critical: 0, high: 0, medium: 0, low: 0 }, byAssignee: {}, trend: [], median: 0, percentile90: 0 },
        forecasts: [],
      };
    }
  }, [actionPlans, teamMembers, dateRange]);

  const handleRefresh = () => {
    // In a real app, this would refetch data from the server
    window.location.reload();
  };

  const getHealthBadge = () => {
    const { riskLevel } = metrics.projectHealth;
    switch (riskLevel) {
      case 'low':
        return <Badge className="bg-green-600">Healthy</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-600">Attention Needed</Badge>;
      case 'high':
        return <Badge className="bg-orange-600">At Risk</Badge>;
      case 'critical':
        return <Badge className="bg-red-600">Critical</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into team performance and project health
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getHealthBadge()}
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.teamPerformance.completionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.teamPerformance.totalCompleted} of {metrics.teamPerformance.totalCompleted + metrics.teamPerformance.totalInProgress + metrics.teamPerformance.totalPending} tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Cycle Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.cycleTimeMetrics.averageCycleTime.toFixed(1)} days
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From creation to completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Bottlenecks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.bottlenecks.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {metrics.bottlenecks.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.projectHealth.overallProgress.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Project completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export & Share
          </CardTitle>
          <CardDescription>
            Generate reports and share insights with stakeholders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <PDFExport
              data={metrics}
              reportTitle="Action Plans Analytics Report"
            />
            <ExcelExport
              actionPlans={actionPlans}
              additionalData={metrics}
            />
            <ShareableLink
              reportData={metrics}
              reportType="performance"
              reportTitle="Performance Dashboard"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="trends">
            <Calendar className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="bottlenecks">
            <AlertCircle className="h-4 w-4 mr-2" />
            Bottlenecks
          </TabsTrigger>
          <TabsTrigger value="forecasting">
            <FileText className="h-4 w-4 mr-2" />
            Forecasting
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <ProjectHealthReport metrics={metrics.projectHealth} />
          <TeamPerformanceReport metrics={metrics.teamPerformance} />
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <TeamPerformanceReport metrics={metrics.teamPerformance} />
          <IndividualPerformanceReport reports={metrics.individualReports} />
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <CompletionTrendsComponent
            dailyTrend={metrics.dailyTrend}
            weeklyTrend={metrics.weeklyTrend}
            monthlyTrend={metrics.monthlyTrend}
            quarterlyTrend={metrics.quarterlyTrend}
          />
          <CycleTimeAnalysisComponent
            metrics={metrics.cycleTimeMetrics}
            teamMembers={teamMembers}
          />
        </TabsContent>

        {/* Bottlenecks Tab */}
        <TabsContent value="bottlenecks" className="space-y-6">
          <BottleneckAnalysisComponent bottlenecks={metrics.bottlenecks} />
          
          {metrics.bottlenecks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Actions to resolve bottlenecks and improve flow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="rounded-full bg-blue-600 text-white w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <div className="font-medium">Review blocked tasks daily</div>
                      <div className="text-sm text-muted-foreground">Hold a daily standup to identify and resolve blockers quickly</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="rounded-full bg-blue-600 text-white w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <div className="font-medium">Redistribute workload</div>
                      <div className="text-sm text-muted-foreground">Consider reassigning tasks from overloaded team members</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="rounded-full bg-blue-600 text-white w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <div className="font-medium">Add supporting members</div>
                      <div className="text-sm text-muted-foreground">Assign additional team members to high-priority stuck tasks</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-6">
          <ForecastingComponent forecasts={metrics.forecasts} />
          
          <Card>
            <CardHeader>
              <CardTitle>About Forecasting</CardTitle>
              <CardDescription>
                How we predict completion dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>
                  Our forecasting model uses historical data and current task status to predict completion dates:
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>Historical Cycle Times:</strong> We analyze average completion times for tasks of similar priority
                  </li>
                  <li>
                    <strong>Current Status:</strong> Tasks in progress are weighted to complete faster than pending tasks
                  </li>
                  <li>
                    <strong>Dependencies:</strong> Tasks with multiple dependencies have adjusted timelines
                  </li>
                  <li>
                    <strong>Blockers:</strong> Blocked tasks are assumed to take 50% longer than average
                  </li>
                  <li>
                    <strong>Confidence Levels:</strong> Based on task predictability and complexity factors
                  </li>
                </ul>
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 mt-4">
                  <p className="text-yellow-900">
                    <strong>Note:</strong> Forecasts are estimates based on historical patterns. Actual completion dates may vary based on changing priorities, unforeseen blockers, or scope changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
