import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Workspace, Template, ProjectDependency, ProjectStats } from '@/types';
import { teamMembers } from './mockData';

interface ProjectsState {
  projects: Project[];
  workspaces: Workspace[];
  templates: Template[];
  addProject: (project: Omit<Project, 'createdAt' | 'updatedAt' | 'progress'> | any) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addWorkspace: (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  addTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'usageCount'>) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  useTemplate: (templateId: string) => void;
  addProjectDependency: (projectId: string, dependency: Omit<ProjectDependency, 'id'>) => void;
  resolveProjectDependency: (projectId: string, dependencyId: string) => void;
  getProjectStats: (projectId: string) => ProjectStats | null;
  getWorkspaceProjects: (workspaceId: string) => Project[];
  loadProjectsFromFirebase: (projects: Project[]) => void;
  loadWorkspacesFromFirebase: (workspaces: Workspace[]) => void;
  setProjects: (projects: Project[]) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setTemplates: (templates: Template[]) => void;
}

// Mock Projects Data
const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Q1 Marketing Campaign',
    description: 'Launch comprehensive marketing campaign for new product line',
    color: '#3B82F6',
    icon: '📱',
    workspace: 'ws-1',
    actionPlans: ['1', '2', '3'],
    teamMembers: [teamMembers[0], teamMembers[1], teamMembers[2]],
    lead: teamMembers[0],
    status: 'active',
    startDate: new Date('2025-01-01'),
    targetEndDate: new Date('2025-03-31'),
    progress: 65,
    budget: {
      allocated: 50000,
      spent: 32500,
      currency: 'USD',
    },
    tags: ['marketing', 'product-launch', 'q1'],
    dependencies: [],
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'proj-2',
    name: 'Product Development Sprint',
    description: 'Develop and test new features for mobile app',
    color: '#10B981',
    icon: '🚀',
    workspace: 'ws-1',
    actionPlans: ['4', '5'],
    teamMembers: [teamMembers[3], teamMembers[4], teamMembers[5]],
    lead: teamMembers[3],
    status: 'active',
    startDate: new Date('2025-01-10'),
    targetEndDate: new Date('2025-02-28'),
    progress: 45,
    budget: {
      allocated: 75000,
      spent: 28000,
      currency: 'USD',
    },
    tags: ['development', 'mobile', 'sprint'],
    dependencies: [
      {
        id: 'dep-1',
        projectId: 'proj-2',
        dependsOnProjectId: 'proj-1',
        dependencyType: 'related',
        description: 'Marketing materials needed for product features',
        status: 'active',
      },
    ],
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2025-01-20'),
  },
  {
    id: 'proj-3',
    name: 'Annual Tech Conference',
    description: 'Plan and execute annual technology conference',
    color: '#F59E0B',
    icon: '🎤',
    workspace: 'ws-2',
    actionPlans: ['6'],
    teamMembers: [teamMembers[1], teamMembers[2], teamMembers[6]],
    lead: teamMembers[1],
    status: 'active',
    startDate: new Date('2025-02-01'),
    targetEndDate: new Date('2025-06-30'),
    progress: 30,
    budget: {
      allocated: 120000,
      spent: 15000,
      currency: 'USD',
    },
    tags: ['event', 'conference', 'planning'],
    dependencies: [],
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-02-01'),
  },
  {
    id: 'proj-4',
    name: 'Bug Resolution Initiative',
    description: 'Systematic approach to resolve critical bugs',
    color: '#EF4444',
    icon: '🐛',
    workspace: 'ws-1',
    actionPlans: ['7'],
    teamMembers: [teamMembers[4], teamMembers[5]],
    lead: teamMembers[4],
    status: 'active',
    startDate: new Date('2025-01-20'),
    targetEndDate: new Date('2025-02-15'),
    progress: 80,
    budget: {
      allocated: 25000,
      spent: 18000,
      currency: 'USD',
    },
    tags: ['bugs', 'maintenance', 'critical'],
    dependencies: [],
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-02-03'),
  },
  {
    id: 'proj-5',
    name: 'Client Onboarding Process',
    description: 'Streamline client onboarding with automation',
    color: '#8B5CF6',
    icon: '👋',
    workspace: 'ws-3',
    actionPlans: [],
    teamMembers: [teamMembers[0], teamMembers[7]],
    lead: teamMembers[7],
    status: 'active',
    startDate: new Date('2025-02-05'),
    targetEndDate: new Date('2025-03-20'),
    progress: 20,
    tags: ['onboarding', 'automation', 'process'],
    dependencies: [],
    createdAt: new Date('2025-01-28'),
    updatedAt: new Date('2025-02-04'),
  },
];

// Mock Workspaces Data
const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Product & Development',
    description: 'All product development and related marketing initiatives',
    projects: ['proj-1', 'proj-2', 'proj-4'],
    teamMembers: [
      teamMembers[0],
      teamMembers[1],
      teamMembers[2],
      teamMembers[3],
      teamMembers[4],
      teamMembers[5],
    ],
    owner: teamMembers[0],
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'ws-2',
    name: 'Events & Conferences',
    description: 'Event planning and execution workspace',
    projects: ['proj-3'],
    teamMembers: [teamMembers[1], teamMembers[2], teamMembers[6]],
    owner: teamMembers[1],
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: 'ws-3',
    name: 'Client Success',
    description: 'Client onboarding and success initiatives',
    projects: ['proj-5'],
    teamMembers: [teamMembers[0], teamMembers[7]],
    owner: teamMembers[7],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-28'),
  },
];

// Mock Templates Data
const mockTemplates: Template[] = [
  {
    id: 'tpl-1',
    name: 'Marketing Campaign Launch',
    description: 'Complete template for launching a marketing campaign with all essential tasks',
    category: 'marketing',
    type: 'pre-built',
    isPublic: true,
    createdBy: teamMembers[0],
    createdAt: new Date('2024-10-01'),
    usageCount: 45,
    rating: 4.8,
    tags: ['marketing', 'campaign', 'launch'],
    actionPlans: [
      {
        title: 'Define Campaign Goals & KPIs',
        what: {
          description: 'Establish clear campaign objectives and success metrics',
          successCriteria: [
            'Campaign goals documented and approved',
            'KPIs defined with target values',
            'Measurement plan in place',
          ],
          requiredResources: ['Marketing strategy template', 'Analytics tools'],
        },
        who: {
          primaryAssignee: teamMembers[0],
          supportingMembers: [],
          stakeholders: [teamMembers[1]],
        },
        when: {
          dueDate: new Date(),
          timeEstimate: 8,
          reminderSettings: {
            enabled: true,
          },
        },
        priority: 'high',
        status: 'pending',
        tags: ['planning', 'strategy'],
        dependencies: [],
        createdBy: 'system',
      },
      {
        title: 'Create Campaign Content',
        what: {
          description: 'Develop all creative assets and copy for the campaign',
          successCriteria: [
            'All content pieces created',
            'Brand guidelines followed',
            'Legal approval obtained',
          ],
          requiredResources: ['Design tools', 'Copywriter', 'Brand guidelines'],
        },
        who: {
          primaryAssignee: teamMembers[1],
          supportingMembers: [teamMembers[2]],
          stakeholders: [],
        },
        when: {
          dueDate: new Date(),
          timeEstimate: 40,
          reminderSettings: {
            enabled: true,
          },
        },
        priority: 'high',
        status: 'pending',
        tags: ['creative', 'content'],
        dependencies: [],
        createdBy: 'system',
      },
      {
        title: 'Launch Campaign',
        what: {
          description: 'Execute campaign launch across all channels',
          successCriteria: [
            'Campaign live on all platforms',
            'Monitoring dashboard active',
            'Team briefed on launch',
          ],
          requiredResources: ['Ad platforms', 'Social media accounts', 'Budget allocation'],
        },
        who: {
          primaryAssignee: teamMembers[0],
          supportingMembers: [teamMembers[1], teamMembers[2]],
          stakeholders: [],
        },
        when: {
          dueDate: new Date(),
          timeEstimate: 16,
          reminderSettings: {
            enabled: true,
          },
        },
        priority: 'critical',
        status: 'pending',
        tags: ['launch', 'execution'],
        dependencies: [],
        createdBy: 'system',
      },
    ],
    estimatedDuration: 21,
    requiredRoles: ['Marketing Manager', 'Content Creator', 'Designer'],
  },
  {
    id: 'tpl-2',
    name: 'Product Development Sprint',
    description: 'Two-week sprint template for agile product development',
    category: 'development',
    type: 'pre-built',
    isPublic: true,
    createdBy: teamMembers[3],
    createdAt: new Date('2024-10-15'),
    usageCount: 78,
    rating: 4.9,
    tags: ['development', 'agile', 'sprint'],
    actionPlans: [
      {
        title: 'Sprint Planning',
        what: {
          description: 'Plan sprint goals and select user stories',
          successCriteria: [
            'Sprint goal defined',
            'User stories selected and estimated',
            'Team capacity confirmed',
          ],
          requiredResources: ['Backlog', 'Team availability'],
        },
        who: {
          primaryAssignee: teamMembers[3],
          supportingMembers: [teamMembers[4], teamMembers[5]],
          stakeholders: [],
        },
        when: {
          dueDate: new Date(),
          timeEstimate: 4,
          reminderSettings: {
            enabled: true,
          },
        },
        priority: 'high',
        status: 'pending',
        tags: ['planning', 'sprint'],
        dependencies: [],
        createdBy: 'system',
      },
      {
        title: 'Development & Testing',
        what: {
          description: 'Implement features and conduct testing',
          successCriteria: [
            'All stories implemented',
            'Unit tests written',
            'Code reviewed',
          ],
          requiredResources: ['Development environment', 'Testing tools'],
        },
        who: {
          primaryAssignee: teamMembers[4],
          supportingMembers: [teamMembers[5]],
          stakeholders: [],
        },
        when: {
          dueDate: new Date(),
          timeEstimate: 72,
          reminderSettings: {
            enabled: true,
          },
        },
        priority: 'high',
        status: 'pending',
        tags: ['development', 'testing'],
        dependencies: [],
        createdBy: 'system',
      },
    ],
    estimatedDuration: 14,
    requiredRoles: ['Product Owner', 'Developer', 'QA Engineer'],
  },
  {
    id: 'tpl-3',
    name: 'Event Planning',
    description: 'Comprehensive event planning template from concept to execution',
    category: 'events',
    type: 'pre-built',
    isPublic: true,
    createdBy: teamMembers[1],
    createdAt: new Date('2024-11-01'),
    usageCount: 32,
    rating: 4.7,
    tags: ['event', 'planning', 'conference'],
    actionPlans: [
      {
        title: 'Define Event Concept',
        what: {
          description: 'Establish event purpose, theme, and target audience',
          successCriteria: [
            'Event concept document completed',
            'Budget approved',
            'Date and venue options identified',
          ],
          requiredResources: ['Budget', 'Stakeholder input'],
        },
        who: {
          primaryAssignee: teamMembers[1],
          supportingMembers: [],
          stakeholders: [teamMembers[0]],
        },
        when: {
          dueDate: new Date(),
          timeEstimate: 12,
          reminderSettings: {
            enabled: true,
          },
        },
        priority: 'high',
        status: 'pending',
        tags: ['planning', 'concept'],
        dependencies: [],
        createdBy: 'system',
      },
    ],
    estimatedDuration: 90,
    requiredRoles: ['Event Manager', 'Coordinator', 'Logistics'],
  },
  {
    id: 'tpl-4',
    name: 'Bug Resolution Workflow',
    description: 'Systematic approach to identify, prioritize, and resolve bugs',
    category: 'operations',
    type: 'pre-built',
    isPublic: true,
    createdBy: teamMembers[4],
    createdAt: new Date('2024-11-15'),
    usageCount: 56,
    rating: 4.6,
    tags: ['bugs', 'maintenance', 'workflow'],
    actionPlans: [
      {
        title: 'Bug Triage & Prioritization',
        what: {
          description: 'Review and prioritize reported bugs',
          successCriteria: [
            'All bugs categorized by severity',
            'Critical bugs identified',
            'Resolution plan created',
          ],
          requiredResources: ['Bug tracker', 'Team input'],
        },
        who: {
          primaryAssignee: teamMembers[4],
          supportingMembers: [],
          stakeholders: [],
        },
        when: {
          dueDate: new Date(),
          timeEstimate: 4,
          reminderSettings: {
            enabled: true,
          },
        },
        priority: 'high',
        status: 'pending',
        tags: ['triage', 'planning'],
        dependencies: [],
        createdBy: 'system',
      },
    ],
    estimatedDuration: 7,
    requiredRoles: ['Developer', 'QA Lead', 'Product Manager'],
  },
  {
    id: 'tpl-5',
    name: 'Client Onboarding',
    description: 'Streamlined client onboarding process with all key touchpoints',
    category: 'operations',
    type: 'pre-built',
    isPublic: true,
    createdBy: teamMembers[7],
    createdAt: new Date('2024-12-01'),
    usageCount: 23,
    rating: 4.5,
    tags: ['onboarding', 'client', 'process'],
    actionPlans: [
      {
        title: 'Initial Client Meeting',
        what: {
          description: 'Conduct kickoff meeting and gather requirements',
          successCriteria: [
            'Meeting conducted',
            'Requirements documented',
            'Project timeline agreed',
          ],
          requiredResources: ['Meeting room', 'Project template'],
        },
        who: {
          primaryAssignee: teamMembers[7],
          supportingMembers: [],
          stakeholders: [teamMembers[0]],
        },
        when: {
          dueDate: new Date(),
          timeEstimate: 2,
          reminderSettings: {
            enabled: true,
          },
        },
        priority: 'high',
        status: 'pending',
        tags: ['meeting', 'kickoff'],
        dependencies: [],
        createdBy: 'system',
      },
    ],
    estimatedDuration: 14,
    requiredRoles: ['Account Manager', 'Project Manager', 'Technical Lead'],
  },
];

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: [],
      workspaces: [],
      templates: [],

      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: `proj-${Date.now()}`,
          progress: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date() }
              : project
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }));
      },

      addWorkspace: (workspaceData) => {
        const newWorkspace: Workspace = {
          ...workspaceData,
          id: `ws-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          workspaces: [...state.workspaces, newWorkspace],
        }));
      },

      updateWorkspace: (id, updates) => {
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === id
              ? { ...workspace, ...updates, updatedAt: new Date() }
              : workspace
          ),
        }));
      },

      deleteWorkspace: (id) => {
        set((state) => ({
          workspaces: state.workspaces.filter((workspace) => workspace.id !== id),
        }));
      },

      addTemplate: (templateData) => {
        const newTemplate: Template = {
          ...templateData,
          id: `tpl-${Date.now()}`,
          createdAt: new Date(),
          usageCount: 0,
        };
        set((state) => ({
          templates: [...state.templates, newTemplate],
        }));
      },

      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id ? { ...template, ...updates } : template
          ),
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        }));
      },

      useTemplate: (templateId) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === templateId
              ? { ...template, usageCount: template.usageCount + 1 }
              : template
          ),
        }));
      },

      addProjectDependency: (projectId, dependencyData) => {
        const newDependency: ProjectDependency = {
          ...dependencyData,
          id: `dep-${Date.now()}`,
        };
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  dependencies: [...project.dependencies, newDependency],
                  updatedAt: new Date(),
                }
              : project
          ),
        }));
      },

      resolveProjectDependency: (projectId, dependencyId) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  dependencies: project.dependencies.map((dep) =>
                    dep.id === dependencyId ? { ...dep, status: 'resolved' } : dep
                  ),
                  updatedAt: new Date(),
                }
              : project
          ),
        }));
      },

      getProjectStats: (projectId) => {
        const { projects } = get();
        const project = projects.find((p) => p.id === projectId);
        if (!project) return null;

        // Mock calculation - in real app, this would calculate from actual action plans
        const totalActions = project.actionPlans.length;
        const completedActions = Math.floor(totalActions * (project.progress / 100));
        const inProgressActions = Math.floor(totalActions * 0.2);
        const pendingActions = totalActions - completedActions - inProgressActions;
        const blockedActions = 0;

        // Ensure targetEndDate is a Date object
        const targetEndDate = project.targetEndDate instanceof Date 
          ? project.targetEndDate 
          : new Date(project.targetEndDate);

        const daysRemaining = Math.ceil(
          (targetEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        const healthStatus: 'excellent' | 'good' | 'at-risk' | 'critical' =
          project.progress >= 80
            ? 'excellent'
            : project.progress >= 60
            ? 'good'
            : project.progress >= 40
            ? 'at-risk'
            : 'critical';

        return {
          projectId: project.id,
          projectName: project.name,
          totalActions,
          completedActions,
          inProgressActions,
          pendingActions,
          blockedActions,
          completionRate: project.progress,
          onTimeCompletionRate: 85,
          averageCycleTime: 3.5,
          upcomingDeadlines: 3,
          overdueActions: 1,
          teamMemberCount: project.teamMembers.length,
          daysRemaining,
          healthStatus,
        };
      },

      getWorkspaceProjects: (workspaceId) => {
        const { projects, workspaces } = get();
        const workspace = workspaces.find((w) => w.id === workspaceId);
        if (!workspace) return [];
        return projects.filter((p) => workspace.projects.includes(p.id));
      },

      loadProjectsFromFirebase: (projects) => {
        set({ projects });
      },

      loadWorkspacesFromFirebase: (workspaces) => {
        set({ workspaces });
      },

      setProjects: (projects) => {
        set({ projects });
      },

      setWorkspaces: (workspaces) => {
        set({ workspaces });
      },

      setTemplates: (templates) => {
        set({ templates });
      },
    }),
    {
      name: 'projects-storage',
    }
  )
);


