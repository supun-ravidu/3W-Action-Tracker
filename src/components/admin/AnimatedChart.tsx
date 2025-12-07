'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartData } from '@/lib/adminAnalyticsService';
import { TrendingUp } from 'lucide-react';

interface AnimatedChartProps {
  title: string;
  description: string;
  data: ChartData[];
  type?: 'bar' | 'pie' | 'line';
}

export function AnimatedChart({ title, description, data, type = 'bar' }: AnimatedChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  
  const renderBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.name} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{item.name}</span>
            <span className="text-gray-600 font-semibold">{item.value}</span>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / maxValue) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
              className="absolute h-full rounded-full"
              style={{ backgroundColor: item.color || '#8b5cf6' }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="flex flex-col items-center gap-4">
        {/* Pie chart visualization */}
        <div className="relative w-48 h-48">
          <svg width="192" height="192" viewBox="0 0 192 192">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const startAngle = (cumulativePercentage / 100) * 360;
              const endAngle = startAngle + (percentage / 100) * 360;
              
              const startX = 96 + 80 * Math.cos((Math.PI * startAngle) / 180);
              const startY = 96 + 80 * Math.sin((Math.PI * startAngle) / 180);
              const endX = 96 + 80 * Math.cos((Math.PI * endAngle) / 180);
              const endY = 96 + 80 * Math.sin((Math.PI * endAngle) / 180);
              const largeArc = percentage > 50 ? 1 : 0;

              const pathData = [
                `M 96 96`,
                `L ${startX} ${startY}`,
                `A 80 80 0 ${largeArc} 1 ${endX} ${endY}`,
                'Z',
              ].join(' ');

              cumulativePercentage += percentage;

              return (
                <motion.path
                  key={item.name}
                  d={pathData}
                  fill={item.color || '#8b5cf6'}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 w-full">
          {data.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="flex items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color || '#8b5cf6' }}
              />
              <span className="text-xs text-gray-600 truncate">{item.name}</span>
              <span className="text-xs font-semibold text-gray-800 ml-auto">
                {Math.round((item.value / total) * 100)}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    const height = 120;
    const width = 400;
    const padding = 20;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;
    const stepX = chartWidth / (data.length - 1);

    const points = data.map((item, index) => ({
      x: padding + index * stepX,
      y: padding + chartHeight - (item.value / maxValue) * chartHeight,
    }));

    const pathData = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    return (
      <div className="relative">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              y1={padding + chartHeight * (1 - ratio)}
              x2={width - padding}
              y2={padding + chartHeight * (1 - ratio)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Line path */}
          <motion.path
            d={pathData}
            stroke="#8b5cf6"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          {/* Data points */}
          {points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#8b5cf6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: (index / points.length) * 2, type: 'spring' }}
            />
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-5">
          {data.map((item) => (
            <span key={item.name} className="text-xs text-gray-500">
              {item.name}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {type === 'bar' && renderBarChart()}
        {type === 'pie' && renderPieChart()}
        {type === 'line' && renderLineChart()}
      </CardContent>
    </Card>
  );
}
