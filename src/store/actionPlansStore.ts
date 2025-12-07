import { create } from 'zustand';
import { ActionPlan, Comment, Attachment, ActivityLog, FilterOptions, ViewMode, TeamMember, Notification, NotificationPreferences, Reaction, ChecklistItem, ApprovalWorkflow } from '@/types';

interface ActionPlansState {
  actionPlans: ActionPlan[];
  comments: Comment[];
  attachments: Attachment[];
  activityLogs: ActivityLog[];
  filters: FilterOptions;
  viewMode: ViewMode;
  selectedActionPlan: ActionPlan | null;
  teamMembers: TeamMember[];
  notifications: Notification[];
  notificationPreferences: NotificationPreferences;
  
  // Actions
  addActionPlan: (actionPlan: Omit<ActionPlan, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => void;
  updateActionPlan: (id: string, updates: Partial<ActionPlan>) => void;
  deleteActionPlan: (id: string) => void;
  duplicateActionPlan: (id: string) => void;
  
  getActionPlanById: (id: string) => ActionPlan | undefined;
  getFilteredActionPlans: () => ActionPlan[];
  
  // Comments
  addComment: (actionPlanId: string, commentData: { author: TeamMember; content: string; mentions?: string[] }) => void;
  updateComment: (id: string, content: string) => void;
  deleteComment: (id: string) => void;
  getCommentsByActionPlan: (actionPlanId: string) => Comment[];
  
  // Attachments
  addAttachment: (attachment: Omit<Attachment, 'id' | 'uploadedAt'>) => void;
  deleteAttachment: (id: string) => void;
  getAttachmentsByActionPlan: (actionPlanId: string) => Attachment[];
  
  // Activity Logs
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  getActivityLogsByActionPlan: (actionPlanId: string) => ActivityLog[];
  
  // Filters & View
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedActionPlan: (id: string | null) => void;
  
  // Team & Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  updateNotificationPreferences: (preferences: NotificationPreferences) => void;
  addReactionToComment: (commentId: string, reaction: Omit<Reaction, 'id' | 'timestamp'>) => void;
  addChecklistItem: (actionPlanId: string, item: Omit<ChecklistItem, 'id'>) => void;
  updateChecklistItem: (actionPlanId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
  deleteChecklistItem: (actionPlanId: string, itemId: string) => void;
  requestApproval: (actionPlanId: string, data: Omit<ApprovalWorkflow, 'id' | 'status' | 'requestedAt'>) => void;
  respondToApproval: (actionPlanId: string, status: 'approved' | 'rejected', resolvedBy: TeamMember, comments?: string) => void;
  
  // Firestore sync
  loadActionPlansFromFirestore: () => Promise<void>;
  setActionPlans: (actionPlans: ActionPlan[]) => void;
}

const defaultFilters: FilterOptions = {
  status: [],
  priority: [],
  assignees: [],
  dateRange: {},
  tags: [],
  searchQuery: '',
};

// Import team members for reference
import { teamMembers as mockTeamMembers } from './mockData';

const defaultNotificationPreferences: NotificationPreferences = {
  userId: 'current-user',
  channels: {
    inApp: true,
    email: true,
    sms: false,
  },
  types: {
    assignment: true,
    deadline_24h: true,
    deadline_1h: true,
    status_change: true,
    comment: true,
    mention: true,
    dependency_resolved: true,
    approval_request: true,
  },
};

export const useActionPlansStore = create<ActionPlansState>((set, get) => ({
  actionPlans: [],
  comments: [],
  attachments: [],
  activityLogs: [],
  teamMembers: mockTeamMembers,
  notifications: [],
  notificationPreferences: defaultNotificationPreferences,
  filters: defaultFilters,
  viewMode: 'table',
  selectedActionPlan: null,

  addActionPlan: (actionPlanData) => {
    const newActionPlan: ActionPlan = {
      ...actionPlanData,
      id: `AP-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      statusHistory: [{
        from: 'pending' as const,
        to: actionPlanData.status,
        changedAt: new Date(),
        changedBy: actionPlanData.createdBy,
      }],
    };
    
    set((state) => ({
      actionPlans: [...state.actionPlans, newActionPlan],
    }));
    
    // Add activity log
    get().addActivityLog({
      actionPlanId: newActionPlan.id,
      actionTitle: newActionPlan.title,
      type: 'created',
      performedBy: newActionPlan.createdBy,
      description: `Created action plan "${newActionPlan.title}"`,
    });
  },

  updateActionPlan: (id, updates) => {
    const actionPlan = get().actionPlans.find(ap => ap.id === id);
    if (!actionPlan) return;
    
    const changes: Record<string, { old: any; new: any }> = {};
    Object.keys(updates).forEach(key => {
      if (key !== 'updatedAt' && key !== 'statusHistory') {
        changes[key] = {
          old: actionPlan[key as keyof ActionPlan],
          new: updates[key as keyof ActionPlan],
        };
      }
    });
    
    set((state) => ({
      actionPlans: state.actionPlans.map(ap =>
        ap.id === id
          ? {
              ...ap,
              ...updates,
              updatedAt: new Date(),
              statusHistory: updates.status && updates.status !== ap.status
                ? [...ap.statusHistory, {
                    from: ap.status,
                    to: updates.status,
                    changedAt: new Date(),
                    changedBy: updates.createdBy || ap.createdBy,
                  }]
                : ap.statusHistory,
            }
          : ap
      ),
    }));
    
    // Add activity log
    get().addActivityLog({
      actionPlanId: id,
      actionTitle: actionPlan.title,
      type: updates.status ? 'status_changed' : 'updated',
      performedBy: updates.createdBy || actionPlan.createdBy,
      description: updates.status
        ? `Changed status from ${actionPlan.status} to ${updates.status}`
        : `Updated action plan`,
      changes,
    });
  },

  deleteActionPlan: (id) => {
    set((state) => ({
      actionPlans: state.actionPlans.filter(ap => ap.id !== id),
      comments: state.comments.filter(c => c.actionPlanId !== id),
      attachments: state.attachments.filter(a => a.actionPlanId !== id),
      activityLogs: state.activityLogs.filter(l => l.actionPlanId !== id),
    }));
  },

  duplicateActionPlan: (id) => {
    const actionPlan = get().actionPlans.find(ap => ap.id === id);
    if (!actionPlan) return;
    
    get().addActionPlan({
      ...actionPlan,
      title: `${actionPlan.title} (Copy)`,
      status: 'pending',
      createdBy: actionPlan.createdBy,
    });
  },

  getActionPlanById: (id) => {
    return get().actionPlans.find(ap => ap.id === id);
  },

  getFilteredActionPlans: () => {
    const { actionPlans, filters } = get();
    
    return actionPlans.filter(ap => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(ap.status)) {
        return false;
      }
      
      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(ap.priority)) {
        return false;
      }
      
      // Assignee filter
      if (filters.assignees.length > 0) {
        const assigneeIds = [
          ap.who.primaryAssignee.id,
          ...ap.who.supportingMembers.map(m => m.id),
        ];
        if (!filters.assignees.some(id => assigneeIds.includes(id))) {
          return false;
        }
      }
      
      // Date range filter
      if (filters.dateRange.start && ap.when.dueDate < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && ap.when.dueDate > filters.dateRange.end) {
        return false;
      }
      
      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => ap.tags.includes(tag))) {
        return false;
      }
      
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          ap.title.toLowerCase().includes(query) ||
          ap.what.description.toLowerCase().includes(query) ||
          ap.who.primaryAssignee.name.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  },

  // Comments
  addComment: (actionPlanId: string, commentData: { author: TeamMember; content: string; mentions?: string[] }) => {
    const newComment: Comment = {
      id: `CMT-${Date.now()}`,
      actionPlanId,
      ...commentData,
      createdAt: new Date(),
      reactions: [],
    };
    
    set((state) => ({
      actionPlans: state.actionPlans.map(ap =>
        ap.id === actionPlanId
          ? { ...ap, comments: [...(ap.comments || []), newComment] }
          : ap
      ),
    }));
    
    // Add activity log
    get().addActivityLog({
      actionPlanId,
      actionTitle: get().getActionPlanById(actionPlanId)?.title || '',
      type: 'comment_added',
      performedBy: commentData.author.name,
      description: `Added a comment`,
    });

    // Send notifications for mentions
    if (commentData.mentions && commentData.mentions.length > 0) {
      const actionPlan = get().getActionPlanById(actionPlanId);
      commentData.mentions.forEach(userId => {
        const member = get().teamMembers.find(m => m.id === userId);
        if (member) {
          get().addNotification({
            type: 'mention',
            title: 'You were mentioned',
            message: `${commentData.author.name} mentioned you in a comment`,
            actionPlanId,
            actionPlanTitle: actionPlan?.title,
            relatedUserId: commentData.author.id,
            relatedUserName: commentData.author.name,
          });
        }
      });
    }
  },

  updateComment: (id, content) => {
    set((state) => ({
      comments: state.comments.map(c =>
        c.id === id ? { ...c, content, updatedAt: new Date() } : c
      ),
    }));
  },

  deleteComment: (id) => {
    set((state) => ({
      comments: state.comments.filter(c => c.id !== id),
    }));
  },

  getCommentsByActionPlan: (actionPlanId) => {
    return get().comments.filter(c => c.actionPlanId === actionPlanId);
  },

  // Attachments
  addAttachment: (attachmentData) => {
    const newAttachment: Attachment = {
      ...attachmentData,
      id: `ATT-${Date.now()}`,
      uploadedAt: new Date(),
    };
    
    set((state) => ({
      attachments: [...state.attachments, newAttachment],
    }));
    
    // Add activity log
    get().addActivityLog({
      actionPlanId: attachmentData.actionPlanId,
      actionTitle: get().getActionPlanById(attachmentData.actionPlanId)?.title || '',
      type: 'attachment_added',
      performedBy: attachmentData.uploadedBy,
      description: `Uploaded file: ${attachmentData.name}`,
    });
  },

  deleteAttachment: (id) => {
    set((state) => ({
      attachments: state.attachments.filter(a => a.id !== id),
    }));
  },

  getAttachmentsByActionPlan: (actionPlanId) => {
    return get().attachments.filter(a => a.actionPlanId === actionPlanId);
  },

  // Activity Logs
  addActivityLog: (logData) => {
    const newLog: ActivityLog = {
      ...logData,
      id: `LOG-${Date.now()}`,
      timestamp: new Date(),
    };
    
    set((state) => ({
      activityLogs: [...state.activityLogs, newLog],
    }));
  },

  getActivityLogsByActionPlan: (actionPlanId) => {
    return get().activityLogs
      .filter(l => l.actionPlanId === actionPlanId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  // Filters & View
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  setSelectedActionPlan: (id) => {
    const actionPlan = id ? get().getActionPlanById(id) : null;
    set({ selectedActionPlan: actionPlan || null });
  },

  // Team & Notifications
  addNotification: (notificationData) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },

  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  },

  updateNotificationPreferences: (preferences) => {
    set({ notificationPreferences: preferences });
  },

  addReactionToComment: (commentId, reactionData) => {
    const newReaction: Reaction = {
      ...reactionData,
      id: `REACT-${Date.now()}`,
      timestamp: new Date(),
    };

    set((state) => ({
      actionPlans: state.actionPlans.map(ap => ({
        ...ap,
        comments: ap.comments?.map(c =>
          c.id === commentId
            ? { ...c, reactions: [...(c.reactions || []), newReaction] }
            : c
        ),
      })),
    }));
  },

  addChecklistItem: (actionPlanId, itemData) => {
    const newItem: ChecklistItem = {
      ...itemData,
      id: `CHKITEM-${Date.now()}`,
    };

    set((state) => ({
      actionPlans: state.actionPlans.map(ap =>
        ap.id === actionPlanId
          ? { ...ap, checklist: [...(ap.checklist || []), newItem] }
          : ap
      ),
    }));
  },

  updateChecklistItem: (actionPlanId, itemId, updates) => {
    set((state) => ({
      actionPlans: state.actionPlans.map(ap =>
        ap.id === actionPlanId
          ? {
              ...ap,
              checklist: ap.checklist?.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            }
          : ap
      ),
    }));
  },

  deleteChecklistItem: (actionPlanId, itemId) => {
    set((state) => ({
      actionPlans: state.actionPlans.map(ap =>
        ap.id === actionPlanId
          ? { ...ap, checklist: ap.checklist?.filter(item => item.id !== itemId) }
          : ap
      ),
    }));
  },

  requestApproval: (actionPlanId, data) => {
    const workflow: ApprovalWorkflow = {
      ...data,
      id: `APPRV-${Date.now()}`,
      actionPlanId,
      status: 'pending',
      requestedAt: new Date(),
    };

    set((state) => ({
      actionPlans: state.actionPlans.map(ap =>
        ap.id === actionPlanId ? { ...ap, approvalWorkflow: workflow } : ap
      ),
    }));

    // Send notifications to approvers
    data.approvers.forEach(approver => {
      get().addNotification({
        type: 'approval_request',
        title: 'Approval Request',
        message: `${data.requestedBy.name} has requested your approval`,
        actionPlanId,
        actionPlanTitle: get().getActionPlanById(actionPlanId)?.title,
        relatedUserId: data.requestedBy.id,
        relatedUserName: data.requestedBy.name,
      });
    });
  },

  respondToApproval: (actionPlanId, status, resolvedBy, comments) => {
    set((state) => ({
      actionPlans: state.actionPlans.map(ap =>
        ap.id === actionPlanId && ap.approvalWorkflow
          ? {
              ...ap,
              approvalWorkflow: {
                ...ap.approvalWorkflow,
                status,
                resolvedAt: new Date(),
                resolvedBy,
                comments,
              },
            }
          : ap
      ),
    }));

    // Notify requester
    const actionPlan = get().getActionPlanById(actionPlanId);
    if (actionPlan?.approvalWorkflow) {
      get().addNotification({
        type: 'status_change',
        title: `Approval ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        message: `${resolvedBy.name} has ${status} your approval request`,
        actionPlanId,
        actionPlanTitle: actionPlan.title,
        relatedUserId: resolvedBy.id,
        relatedUserName: resolvedBy.name,
      });
    }
  },

  loadActionPlansFromFirestore: async () => {
    try {
      // Dynamically import to avoid SSR issues
      const { getAllActionPlansFromFirestore } = await import('@/lib/firestoreUtils');
      const result = await getAllActionPlansFromFirestore();
      
      if (result.success && result.data) {
        // Convert Firestore timestamps to Date objects with proper validation
        const actionPlans = result.data.map(ap => {
          // Helper function to safely convert to Date
          const toDate = (value: any): Date => {
            if (!value) return new Date();
            if (value instanceof Date) return value;
            if (value.toDate && typeof value.toDate === 'function') return value.toDate(); // Firestore Timestamp
            if (value.seconds) return new Date(value.seconds * 1000); // Firestore Timestamp object
            const date = new Date(value);
            return isNaN(date.getTime()) ? new Date() : date;
          };

          return {
            ...ap,
            createdAt: toDate(ap.createdAt),
            updatedAt: toDate(ap.updatedAt),
            completedAt: ap.completedAt ? toDate(ap.completedAt) : undefined,
            statusHistory: ap.statusHistory?.map((sh: any) => ({
              ...sh,
              changedAt: toDate(sh.changedAt),
            })) || [],
            when: {
              ...ap.when,
              dueDate: toDate(ap.when?.dueDate),
              reminderSettings: {
                enabled: ap.when?.reminderSettings?.enabled || false,
                reminderDate: ap.when?.reminderSettings?.reminderDate 
                  ? toDate(ap.when.reminderSettings.reminderDate)
                  : undefined,
              },
            },
          };
        });
        
        set({ actionPlans });
      }
    } catch (error) {
      console.error('Error loading action plans from Firestore:', error);
    }
  },

  setActionPlans: (actionPlans) => {
    set({ actionPlans });
  },
}));
