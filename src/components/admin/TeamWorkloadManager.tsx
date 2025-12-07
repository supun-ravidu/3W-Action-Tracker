'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  updateTeamMemberTaskCounts,
  deleteTeamMember,
  TeamMemberWorkload,
} from '@/lib/teamWorkloadService';
import { useWorkload } from '@/contexts/WorkloadContext';
import {
  Users,
  CheckCircle2,
  Activity,
  Clock,
  XCircle,
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  Flame,
  Award,
  Edit,
  Save,
  X,
  RefreshCw,
  Database,
  Wifi,
  WifiOff,
  Sparkles,
  Plus,
  Trash2,
  UserX,
  AlertTriangle,
  Eye,
  Filter,
  Search,
  Download,
  Upload,
  Star,
  TrendingDown,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const statusConfig = {
  done: {
    label: 'Done',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    gradient: 'from-green-50 to-green-100',
    darkGradient: 'from-green-500 to-emerald-600',
  },
  active: {
    label: 'Active',
    icon: Activity,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    gradient: 'from-blue-50 to-blue-100',
    darkGradient: 'from-blue-500 to-cyan-600',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    gradient: 'from-amber-50 to-amber-100',
    darkGradient: 'from-amber-500 to-orange-600',
  },
  blocked: {
    label: 'Blocked',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    gradient: 'from-red-50 to-red-100',
    darkGradient: 'from-red-500 to-rose-600',
  },
};

const workloadLevels = {
  light: { label: 'Light', color: 'text-green-600', max: 5 },
  moderate: { label: 'Moderate', color: 'text-blue-600', max: 15 },
  heavy: { label: 'Heavy', color: 'text-amber-600', max: 25 },
  overload: { label: 'Overload', color: 'text-red-600', max: Infinity },
};

function getWorkloadLevel(total: number) {
  if (total <= workloadLevels.light.max) return workloadLevels.light;
  if (total <= workloadLevels.moderate.max) return workloadLevels.moderate;
  if (total <= workloadLevels.heavy.max) return workloadLevels.heavy;
  return workloadLevels.overload;
}

export function TeamWorkloadManager() {
  // Use shared workload context to prevent duplicate Firebase subscriptions
  const { workloads, statistics, loading, isConnected, refetch } = useWorkload();
  
  const [filteredWorkloads, setFilteredWorkloads] = useState<TeamMemberWorkload[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMemberWorkload | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMemberWorkload | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMemberWorkload | null>(null);
  const [editCounts, setEditCounts] = useState({
    done: 0,
    active: 0,
    pending: 0,
    blocked: 0,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'workload' | 'done'>('workload');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort workloads
  useEffect(() => {
    let filtered = workloads;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (w) =>
          w.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Workload level filter
    if (filterLevel !== 'all') {
      filtered = filtered.filter((w) => {
        const level = getWorkloadLevel(w.taskCounts.total);
        return level.label.toLowerCase() === filterLevel;
      });
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.memberName.localeCompare(b.memberName);
        case 'workload':
          return b.taskCounts.total - a.taskCounts.total;
        case 'done':
          return b.taskCounts.done - a.taskCounts.done;
        default:
          return 0;
      }
    });

    setFilteredWorkloads(filtered);
  }, [workloads, searchTerm, filterLevel, sortBy]);

  const handleEditClick = (member: TeamMemberWorkload) => {
    setEditingMember(member);
    setEditCounts(member.taskCounts);
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;

    setSaving(true);
    try {
      const result = await updateTeamMemberTaskCounts(editingMember.memberId, editCounts);
      
      if (result.success) {
        setSaveSuccess(true);
        
        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Refetch workload data from context to show updated values immediately
        await refetch();

        setTimeout(() => {
          setSaveSuccess(false);
          setEditingMember(null);
        }, 1500);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Error updating task counts:', error);
      alert('Failed to update task counts. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (member: TeamMemberWorkload) => {
    setDeletingMember(member);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMember) return;

    setDeleting(true);
    try {
      await deleteTeamMember(deletingMember.memberId);
      
      // Show success feedback
      confetti({
        particleCount: 50,
        spread: 60,
        colors: ['#ef4444', '#f87171'],
        origin: { y: 0.6 },
      });

      setDeletingMember(null);
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Failed to delete team member. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getCompletionPercentage = (counts: TeamMemberWorkload['taskCounts']) => {
    if (counts.total === 0) return 0;
    return Math.round((counts.done / counts.total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className="w-12 h-12 text-purple-600 mb-4 mx-auto" />
            </motion.div>
            <motion.div
              className="absolute inset-0 blur-xl bg-purple-500 opacity-30"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <p className="text-slate-700 font-medium text-lg">Loading Team Workload...</p>
          <p className="text-slate-500 text-sm mt-2">Syncing with Firebase</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status & Statistics */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Connection Status */}
        <Card className={`${isConnected ? 'border-green-300 bg-green-50/50' : 'border-red-300 bg-red-50/50'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Firebase Status</p>
                <p className={`text-lg font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isConnected ? (
                  <Wifi className="w-8 h-8 text-green-500" />
                ) : (
                  <WifiOff className="w-8 h-8 text-red-500" />
                )}
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Total Team Members */}
        <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Team Members</p>
                <p className="text-3xl font-bold text-purple-600">{workloads.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        {/* Total Tasks */}
        <Card className="border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-600">
                  {statistics?.totalTasks || 0}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Average Completion */}
        <Card className="border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Avg Completion</p>
                <p className="text-3xl font-bold text-green-600">
                  {statistics?.averageCompletion || 0}%
                </p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <Card className="border-slate-200 shadow-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-600" />
                Filter & Search
              </CardTitle>
              <CardDescription>Find and manage team members efficiently</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Workload Filter */}
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger>
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

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="workload">Workload (High to Low)</SelectItem>
                <SelectItem value="done">Completed Tasks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Grid/List */}
      <AnimatePresence mode="wait">
        {filteredWorkloads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-dashed border-2 border-slate-300">
              <CardContent className="py-12 text-center">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg font-medium">No team members found</p>
                <p className="text-slate-500 text-sm mt-2">
                  {searchTerm || filterLevel !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Add team members to get started'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredWorkloads.map((member, index) => {
              const level = getWorkloadLevel(member.taskCounts.total);
              const completionPct = getCompletionPercentage(member.taskCounts);

              return (
                <motion.div
                  key={member.memberId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-slate-200 group relative overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <CardHeader className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            <Avatar className="h-12 w-12 border-2 border-purple-300">
                              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
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
                        
                        {/* Action Buttons */}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-purple-100 hover:text-purple-600"
                            onClick={() => setSelectedMember(member)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
                            onClick={() => handleEditClick(member)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                            onClick={() => handleDeleteClick(member)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Workload Level Badge */}
                      <div className="mt-3">
                        <Badge
                          className={`${level.color} bg-white border-2`}
                          variant="outline"
                        >
                          <Flame className="w-3 h-3 mr-1" />
                          {level.label} Workload ({member.taskCounts.total} tasks)
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="relative space-y-4">
                      {/* Completion Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">
                            Overall Progress
                          </span>
                          <span className="text-sm font-bold text-purple-600">
                            {completionPct}%
                          </span>
                        </div>
                        <Progress value={completionPct} className="h-2" />
                      </div>

                      {/* Task Status Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(statusConfig).map(([key, config]) => {
                          const Icon = config.icon;
                          const count = member.taskCounts[key as keyof typeof member.taskCounts];
                          
                          return (
                            <motion.div
                              key={key}
                              whileHover={{ scale: 1.05 }}
                              className={`p-3 rounded-xl border-2 ${config.borderColor} bg-gradient-to-br ${config.gradient}`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Icon className={`w-4 h-4 ${config.color}`} />
                                <span className="text-xs font-medium text-slate-600">
                                  {config.label}
                                </span>
                              </div>
                              <p className={`text-2xl font-bold ${config.color}`}>
                                {count}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Performance Indicators */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          {completionPct >= 75 ? (
                            <>
                              <TrendingUp className="w-3 h-3 text-green-600" />
                              <span className="text-green-600 font-medium">Excellent</span>
                            </>
                          ) : completionPct >= 50 ? (
                            <>
                              <Target className="w-3 h-3 text-blue-600" />
                              <span className="text-blue-600 font-medium">On Track</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3 h-3 text-amber-600" />
                              <span className="text-amber-600 font-medium">Needs Attention</span>
                            </>
                          )}
                        </div>
                        {member.taskCounts.done > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-slate-600">
                              {member.taskCounts.done} completed
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Details Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-purple-300">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {selectedMember?.memberName.charAt(0).toUpperCase()}
                </div>
              </Avatar>
              <div>
                <p className="text-xl">{selectedMember?.memberName}</p>
                <p className="text-sm font-normal text-slate-500">
                  {selectedMember?.email}
                </p>
              </div>
            </DialogTitle>
            <DialogDescription>
              Detailed workload information and task breakdown
            </DialogDescription>
          </DialogHeader>

          {selectedMember && (
            <div className="space-y-6">
              {/* Member Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Role</p>
                  <p className="font-semibold text-slate-800">
                    {selectedMember.role || 'Not specified'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Department</p>
                  <p className="font-semibold text-slate-800">
                    {selectedMember.department || 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Task Summary */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Task Summary</h4>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(statusConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    const count =
                      selectedMember.taskCounts[key as keyof typeof selectedMember.taskCounts];

                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-xl border-2 ${config.borderColor} bg-gradient-to-br ${config.gradient}`}
                      >
                        <Icon className={`w-5 h-5 ${config.color} mb-2`} />
                        <p className={`text-3xl font-bold ${config.color} mb-1`}>{count}</p>
                        <p className="text-xs text-slate-600">{config.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Tasks */}
              {selectedMember.recentTasks && selectedMember.recentTasks.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Recent Tasks</h4>
                  <div className="space-y-2">
                    {selectedMember.recentTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-800">{task.title}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {task.priority}
                            </Badge>
                            <Badge
                              className={
                                statusConfig[task.status as keyof typeof statusConfig]?.color
                              }
                            >
                              {statusConfig[task.status as keyof typeof statusConfig]?.label ||
                                task.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Chart */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Completion Rate</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Overall Progress</span>
                    <span className="text-sm font-bold text-purple-600">
                      {getCompletionPercentage(selectedMember.taskCounts)}%
                    </span>
                  </div>
                  <Progress
                    value={getCompletionPercentage(selectedMember.taskCounts)}
                    className="h-3"
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Task Counts Dialog */}
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-purple-600" />
              Edit Task Counts
            </DialogTitle>
            <DialogDescription>
              Update task counts for {editingMember?.memberName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {Object.entries(statusConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    {config.label} Tasks
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={editCounts[key as keyof typeof editCounts]}
                    onChange={(e) =>
                      setEditCounts({
                        ...editCounts,
                        [key]: parseInt(e.target.value) || 0,
                      })
                    }
                    className="text-lg font-semibold"
                  />
                </div>
              );
            })}

            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-green-50 border-2 border-green-300 rounded-lg text-center"
              >
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-700 font-semibold">Successfully updated!</p>
              </motion.div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingMember(null)}
              disabled={saving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingMember} onOpenChange={() => setDeletingMember(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              Delete Team Member
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-bold text-slate-800">
                {deletingMember?.memberName}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium mb-2">
                ⚠️ This action cannot be undone!
              </p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>All member data will be permanently deleted</li>
                <li>Associated tasks will be unassigned</li>
                <li>Historical data will be removed</li>
              </ul>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Member
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
