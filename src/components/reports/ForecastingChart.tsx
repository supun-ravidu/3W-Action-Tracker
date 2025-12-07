'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ForecastData } from '@/types';
import { Calendar, TrendingUp, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface ForecastingProps {
  forecasts: ForecastData[];
}

export function ForecastingComponent({ forecasts }: ForecastingProps) {
  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return { label: 'High Confidence', variant: 'default' as const, color: 'bg-green-600' };
      case 'medium':
        return { label: 'Medium Confidence', variant: 'secondary' as const, color: 'bg-yellow-600' };
      case 'low':
        return { label: 'Low Confidence', variant: 'outline' as const, color: 'bg-orange-600' };
      default:
        return { label: 'Unknown', variant: 'outline' as const, color: 'bg-gray-600' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'blocked':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getDaysRemainingColor = (days: number) => {
    if (days < 0) return 'text-red-600';
    if (days <= 3) return 'text-orange-600';
    if (days <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Sort by days remaining (urgent first)
  const sortedForecasts = [...forecasts].sort((a, b) => a.daysRemaining - b.daysRemaining);

  // Get summary stats
  const averageDaysRemaining = forecasts.length > 0
    ? forecasts.reduce((sum, f) => sum + f.daysRemaining, 0) / forecasts.length
    : 0;

  const urgentCount = forecasts.filter(f => f.daysRemaining <= 3).length;
  const atRiskCount = forecasts.filter(f => f.riskFactors.length > 0).length;
  const highConfidenceCount = forecasts.filter(f => f.confidence === 'high').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Completion Forecasts
        </CardTitle>
        <CardDescription>
          Predicted completion dates based on historical data and current progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Avg. Days Remaining</div>
            <div className="text-2xl font-bold">{averageDaysRemaining.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground mt-1">Until completion</div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Urgent Tasks</div>
            <div className="text-2xl font-bold text-orange-600">{urgentCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Due within 3 days</div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">At Risk</div>
            <div className="text-2xl font-bold text-red-600">{atRiskCount}</div>
            <div className="text-xs text-muted-foreground mt-1">With risk factors</div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">High Confidence</div>
            <div className="text-2xl font-bold text-green-600">{highConfidenceCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Reliable forecasts</div>
          </div>
        </div>

        {/* Forecast List */}
        {sortedForecasts.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-semibold">Predicted Completion Dates</h4>
            {sortedForecasts.map((forecast) => {
              const confidenceBadge = getConfidenceBadge(forecast.confidence);
              const isOverdue = forecast.daysRemaining < 0;
              const isUrgent = forecast.daysRemaining <= 3 && forecast.daysRemaining >= 0;

              return (
                <div
                  key={forecast.actionPlanId}
                  className={`rounded-lg border-2 p-4 ${
                    isOverdue ? 'border-red-200 bg-red-50' :
                    isUrgent ? 'border-orange-200 bg-orange-50' :
                    'border-gray-200'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-semibold mb-1">{forecast.actionTitle}</h5>
                      <Badge variant="outline" className={getStatusColor(forecast.currentStatus)}>
                        {forecast.currentStatus}
                      </Badge>
                    </div>
                    <Badge variant={confidenceBadge.variant}>{confidenceBadge.label}</Badge>
                  </div>

                  {/* Forecast Date */}
                  <div className="grid gap-4 md:grid-cols-2 mb-3">
                    <div className="flex items-center gap-3 rounded-lg bg-white/50 p-3 border">
                      <Calendar className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="text-sm text-muted-foreground">Estimated Completion</div>
                        <div className="font-bold">
                          {forecast.estimatedCompletionDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-white/50 p-3 border">
                      <Clock className="h-8 w-8 text-purple-600" />
                      <div>
                        <div className="text-sm text-muted-foreground">Days Remaining</div>
                        <div className={`font-bold ${getDaysRemainingColor(forecast.daysRemaining)}`}>
                          {isOverdue ? (
                            <span>Overdue by {Math.abs(forecast.daysRemaining)} days</span>
                          ) : (
                            <span>{forecast.daysRemaining} days</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Factors Considered */}
                  {forecast.factorsConsidered.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Factors Considered:
                      </div>
                      <ul className="space-y-1 text-sm ml-6">
                        {forecast.factorsConsidered.map((factor, index) => (
                          <li key={index} className="list-disc text-muted-foreground">{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Risk Factors */}
                  {forecast.riskFactors.length > 0 && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                      <div className="text-sm font-medium mb-2 flex items-center gap-2 text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        Risk Factors:
                      </div>
                      <ul className="space-y-1 text-sm ml-6">
                        {forecast.riskFactors.map((risk, index) => (
                          <li key={index} className="list-disc text-red-600">{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Forecasts Available</h3>
            <p className="text-sm text-muted-foreground">
              All tasks are completed or there's insufficient data for forecasting.
            </p>
          </div>
        )}

        {/* Forecasting Insights */}
        {sortedForecasts.length > 0 && (
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-semibold mb-2">Forecasting Insights</h4>
            <ul className="space-y-2 text-sm">
              {urgentCount > 0 && (
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <span>{urgentCount} task{urgentCount > 1 ? 's are' : ' is'} predicted to complete within 3 days. Ensure proper focus and resources.</span>
                </li>
              )}
              {atRiskCount > 0 && (
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <span>{atRiskCount} task{atRiskCount > 1 ? 's have' : ' has'} risk factors that may delay completion. Review and mitigate.</span>
                </li>
              )}
              {highConfidenceCount === forecasts.length && forecasts.length > 0 && (
                <li className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>All forecasts have high confidence. Team is performing predictably!</span>
                </li>
              )}
              {forecasts.filter(f => f.confidence === 'low').length > forecasts.length / 2 && (
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <span>Many forecasts have low confidence. This may indicate blockers or unpredictable work patterns.</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>Forecasts are based on historical cycle times and current task status. Actual completion may vary.</span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
