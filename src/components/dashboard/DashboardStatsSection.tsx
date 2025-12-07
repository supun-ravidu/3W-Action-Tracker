'use client';

import { DashboardStats } from '@/types';
import { StatCard } from './StatCard';
import { motion } from 'framer-motion';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsSection({ stats }: DashboardStatsProps) {
  const statsData = [
    {
      title: 'Total Actions',
      value: stats.total,
      iconName: 'ListTodo',
      colorClass: 'text-blue-600',
      description: 'All action plans',
    },
    {
      title: 'Completed',
      value: stats.completed,
      iconName: 'CheckCircle2',
      colorClass: 'text-green-600',
      description: `${Math.round((stats.completed / stats.total) * 100)}% done`,
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      iconName: 'Clock',
      colorClass: 'text-yellow-600',
      description: 'Currently active',
    },
    {
      title: 'Pending',
      value: stats.pending,
      iconName: 'Timer',
      colorClass: 'text-gray-600',
      description: 'Not yet started',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      iconName: 'AlertCircle',
      colorClass: 'text-red-600',
      description: 'Needs attention',
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      iconName: 'TrendingUp',
      colorClass: 'text-purple-600',
      description: `Avg: ${stats.averageCompletionTime}d`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <StatCard {...stat} index={index} />
        </motion.div>
      ))}
    </div>
  );
}
