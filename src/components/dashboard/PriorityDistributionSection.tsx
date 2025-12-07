'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriorityDistribution } from '@/types';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface PriorityDistributionProps {
  distribution: PriorityDistribution;
}

const COLORS = {
  high: '#ef4444',
  medium: '#eab308',
  low: '#22c55e',
};

export function PriorityDistributionSection({
  distribution,
}: PriorityDistributionProps) {
  const total = distribution.high + distribution.medium + distribution.low;
  
  const data = [
    { name: 'High Priority', value: distribution.high, color: COLORS.high },
    { name: 'Medium Priority', value: distribution.medium, color: COLORS.medium },
    { name: 'Low Priority', value: distribution.low, color: COLORS.low },
  ].filter(item => item.value > 0);

  const highPercent = total > 0 ? (distribution.high / total) * 100 : 0;
  const mediumPercent = total > 0 ? (distribution.medium / total) * 100 : 0;
  const lowPercent = total > 0 ? (distribution.low / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Priority Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Animated Pie Chart */}
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Animated Progress Bars */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-medium">High Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{distribution.high}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {highPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${highPercent}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-sm font-medium">Medium Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    {distribution.medium}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {mediumPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-yellow-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${mediumPercent}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">Low Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 hover:bg-green-600">
                    {distribution.low}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {lowPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${lowPercent}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
