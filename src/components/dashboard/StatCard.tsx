'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  iconName: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
  index?: number;
}

export function StatCard({
  title,
  value,
  iconName,
  description,
  trend,
  colorClass = 'text-blue-600',
  index = 0,
}: StatCardProps) {
  // Dynamic icon import
  const Icon = require('lucide-react')[iconName];
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Animated background gradient */}
      <div 
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
          "bg-gradient-to-br from-transparent via-current to-transparent",
          colorClass
        )}
      />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn('p-2 rounded-lg bg-opacity-10 group-hover:scale-110 transition-transform', colorClass.replace('text-', 'bg-'))}>
          <Icon className={cn('h-4 w-4', colorClass)} />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? (
            <CountUp end={value} duration={1.5} delay={index * 0.1} />
          ) : (
            value
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p
            className={cn(
              'text-xs mt-1',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last
            month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// CountUp component for animated numbers
function CountUp({ end, duration = 2, delay = 0 }: { end: number; duration?: number; delay?: number }) {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const increment = end / (duration * 60);
      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      
      return () => clearInterval(counter);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [end, duration, delay]);
  
  return <span>{count}</span>;
}

import React from 'react';
