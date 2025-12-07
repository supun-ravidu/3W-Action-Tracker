'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWorkload } from '@/contexts/WorkloadContext';
import {
  CheckCircle2,
  Activity,
  Clock,
  XCircle,
  Users,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Flame,
  Award,
  BarChart3,
  Sparkles,
  Filter,
  ArrowUpDown,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
  Grid3x3,
  List,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
  done: {
    label: 'Done',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    gradient: 'from-green-500 to-emerald-600',
  },
  active: {
    label: 'Active',
    icon: Activity,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    gradient: 'from-blue-500 to-cyan-600',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    gradient: 'from-amber-500 to-orange-600',
  },
  blocked: {
    label: 'Blocked',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    gradient: 'from-red-500 to-rose-600',
  },
};

const workloadLevels = {
  light: { label: 'Light', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-300', icon: TrendingDown, max: 5 },
  moderate: { label: 'Moderate', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-300', icon: Target, max: 15 },
  heavy: { label: 'Heavy', color: 'text-amber-600', bgColor: 'bg-amber-100', borderColor: 'border-amber-300', icon: TrendingUp, max: 25 },
  overload: { label: 'Overload', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-300', icon: Flame, max: Infinity },
};

function getWorkloadLevel(total: number) {
  if (total <= workloadLevels.light.max) return workloadLevels.light;
  if (total <= workloadLevels.moderate.max) return workloadLevels.moderate;
  if (total <= workloadLevels.heavy.max) return workloadLevels.heavy;
  return workloadLevels.overload;
}

type ViewMode = 'grid' | 'list' | 'compact';
type SortBy = 'name' | 'workload' | 'completion';

export function AdvancedTeamWorkload() {
  const { workloads, statistics, loading, isConnected, refetch } = useWorkload();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('workload');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [showDetails, setShowDetails] = useState(true);

  const filteredAndSorted = useMemo(() => {
    let result = [...workloads];

    // Filter by workload level
    if (filterLevel !== 'all') {
      result = result.filter(w => {
        const level = getWorkloadLevel(w.taskCounts.total);
        return level.label.toLowerCase() === filterLevel;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.memberName.localeCompare(b.memberName);
        case 'workload':
          return b.taskCounts.total - a.taskCounts.total;
        case 'completion':
          const aComp = a.taskCounts.total > 0 ? (a.taskCounts.done / a.taskCounts.total) : 0;
          const bComp = b.taskCounts.total > 0 ? (b.taskCounts.done / b.taskCounts.total) : 0;
          return bComp - aComp;
        default:
          return 0;
      }
    });

    return result;
  }, [workloads, filterLevel, sortBy]);

  const getCompletionPercentage = (counts: typeof workloads[0]['taskCounts']) => {
    if (counts.total === 0) return 0;
    return Math.round((counts.done / counts.total) * 100);
  };

  if (loading) {
    return (
      <Card className="border-2 shadow-xl">
        <CardContent className="py-20">
          <div className="flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="w-12 h-12 text-purple-600 mb-4" />
            </motion.div>
            <p className="text-lg font-semibold text-slate-700">Loading Team Workload...</p>
            <p className="text-sm text-slate-500 mt-2">Fetching data from Firebase</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        {/* Connection Status */}
        <Card className={`${isConnected ? 'border-green-300 bg-green-50/50' : 'border-red-300 bg-red-50/50'} shadow-lg`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Status</p>
                <p className={`text-sm font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Live' : 'Offline'}
                </p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isConnected ? (
                  <Wifi className="w-6 h-6 text-green-500" />
                ) : (
                  <WifiOff className="w-6 h-6 text-red-500" />
                )}
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Team Stats */}
        <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Team</p>
                <p className="text-2xl font-bold text-purple-600">{workloads.length}</p>
              </div>
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-600">{statistics?.totalTasks || 0}</p>
              </div>
              <Target className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">{statistics?.averageCompletion || 0}%</p>
              </div>
              <Award className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Active</p>
                <p className="text-2xl font-bold text-amber-600">
                  {workloads.reduce((sum, w) => sum + w.taskCounts.active, 0)}
                </p>
              </div>
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Controls */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Team Workload Overview
              </CardTitle>
              <CardDescription>Real-time task distribution across your team</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'compact' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('compact')}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by workload" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workload Levels</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
                <SelectItem value="overload">Overload</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger>
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="workload">Workload (High to Low)</SelectItem>
                <SelectItem value="completion">Completion Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Display */}
      <AnimatePresence mode="wait">
        {filteredAndSorted.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-dashed border-2 border-slate-300">
              <CardContent className="py-16 text-center">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg font-medium">No team members found</p>
                <p className="text-slate-500 text-sm mt-2">Try adjusting your filters</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAndSorted.map((member, index) => {
              const level = getWorkloadLevel(member.taskCounts.total);
              const completionPct = getCompletionPercentage(member.taskCounts);
              const LevelIcon = level.icon;

              return (
                <motion.div
                  key={member.memberId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-slate-200 group relative overflow-hidden">
                    {/* Animated Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5"
                      animate={{
                        background: [
                          'linear-gradient(to bottom right, rgba(168, 85, 247, 0.05), rgba(236, 72, 153, 0.05), rgba(244, 63, 94, 0.05))',
                          'linear-gradient(to bottom right, rgba(236, 72, 153, 0.05), rgba(244, 63, 94, 0.05), rgba(168, 85, 247, 0.05))',
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                    />

                    <CardHeader className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            <Avatar className="h-14 w-14 border-2 border-purple-300 shadow-lg">
                              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                                {member.memberName.charAt(0).toUpperCase()}
                              </div>
                            </Avatar>
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-slate-800 truncate">
                              {member.memberName}
                            </h3>
                            <p className="text-sm text-slate-500 truncate">{member.email}</p>
                            {member.role && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {member.role}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${level.bgColor} border-2 ${level.borderColor}`}
                      >
                        <LevelIcon className={`w-4 h-4 ${level.color}`} />
                        <span className={`text-sm font-bold ${level.color}`}>
                          {level.label} • {member.taskCounts.total} tasks
                        </span>
                      </motion.div>
                    </CardHeader>

                    <CardContent className="relative space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            Progress
                          </span>
                          <span className="text-sm font-bold text-purple-600">{completionPct}%</span>
                        </div>
                        <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPct}%` }}
                            transition={{ duration: 1, delay: index * 0.05 }}
                          />
                        </div>
                      </div>

                      {/* Task Status Grid */}
                      {showDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="grid grid-cols-2 gap-3"
                        >
                          {Object.entries(statusConfig).map(([key, config]) => {
                            const Icon = config.icon;
                            const count = member.taskCounts[key as keyof typeof member.taskCounts];

                            return (
                              <motion.div
                                key={key}
                                whileHover={{ scale: 1.05 }}
                                className={`p-3 rounded-xl border-2 ${config.borderColor} ${config.bgColor}`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Icon className={`w-4 h-4 ${config.color}`} />
                                  <span className="text-xs font-medium text-slate-600">
                                    {config.label}
                                  </span>
                                </div>
                                <p className={`text-2xl font-bold ${config.color}`}>{count}</p>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}

                      {/* Efficiency Badge */}
                      {completionPct >= 70 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center justify-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg"
                        >
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-bold text-green-700">High Performer</span>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredAndSorted.map((member, index) => {
              const level = getWorkloadLevel(member.taskCounts.total);
              const completionPct = getCompletionPercentage(member.taskCounts);
              const LevelIcon = level.icon;

              return (
                <motion.div
                  key={member.memberId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="hover:shadow-lg transition-all border-2 border-slate-200">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-purple-300">
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {member.memberName.charAt(0).toUpperCase()}
                          </div>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-slate-800">{member.memberName}</h3>
                              <p className="text-sm text-slate-500">{member.email}</p>
                            </div>
                            <Badge className={`${level.bgColor} ${level.color} border-0`}>
                              <LevelIcon className="w-3 h-3 mr-1" />
                              {level.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-5 gap-3">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-slate-800">{member.taskCounts.total}</p>
                              <p className="text-xs text-slate-500">Total</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">{member.taskCounts.done}</p>
                              <p className="text-xs text-slate-500">Done</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{member.taskCounts.active}</p>
                              <p className="text-xs text-slate-500">Active</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-amber-600">{member.taskCounts.pending}</p>
                              <p className="text-xs text-slate-500">Pending</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-red-600">{member.taskCounts.blocked}</p>
                              <p className="text-xs text-slate-500">Blocked</p>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-slate-600">Completion Rate</span>
                              <span className="font-bold text-purple-600">{completionPct}%</span>
                            </div>
                            <Progress value={completionPct} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="compact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {filteredAndSorted.map((member, index) => {
              const level = getWorkloadLevel(member.taskCounts.total);
              const completionPct = getCompletionPercentage(member.taskCounts);

              return (
                <motion.div
                  key={member.memberId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Card className="hover:shadow-md transition-all border border-slate-200">
                    <CardContent className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-purple-300">
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                            {member.memberName.charAt(0).toUpperCase()}
                          </div>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <p className="font-semibold text-slate-800 truncate">{member.memberName}</p>
                              <Badge variant="outline" className="text-xs">
                                {member.taskCounts.total}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle2 className="w-3 h-3 text-green-600 mr-1" />
                                {member.taskCounts.done}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Activity className="w-3 h-3 text-blue-600 mr-1" />
                                {member.taskCounts.active}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 text-amber-600 mr-1" />
                                {member.taskCounts.pending}
                              </Badge>
                              {member.taskCounts.blocked > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  <XCircle className="w-3 h-3 text-red-600 mr-1" />
                                  {member.taskCounts.blocked}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="mt-1.5">
                            <Progress value={completionPct} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
