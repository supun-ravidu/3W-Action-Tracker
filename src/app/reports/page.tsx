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
import { CreativeNavBar } from '@/components/CreativeNavBar';
import {
  BarChart3,
  FileText,
  TrendingUp,
  AlertCircle,
  Calendar,
  Download,
  RefreshCw,
  Activity,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  Sparkles,
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
      <>
        <CreativeNavBar />
        <div className="min-h-screen relative overflow-hidden">
          {/* Animated Background */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
          </div>

          <div className="container mx-auto px-4 pt-24 pb-16">
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                <BarChart3 className="h-24 w-24 text-indigo-600 relative" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                No Data Available
              </h2>
              <p className="text-gray-600 text-center max-w-md text-lg">
                There are no action plans to generate reports from. Create some action plans first to see analytics and insights.
              </p>
              <Button 
                onClick={() => window.location.href = '/actions'}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-6 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create Your First Action Plan
              </Button>
            </div>
          </div>
        </div>
      </>
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
    <>
      <CreativeNavBar />
      
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 pt-24 pb-8 space-y-8">
          {/* Hero Header */}
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-2">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-fade-in">
                  Reports & Analytics
                </h1>
                <p className="text-gray-600 text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Comprehensive insights into team performance and project health
                </p>
              </div>
              <div className="flex items-center gap-3">
                {getHealthBadge()}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats with Modern Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Completion Rate Card */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Completion Rate
                  </CardTitle>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {metrics.teamPerformance.completionRate.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {metrics.teamPerformance.totalCompleted} of {metrics.teamPerformance.totalCompleted + metrics.teamPerformance.totalInProgress + metrics.teamPerformance.totalPending} tasks
                </p>
              </CardContent>
            </Card>

            {/* Avg Cycle Time Card */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Avg. Cycle Time
                  </CardTitle>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {metrics.cycleTimeMetrics.averageCycleTime.toFixed(1)}
                </div>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  days from creation to completion
                </p>
              </CardContent>
            </Card>

            {/* Active Bottlenecks Card */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
              <div className={`absolute top-0 right-0 w-32 h-32 ${metrics.bottlenecks.length > 0 ? 'bg-gradient-to-br from-red-400 to-orange-500' : 'bg-gradient-to-br from-green-400 to-emerald-500'} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`} />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Active Bottlenecks
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-xl ${metrics.bottlenecks.length > 0 ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-green-500 to-emerald-500'} flex items-center justify-center`}>
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-4xl font-bold ${metrics.bottlenecks.length > 0 ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-green-600 to-emerald-600'} bg-clip-text text-transparent`}>
                  {metrics.bottlenecks.length}
                </div>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  tasks requiring attention
                </p>
              </CardContent>
            </Card>

            {/* Overall Progress Card */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Overall Progress
                  </CardTitle>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {metrics.projectHealth.overallProgress.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  project completion status
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Export Actions - Modern Design */}
          <Card className="relative overflow-hidden border-0 bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Export & Share</CardTitle>
                  <CardDescription className="text-base">
                    Generate reports and share insights with stakeholders
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
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

          {/* Main Content Tabs - Modern Design */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-2 border-0">
              <TabsList className="grid w-full grid-cols-5 bg-transparent gap-2">
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="performance"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Performance
                </TabsTrigger>
                <TabsTrigger 
                  value="trends"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Trends
                </TabsTrigger>
                <TabsTrigger 
                  value="bottlenecks"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Bottlenecks
                </TabsTrigger>
                <TabsTrigger 
                  value="forecasting"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Forecasting
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              <ProjectHealthReport metrics={metrics.projectHealth} />
              <TeamPerformanceReport metrics={metrics.teamPerformance} />
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6 animate-fade-in">
              <TeamPerformanceReport metrics={metrics.teamPerformance} />
              <IndividualPerformanceReport reports={metrics.individualReports} />
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-6 animate-fade-in">
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
            <TabsContent value="bottlenecks" className="space-y-6 animate-fade-in">
              <BottleneckAnalysisComponent bottlenecks={metrics.bottlenecks} />
          
              {metrics.bottlenecks.length > 0 && (
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">Recommendations</CardTitle>
                        <CardDescription className="text-base">
                          Actions to resolve bottlenecks and improve flow
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-100 hover:border-blue-300 transition-all group">
                        <div className="rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:scale-110 transition-transform">1</div>
                        <div>
                          <div className="font-semibold text-gray-900">Review blocked tasks daily</div>
                          <div className="text-sm text-gray-600 mt-1">Hold a daily standup to identify and resolve blockers quickly</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-100 hover:border-blue-300 transition-all group">
                        <div className="rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:scale-110 transition-transform">2</div>
                        <div>
                          <div className="font-semibold text-gray-900">Redistribute workload</div>
                          <div className="text-sm text-gray-600 mt-1">Consider reassigning tasks from overloaded team members</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-100 hover:border-blue-300 transition-all group">
                        <div className="rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:scale-110 transition-transform">3</div>
                        <div>
                          <div className="font-semibold text-gray-900">Add supporting members</div>
                          <div className="text-sm text-gray-600 mt-1">Assign additional team members to high-priority stuck tasks</div>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Forecasting Tab */}
            <TabsContent value="forecasting" className="space-y-6 animate-fade-in">
              <ForecastingComponent forecasts={metrics.forecasts} />
          
              <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">About Forecasting</CardTitle>
                      <CardDescription className="text-base">
                        How we predict completion dates
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-base">
                    <p className="text-gray-700">
                      Our forecasting model uses historical data and current task status to predict completion dates:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
                        <Zap className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-900">Historical Cycle Times:</strong>
                          <span className="text-gray-600"> We analyze average completion times for tasks of similar priority</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
                        <Activity className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-900">Current Status:</strong>
                          <span className="text-gray-600"> Tasks in progress are weighted to complete faster than pending tasks</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
                        <Target className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-900">Dependencies:</strong>
                          <span className="text-gray-600"> Tasks with multiple dependencies have adjusted timelines</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
                        <AlertCircle className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-900">Blockers:</strong>
                          <span className="text-gray-600"> Blocked tasks are assumed to take 50% longer than average</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
                        <CheckCircle2 className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-900">Confidence Levels:</strong>
                          <span className="text-gray-600"> Based on task predictability and complexity factors</span>
                        </div>
                      </li>
                    </ul>
                    <div className="rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 p-4 mt-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-900">
                          <strong>Note:</strong> Forecasts are estimates based on historical patterns. Actual completion dates may vary based on changing priorities, unforeseen blockers, or scope changes.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
