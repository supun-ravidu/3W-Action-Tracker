'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompletionTrend } from '@/types';
import { TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react';
import { useState } from 'react';

interface CompletionTrendsProps {
  dailyTrend: CompletionTrend;
  weeklyTrend: CompletionTrend;
  monthlyTrend: CompletionTrend;
  quarterlyTrend: CompletionTrend;
}

export function CompletionTrendsComponent({
  dailyTrend,
  weeklyTrend,
  monthlyTrend,
  quarterlyTrend,
}: CompletionTrendsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('monthly');

  const getTrendData = () => {
    switch (selectedPeriod) {
      case 'daily':
        return dailyTrend;
      case 'weekly':
        return weeklyTrend;
      case 'quarterly':
        return quarterlyTrend;
      default:
        return monthlyTrend;
    }
  };

  const currentTrend = getTrendData();

  const getTrendIndicator = (change: number) => {
    if (change > 10) {
      return {
        icon: <TrendingUp className="h-5 w-5 text-green-600" />,
        text: 'Significant increase',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      };
    } else if (change > 0) {
      return {
        icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
        text: 'Slight increase',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
      };
    } else if (change < -10) {
      return {
        icon: <TrendingDown className="h-5 w-5 text-red-600" />,
        text: 'Significant decrease',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    } else if (change < 0) {
      return {
        icon: <TrendingDown className="h-5 w-5 text-orange-600" />,
        text: 'Slight decrease',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
      };
    } else {
      return {
        icon: <Calendar className="h-5 w-5 text-gray-600" />,
        text: 'No change',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
      };
    }
  };

  const trendIndicator = getTrendIndicator(currentTrend.percentageChange);

  // Calculate max value for scaling bars
  const maxValue = Math.max(...currentTrend.data.map(d => d.value), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Completion Trends
        </CardTitle>
        <CardDescription>
          Track task completion patterns over time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Period Selector */}
        <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Trend Summary */}
        <div className={`rounded-lg border-2 p-4 ${trendIndicator.bgColor} ${trendIndicator.borderColor}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Current Period</div>
              <div className="text-3xl font-bold">{currentTrend.currentPeriod.value}</div>
              <div className="text-sm text-muted-foreground mt-1">Tasks completed</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">vs Previous</div>
              <div className={`text-2xl font-bold ${trendIndicator.color}`}>
                {currentTrend.percentageChange > 0 ? '+' : ''}
                {currentTrend.percentageChange.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">{trendIndicator.text}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {trendIndicator.icon}
            <span className={`font-medium ${trendIndicator.color}`}>
              {currentTrend.previousPeriod.value} → {currentTrend.currentPeriod.value} tasks
            </span>
          </div>
        </div>

        {/* Bar Chart */}
        <div>
          <h4 className="font-semibold mb-4">Completion History</h4>
          <div className="space-y-3">
            {currentTrend.data.map((item, index) => {
              const barHeight = (item.value / maxValue) * 100;
              const isCurrentPeriod = index === currentTrend.data.length - 1;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className={`font-medium ${isCurrentPeriod ? 'text-blue-600' : ''}`}>
                      {item.label}
                    </span>
                    <Badge variant={isCurrentPeriod ? 'default' : 'outline'}>
                      {item.value}
                    </Badge>
                  </div>
                  <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isCurrentPeriod ? 'bg-blue-600' : 'bg-blue-400'} rounded-full transition-all duration-500`}
                      style={{ width: `${barHeight}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Completed</div>
            <div className="text-2xl font-bold">
              {currentTrend.data.reduce((sum, item) => sum + item.value, 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">In this period</div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Average per Period</div>
            <div className="text-2xl font-bold">
              {(currentTrend.data.reduce((sum, item) => sum + item.value, 0) / currentTrend.data.length).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Tasks completed</div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Peak Performance</div>
            <div className="text-2xl font-bold text-green-600">
              {Math.max(...currentTrend.data.map(d => d.value))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Highest in period</div>
          </div>
        </div>

        {/* Insights */}
        <div className="rounded-lg bg-muted p-4">
          <h4 className="font-semibold mb-2">Trend Insights</h4>
          <ul className="space-y-2 text-sm">
            {currentTrend.percentageChange > 20 && (
              <li className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Outstanding improvement! Task completion rate has increased significantly.</span>
              </li>
            )}
            {currentTrend.percentageChange < -20 && (
              <li className="flex items-start gap-2">
                <TrendingDown className="h-4 w-4 text-red-600 mt-0.5" />
                <span>Completion rate has dropped significantly. Review team capacity and blockers.</span>
              </li>
            )}
            {currentTrend.currentPeriod.value === 0 && (
              <li className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-yellow-600 mt-0.5" />
                <span>No tasks completed in the current period. Check for blockers or capacity issues.</span>
              </li>
            )}
            {Math.max(...currentTrend.data.map(d => d.value)) > currentTrend.currentPeriod.value * 2 && (
              <li className="flex items-start gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>Performance varies significantly. Consider analyzing what enabled peak performance periods.</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
