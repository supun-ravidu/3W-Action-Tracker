'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  CheckCircle2,
  Zap,
  Target,
  Database,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Simplified Team Workload Widget
 * Redirects to the full Team Workload Management page to avoid duplicate Firebase subscriptions
 * This prevents Firebase quota exhaustion by centralizing data fetching
 */
export function TeamWorkloadWidget() {
  const router = useRouter();

  const handleViewFullPage = () => {
    router.push('/admin/team-workload');
  };

  return (
    <Card className="border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Team Workload Overview
            </CardTitle>
            <CardDescription>Manage team members and monitor workloads</CardDescription>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200"
            >
              <Users className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-purple-600">View All</p>
              <p className="text-sm text-slate-600">Team Members</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200"
            >
              <Target className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">Manage</p>
              <p className="text-sm text-slate-600">Workloads</p>
            </motion.div>
          </div>

          {/* Features List */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Real-time workload tracking</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Team member management</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Advanced filtering & search</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Task count editing</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleViewFullPage}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white"
            size="lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            Open Team Workload Manager
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>

          {/* Info Note */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Database className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              Click above to access the full Team Workload Management page with all features
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
