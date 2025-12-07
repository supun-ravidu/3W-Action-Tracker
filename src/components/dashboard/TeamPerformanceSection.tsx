'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamPerformance } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamPerformanceProps {
  performance: TeamPerformance[];
}

export function TeamPerformanceSection({ performance }: TeamPerformanceProps) {
  // Sort by completed tasks (descending) and then by average completion time (ascending)
  const sortedPerformance = [...performance].sort((a, b) => {
    if (b.completedTasks !== a.completedTasks) {
      return b.completedTasks - a.completedTasks;
    }
    return a.averageCompletionTime - b.averageCompletionTime;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRankBadge = (index: number) => {
    if (index === 0)
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          <Trophy className="h-3 w-3 mr-1" />
          #1
        </Badge>
      );
    if (index === 1)
      return (
        <Badge className="bg-gray-400 hover:bg-gray-500">
          <Trophy className="h-3 w-3 mr-1" />
          #2
        </Badge>
      );
    if (index === 2)
      return (
        <Badge className="bg-orange-600 hover:bg-orange-700">
          <Trophy className="h-3 w-3 mr-1" />
          #3
        </Badge>
      );
    return <Badge variant="outline">#{index + 1}</Badge>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Team Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedPerformance.map((member, index) => (
            <div
              key={member.memberId}
              className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm font-medium">
                  {getInitials(member.memberName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{member.memberName}</h4>
                  {getRankBadge(index)}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-green-600">
                      {member.completedTasks}
                    </span>
                    <span>completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      Avg: {member.averageCompletionTime.toFixed(1)} days
                    </span>
                  </div>
                  {member.tasksInProgress > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-yellow-600">
                        {member.tasksInProgress}
                      </span>
                      <span>in progress</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance indicator */}
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {member.completedTasks > 0
                    ? Math.round(
                        (member.completedTasks /
                          (member.completedTasks + member.tasksInProgress)) *
                          100
                      )
                    : 0}
                  %
                </div>
                <div className="text-xs text-muted-foreground">efficiency</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      </Card>
    </motion.div>
  );
}
