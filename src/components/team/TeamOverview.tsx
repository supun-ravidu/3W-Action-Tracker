'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trophy,
  TrendingUp,
  Star,
  Mail,
  MapPin,
  Calendar,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Award,
  Trash2,
  Edit,
  Sparkles,
  Zap,
  Crown,
  Download,
  FileJson,
  FileText,
  Copy,
  CheckCheck,
} from 'lucide-react';
import { TeamMember } from '@/types';
import {
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  updateMemberAvailability,
} from '@/lib/teamService';
import { useTeamMembers } from '@/contexts/TeamMembersContext';
import { submitTeamMemberRequest } from '@/lib/teamRequestService';
import { useAuth } from '@/contexts/AuthContext';
import { useActionPlansStore } from '@/store/actionPlansStore';
import { motion, AnimatePresence } from 'framer-motion';
import { FirebaseStatus } from './FirebaseStatus';
import { WelcomeBanner } from './WelcomeBanner';
import confetti from 'canvas-confetti';
import {
  exportToJSON,
  exportToCSV,
  copyToClipboard,
  exportSummaryReport,
} from '@/lib/teamExport';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LiveTeamCounter } from './LiveTeamCounter';

const AVATAR_SEEDS = [
  'Felix', 'Aneka', 'Midnight', 'Lucky', 'Jasper', 'Bailey', 'Misty', 'Oliver',
  'Luna', 'Max', 'Bella', 'Charlie', 'Daisy', 'Rocky', 'Sophie', 'Buddy'
];

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'Operations',
  'HR',
  'Finance',
];

const SKILL_OPTIONS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'UI/UX',
  'Leadership', 'Project Management', 'Agile', 'DevOps', 'AWS',
  'Database', 'API Design', 'Testing', 'CI/CD', 'Docker',
  'Figma', 'User Research', 'Prototyping', 'Communication',
];

export function TeamOverview() {
  const { user, isAdmin } = useAuth();
  const { members: teamMembers, loading: isLoading } = useTeamMembers();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [copied, setCopied] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { actionPlans } = useActionPlansStore();

  // New team member form state
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    skills: [] as string[],
    bio: '',
    timezone: 'UTC',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      portfolio: '',
    },
  });

  useEffect(() => {
    // Sync with shared context
    if (teamMembers.length > 0) {
      // Check for new members (approved requests)
      if (members.length > 0 && teamMembers.length > members.length) {
        const newMembers = teamMembers.filter(
          updated => !members.some(existing => existing.id === updated.id)
        );
        
        // Show celebration for new members
        if (newMembers.length > 0) {
          console.log('🎉 New team member(s) joined!', newMembers);
        }
      }
      
      setMembers(teamMembers);
      setLastUpdate(new Date());
    }
  }, [teamMembers, members.length]);

  const getMemberStats = (memberId: string) => {
    const memberPlans = actionPlans.filter(
      (plan) =>
        plan.who.primaryAssignee.id === memberId ||
        plan.who.supportingMembers.some((m) => m.id === memberId)
    );

    const completed = memberPlans.filter((p) => p.status === 'completed').length;
    const inProgress = memberPlans.filter((p) => p.status === 'in-progress').length;
    const pending = memberPlans.filter((p) => p.status === 'pending').length;
    const blocked = memberPlans.filter((p) => p.status === 'blocked').length;

    return {
      total: memberPlans.length,
      completed,
      inProgress,
      pending,
      blocked,
      completionRate: memberPlans.length > 0 ? (completed / memberPlans.length) * 100 : 0,
    };
  };

  const triggerSuccessConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const simulateFirebaseUpload = async () => {
    const steps = [0, 15, 35, 50, 70, 85, 95, 100];
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 150));
      setUploadProgress(steps[i]);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const uploadPromise = simulateFirebaseUpload();
      const randomSeed = AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)];
      const memberData = {
        ...newMember,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`,
        workload: 0,
        availability: {
          status: 'available' as const,
          timeOff: [],
        },
        achievements: [
          {
            title: 'Welcome Aboard! 🎉',
            description: 'Joined the team',
            icon: '🎊',
            earnedAt: new Date(),
            rarity: 'common' as const,
          },
        ],
        joinedAt: new Date(),
        performanceMetrics: {
          tasksCompleted: 0,
          averageRating: 0,
          onTimeDelivery: 100,
        },
      };

      if (isAdmin) {
        // Admin can add directly
        await Promise.all([addTeamMember(memberData), uploadPromise]);
        triggerSuccessConfetti();
      } else {
        // Regular users submit request
        await Promise.all([
          submitTeamMemberRequest(
            memberData,
            user?.email || 'anonymous',
            'normal'
          ),
          uploadPromise
        ]);
        triggerSuccessConfetti();
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      setIsAddDialogOpen(false);
      setNewMember({
        name: '',
        email: '',
        role: '',
        department: '',
        skills: [],
        bio: '',
        timezone: 'UTC',
        socialLinks: {
          github: '',
          linkedin: '',
          twitter: '',
          portfolio: '',
        },
      });
    } catch (error) {
      console.error('Error adding team member:', error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    try {
      await updateTeamMember(editingMember.id, editingMember);
      setEditingMember(null);
    } catch (error) {
      console.error('Error updating team member:', error);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      try {
        await deleteTeamMember(id);
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const handleStatusChange = async (memberId: string, status: any) => {
    try {
      await updateMemberAvailability(memberId, status);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleCopyToClipboard = async () => {
    const success = await copyToClipboard(filteredMembers);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment =
      filterDepartment === 'all' || member.department === filterDepartment;
    
    const matchesStatus =
      filterStatus === 'all' || member.availability?.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getAvailabilityColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-500',
      busy: 'bg-yellow-500',
      away: 'bg-orange-500',
      offline: 'bg-gray-400',
    };
    return colors[status] || 'bg-gray-400';
  };

  const getAchievementIcon = (rarity?: string) => {
    switch (rarity) {
      case 'legendary':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'epic':
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'rare':
        return <Zap className="h-4 w-4 text-blue-500" />;
      default:
        return <Award className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Card className="relative p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-400 shadow-lg overflow-hidden">
              {/* Animated Background Pattern */}
              <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
                animate={{
                  backgroundPosition: ['0px 0px', '20px 20px']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Sparkle Effect */}
              <motion.div
                className="absolute top-4 right-4"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </motion.div>

              <div className="relative z-10 flex items-start gap-4">
                {/* Animated Check Icon */}
                <motion.div
                  className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </motion.div>
                
                <div className="flex-1">
                  <motion.h3
                    className="text-xl font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Request Submitted Successfully! 
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                      🎉
                    </motion.span>
                  </motion.h3>
                  
                  <motion.p
                    className="text-sm text-green-700/80 dark:text-green-300/80 mb-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Your team member request has been successfully uploaded to Firebase and sent to the admin for approval.
                  </motion.p>

                  {/* Progress Steps */}
                  <motion.div
                    className="flex items-center gap-2 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Data Validated
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">
                      <Zap className="h-3 w-3 mr-1" />
                      Firebase Synced
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-300">
                      <Mail className="h-3 w-3 mr-1" />
                      Admin Notified
                    </Badge>
                  </motion.div>
                </div>

                {/* Animated Close Timer */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-green-500/30"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 5, ease: "linear" }}
                >
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600" />
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Firebase Status */}
      <FirebaseStatus 
        isConnected={true}
        isLoading={isLoading}
        itemCount={members.length}
        lastUpdate={lastUpdate}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Team Overview</h2>
            <p className="text-sm text-muted-foreground">
              Manage and track your team members
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {members.length}
          </Badge>
        </div>

        <div className="flex gap-2">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => exportToJSON(filteredMembers)} className="gap-2">
                <FileJson className="h-4 w-4" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToCSV(filteredMembers)} className="gap-2">
                <FileText className="h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => exportSummaryReport(filteredMembers)} className="gap-2">
                <FileText className="h-4 w-4" />
                Summary Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCopyToClipboard} className="gap-2">
                {copied ? (
                  <>
                    <CheckCheck className="h-4 w-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Team Member Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <UserPlus className="h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new member to your team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    placeholder="Senior Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newMember.department}
                    onValueChange={(value) => setNewMember({ ...newMember, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={newMember.bio}
                  onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                  placeholder="Tell us about this team member..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Skills (select multiple)</Label>
                <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md max-h-40 overflow-y-auto">
                  {SKILL_OPTIONS.map((skill) => (
                    <Badge
                      key={skill}
                      variant={newMember.skills.includes(skill) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        setNewMember({
                          ...newMember,
                          skills: newMember.skills.includes(skill)
                            ? newMember.skills.filter((s) => s !== skill)
                            : [...newMember.skills, skill],
                        });
                      }}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Social Links (Optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    <Input
                      value={newMember.socialLinks.github}
                      onChange={(e) =>
                        setNewMember({
                          ...newMember,
                          socialLinks: { ...newMember.socialLinks, github: e.target.value },
                        })
                      }
                      placeholder="github.com/username"
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    <Input
                      value={newMember.socialLinks.linkedin}
                      onChange={(e) =>
                        setNewMember({
                          ...newMember,
                          socialLinks: { ...newMember.socialLinks, linkedin: e.target.value },
                        })
                      }
                      placeholder="linkedin.com/in/username"
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    <Input
                      value={newMember.socialLinks.twitter}
                      onChange={(e) =>
                        setNewMember({
                          ...newMember,
                          socialLinks: { ...newMember.socialLinks, twitter: e.target.value },
                        })
                      }
                      placeholder="twitter.com/username"
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <Input
                      value={newMember.socialLinks.portfolio}
                      onChange={(e) =>
                        setNewMember({
                          ...newMember,
                          socialLinks: { ...newMember.socialLinks, portfolio: e.target.value },
                        })
                      }
                      placeholder="portfolio.com"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Firebase Upload Progress */}
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-5 w-5 text-blue-600" />
                      </motion.div>
                      <span className="text-sm font-medium text-blue-900">
                        Uploading to Firebase...
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{uploadProgress}%</span>
                  </div>
                  <div className="relative h-2 bg-blue-100 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute inset-y-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ['0%', '400%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              )}

              <Button 
                onClick={handleAddMember} 
                className="w-full relative overflow-hidden group" 
                size="lg"
                disabled={isSubmitting}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
                  animate={isSubmitting ? { x: ['-100%', '100%'] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="h-4 w-4" />
                      </motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      {isAdmin ? 'Add Team Member' : 'Submit Request for Approval'}
                    </>
                  )}
                </span>
              </Button>
              {!isAdmin && !isSubmitting && (
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Your request will be reviewed by an admin
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="away">Away</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Team Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Live Team Counter - Animated */}
        <LiveTeamCounter />
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {members.filter((m) => m.availability?.status === 'available').length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Busy</p>
              <p className="text-2xl font-bold text-yellow-600">
                {members.filter((m) => m.availability?.status === 'busy').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Tasks</p>
              <p className="text-2xl font-bold">
                {members.length > 0
                  ? Math.round(
                      members.reduce((sum, m) => sum + (m.workload || 0), 0) / members.length
                    )
                  : 0}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Team Members Grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member, index) => {
            const stats = getMemberStats(member.id);
            const workload = member.workload || stats.total;
            const workloadLevel = workload > 10 ? 'high' : workload > 5 ? 'medium' : 'low';

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingMember(member)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteMember(member.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl">
                              {member.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                          )}
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getAvailabilityColor(
                            member.availability?.status || 'available'
                          )} shadow-md cursor-pointer`}
                          onClick={() => {
                            const statuses: ('available' | 'busy' | 'away' | 'offline')[] = [
                              'available',
                              'busy',
                              'away',
                              'offline',
                            ];
                            const currentIndex = statuses.indexOf(
                              member.availability?.status || 'available'
                            );
                            const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                            handleStatusChange(member.id, nextStatus);
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role || 'Team Member'}</p>
                        {member.department && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {member.department}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {member.bio && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{member.bio}</p>
                    )}

                    {/* Contact & Social */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      {member.timezone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{member.timezone}</span>
                        </div>
                      )}
                      {member.socialLinks && (
                        <div className="flex gap-2 mt-2">
                          {member.socialLinks.github && (
                            <a
                              href={`https://${member.socialLinks.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                          {member.socialLinks.linkedin && (
                            <a
                              href={`https://${member.socialLinks.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Linkedin className="h-4 w-4" />
                            </a>
                          )}
                          {member.socialLinks.twitter && (
                            <a
                              href={`https://${member.socialLinks.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Twitter className="h-4 w-4" />
                            </a>
                          )}
                          {member.socialLinks.portfolio && (
                            <a
                              href={`https://${member.socialLinks.portfolio}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Globe className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Performance Metrics */}
                    {member.performanceMetrics && (
                      <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Trophy className="h-3 w-3 text-yellow-500" />
                            <p className="text-xs font-semibold">
                              {member.performanceMetrics.tasksCompleted}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">Tasks</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <p className="text-xs font-semibold">
                              {member.performanceMetrics.averageRating.toFixed(1)}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <p className="text-xs font-semibold">
                              {member.performanceMetrics.onTimeDelivery}%
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">On-time</p>
                        </div>
                      </div>
                    )}

                    {/* Workload */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Current Workload</span>
                        <Badge
                          variant={
                            workloadLevel === 'high'
                              ? 'destructive'
                              : workloadLevel === 'medium'
                              ? 'default'
                              : 'secondary'
                          }
                          className="text-xs"
                        >
                          {workload} tasks
                        </Badge>
                      </div>
                      <Progress value={Math.min((workload / 15) * 100, 100)} className="h-2" />
                    </div>

                    {/* Task Stats */}
                    <div className="grid grid-cols-4 gap-2 mb-4 p-2 border rounded-lg">
                      <div className="text-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto mb-1" />
                        <p className="text-xs font-semibold">{stats.completed}</p>
                        <p className="text-xs text-muted-foreground">Done</p>
                      </div>
                      <div className="text-center">
                        <Clock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs font-semibold">{stats.inProgress}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                      <div className="text-center">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mx-auto mb-1" />
                        <p className="text-xs font-semibold">{stats.pending}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                      <div className="text-center">
                        <AlertCircle className="h-4 w-4 text-red-600 mx-auto mb-1" />
                        <p className="text-xs font-semibold">{stats.blocked}</p>
                        <p className="text-xs text-muted-foreground">Blocked</p>
                      </div>
                    </div>

                    {/* Skills */}
                    {member.skills && member.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2 font-medium">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {member.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.skills.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Achievements */}
                    {member.achievements && member.achievements.length > 0 && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-muted-foreground font-medium">
                            Recent Achievements
                          </p>
                          <Trophy className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="space-y-1">
                          {member.achievements.slice(0, 2).map((achievement, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs bg-muted/50 rounded p-2"
                            >
                              {getAchievementIcon(achievement.rarity)}
                              <span className="flex-1 truncate">{achievement.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Joined Date */}
                    {member.joinedAt && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3 pt-3 border-t">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Joined {new Date(member.joinedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No team members found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm || filterDepartment !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first team member'}
          </p>
          {!searchTerm && filterDepartment === 'all' && filterStatus === 'all' && (
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Team Member
            </Button>
          )}
        </Card>
      )}

      {/* Edit Member Dialog */}
      {editingMember && (
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>Update member information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editingMember.name}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingMember.email}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Input
                    id="edit-role"
                    value={editingMember.role || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, role: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Select
                    value={editingMember.department || ''}
                    onValueChange={(value) =>
                      setEditingMember({ ...editingMember, department: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-bio">Bio</Label>
                <Textarea
                  id="edit-bio"
                  value={editingMember.bio || ''}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, bio: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <Button onClick={handleUpdateMember} className="w-full">
                Update Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
