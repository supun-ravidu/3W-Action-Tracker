export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'completed' | 'in-progress' | 'pending' | 'blocked';

export interface ActionPlan {
  id: string;
  title: string;
  what: {
    description: string;
    successCriteria: string[];
    requiredResources: string[];
  };
  who: {
    primaryAssignee: TeamMember;
    supportingMembers: TeamMember[];
    stakeholders: TeamMember[];
  };
  when: {
    dueDate: Date;
    timeEstimate: number; // in hours
    reminderSettings: {
      enabled: boolean;
      reminderDate?: Date;
    };
  };
  priority: Priority;
  status: Status;
  tags: string[];
  dependencies: string[]; // action plan IDs
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  completedAt?: Date;
  statusHistory: StatusChange[];
  comments?: Comment[];
  checklist?: ChecklistItem[];
  approvalWorkflow?: ApprovalWorkflow;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  role?: string;
  department?: string;
  skills?: string[];
  workload?: number; // current number of assigned tasks
  taskCounts?: {
    done: number;
    active: number;
    pending: number;
    blocked: number;
    total: number;
  };
  availability?: {
    status: 'available' | 'busy' | 'away' | 'offline';
    timeOff?: { start: Date; end: Date; reason: string }[];
  };
  timezone?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  achievements?: Achievement[];
  joinedAt?: Date;
  performanceMetrics?: {
    tasksCompleted: number;
    averageRating: number;
    onTimeDelivery: number;
  };
}

export interface Achievement {
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface DashboardStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
  completionRate: number;
  averageCompletionTime: number; // in days
}

export interface PriorityDistribution {
  high: number;
  medium: number;
  low: number;
}

export interface TeamPerformance {
  memberId: string;
  memberName: string;
  avatar?: string;
  completedTasks: number;
  averageCompletionTime: number; // in days
  tasksInProgress: number;
}

export interface StatusChange {
  from: Status;
  to: Status;
  changedAt: Date;
  changedBy: string;
  reason?: string;
}

export interface Comment {
  id: string;
  actionPlanId: string;
  author: TeamMember;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  replies?: Comment[];
  mentions?: string[]; // team member IDs
  reactions?: Reaction[];
}

export interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  type: 'assignment' | 'deadline_24h' | 'deadline_1h' | 'status_change' | 'comment' | 'mention' | 'dependency_resolved' | 'approval_request';
  title: string;
  message: string;
  actionPlanId?: string;
  actionPlanTitle?: string;
  relatedUserId?: string;
  relatedUserName?: string;
  timestamp: Date;
  read: boolean;
  link?: string;
}

export interface NotificationPreferences {
  userId: string;
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
  };
  types: {
    assignment: boolean;
    deadline_24h: boolean;
    deadline_1h: boolean;
    status_change: boolean;
    comment: boolean;
    mention: boolean;
    dependency_resolved: boolean;
    approval_request: boolean;
  };
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  assignee?: TeamMember;
  dueDate?: Date;
  order: number;
}

export interface ApprovalWorkflow {
  id: string;
  actionPlanId: string;
  requestedBy: TeamMember;
  approvers: TeamMember[];
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: TeamMember;
  comments?: string;
}

export interface Attachment {
  id: string;
  actionPlanId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ActivityLog {
  id: string;
  actionPlanId: string;
  actionTitle: string;
  type: 'created' | 'updated' | 'completed' | 'status_changed' | 'comment_added' | 'attachment_added' | 'dependency_added';
  performedBy: string;
  timestamp: Date;
  description: string;
  changes?: Record<string, { old: any; new: any }>;
}

export type ViewMode = 'table' | 'kanban' | 'calendar' | 'gantt';

export interface FilterOptions {
  status: Status[];
  priority: Priority[];
  assignees: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  tags: string[];
  searchQuery: string;
}

// Analytics & Reporting Types
export interface PerformanceReport {
  teamPerformance: TeamPerformanceMetrics;
  individualReports: IndividualPerformanceReport[];
  projectHealth: ProjectHealthMetrics;
  bottlenecks: BottleneckAnalysis[];
}

export interface TeamPerformanceMetrics {
  completionRate: number;
  averageCompletionTime: number; // in days
  totalCompleted: number;
  totalInProgress: number;
  totalPending: number;
  totalBlocked: number;
  onTimeCompletionRate: number;
  overdueCount: number;
  period: { start: Date; end: Date };
}

export interface IndividualPerformanceReport {
  member: TeamMember;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksPending: number;
  tasksBlocked: number;
  completionRate: number;
  averageCompletionTime: number; // in days
  onTimeCompletionRate: number;
  contributionScore: number; // calculated metric
  recentActivity: ActivityLog[];
}

export interface ProjectHealthMetrics {
  overallProgress: number; // percentage
  velocityTrend: 'increasing' | 'stable' | 'decreasing';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  statusDistribution: Record<Status, number>;
  priorityDistribution: Record<Priority, number>;
  upcomingDeadlines: number;
  overdueActions: number;
  blockersCount: number;
  averageCycleTime: number; // in days
  predictedCompletionDate?: Date;
}

export interface BottleneckAnalysis {
  actionPlanId: string;
  actionTitle: string;
  assignee: TeamMember;
  daysInStatus: number;
  currentStatus: Status;
  blockingFactors: string[];
  suggestedActions: string[];
  riskScore: number;
}

export interface TrendData {
  label: string;
  value: number;
  date: Date;
  change?: number; // percentage change from previous period
}

export interface CompletionTrend {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  data: TrendData[];
  currentPeriod: TrendData;
  previousPeriod: TrendData;
  percentageChange: number;
}

export interface CycleTimeMetrics {
  averageCycleTime: number; // overall average in days
  byPriority: Record<Priority, number>;
  byAssignee: Record<string, number>; // member ID to cycle time
  trend: TrendData[];
  median: number;
  percentile90: number;
}

export interface ForecastData {
  actionPlanId: string;
  actionTitle: string;
  currentStatus: Status;
  estimatedCompletionDate: Date;
  confidence: 'high' | 'medium' | 'low';
  factorsConsidered: string[];
  daysRemaining: number;
  riskFactors: string[];
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  includeCharts: boolean;
  includeComments: boolean;
  includeHistory: boolean;
  dateRange?: { start: Date; end: Date };
  filters?: FilterOptions;
}

export interface ShareableReport {
  id: string;
  reportType: 'performance' | 'trends' | 'project-health' | 'bottlenecks';
  title: string;
  createdBy: TeamMember;
  createdAt: Date;
  expiresAt?: Date;
  accessToken: string;
  permissions: {
    canComment: boolean;
    canDownload: boolean;
  };
  data: any; // the actual report data
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Projects & Workspaces Types
export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  workspace?: string; // workspace ID
  actionPlans: string[]; // action plan IDs
  teamMembers: TeamMember[];
  lead: TeamMember;
  status: 'active' | 'archived' | 'on-hold';
  startDate: Date;
  targetEndDate: Date;
  actualEndDate?: Date;
  progress: number; // percentage
  budget?: {
    allocated: number;
    spent: number;
    currency: string;
  };
  tags: string[];
  dependencies: ProjectDependency[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  projects: string[]; // project IDs
  teamMembers: TeamMember[];
  owner: TeamMember;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectDependency {
  id: string;
  projectId: string;
  dependsOnProjectId: string;
  dependencyType: 'blocking' | 'related' | 'prerequisite';
  description?: string;
  status: 'active' | 'resolved';
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'marketing' | 'development' | 'events' | 'operations' | 'custom';
  type: 'pre-built' | 'custom';
  isPublic: boolean;
  createdBy: TeamMember;
  createdAt: Date;
  usageCount: number;
  rating?: number;
  tags: string[];
  actionPlans: Omit<ActionPlan, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>[];
  estimatedDuration: number; // in days
  requiredRoles: string[];
}

export interface ProjectStats {
  projectId: string;
  projectName: string;
  totalActions: number;
  completedActions: number;
  inProgressActions: number;
  pendingActions: number;
  blockedActions: number;
  completionRate: number;
  onTimeCompletionRate: number;
  averageCycleTime: number;
  upcomingDeadlines: number;
  overdueActions: number;
  teamMemberCount: number;
  daysRemaining: number;
  healthStatus: 'excellent' | 'good' | 'at-risk' | 'critical';
}
