'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnimatedStatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  trend?: number;
  color: string;
  delay?: number;
}

export function AnimatedStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
  delay = 0,
}: AnimatedStatCardProps) {
  const isPositiveTrend = trend && trend > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
        {/* Gradient background */}
        <div
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
          style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 100%)` }}
        />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
        </CardHeader>
        
        <CardContent>
          <motion.div
            className="text-3xl font-bold"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: delay + 0.2 }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </motion.div>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">{subtitle}</p>
            {trend !== undefined && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.4 }}
                className={`text-xs font-medium ${
                  isPositiveTrend ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositiveTrend ? '↑' : '↓'} {Math.abs(trend)}%
              </motion.span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
