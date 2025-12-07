import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where, orderBy } from 'firebase/firestore';
import { ActionPlan, TeamMember, Project, Workspace } from '@/types';

// Collection names
const ACTION_PLANS_COLLECTION = 'actionPlans';
const TEAM_MEMBERS_COLLECTION = 'teamMembers';
const PROJECTS_COLLECTION = 'projects';
const WORKSPACES_COLLECTION = 'workspaces';

/**
 * Add a new action plan to Firestore
 */
export const addActionPlanToFirestore = async (actionPlan: Omit<ActionPlan, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
  try {
    const docRef = await addDoc(collection(db, ACTION_PLANS_COLLECTION), {
      ...actionPlan,
      createdAt: new Date(),
      updatedAt: new Date(),
      statusHistory: [],
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding action plan to Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Update an existing action plan in Firestore
 */
export const updateActionPlanInFirestore = async (id: string, updates: Partial<ActionPlan>) => {
  try {
    const actionRef = doc(db, ACTION_PLANS_COLLECTION, id);
    await updateDoc(actionRef, {
      ...updates,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating action plan in Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Delete an action plan from Firestore
 */
export const deleteActionPlanFromFirestore = async (id: string) => {
  try {
    const actionRef = doc(db, ACTION_PLANS_COLLECTION, id);
    await deleteDoc(actionRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting action plan from Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Get a single action plan from Firestore by ID
 */
export const getActionPlanFromFirestore = async (id: string) => {
  try {
    const actionRef = doc(db, ACTION_PLANS_COLLECTION, id);
    const docSnap = await getDoc(actionRef);
    
    if (docSnap.exists()) {
      return { 
        success: true, 
        data: { id: docSnap.id, ...docSnap.data() } as ActionPlan 
      };
    } else {
      return { success: false, error: 'Action plan not found' };
    }
  } catch (error) {
    console.error('Error getting action plan from Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Get all action plans from Firestore
 */
export const getAllActionPlansFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, ACTION_PLANS_COLLECTION));
    const actionPlans: ActionPlan[] = [];
    
    querySnapshot.forEach((doc) => {
      actionPlans.push({ id: doc.id, ...doc.data() } as ActionPlan);
    });
    
    return { success: true, data: actionPlans };
  } catch (error) {
    console.error('Error getting action plans from Firestore:', error);
    return { success: false, error, data: [] };
  }
};

/**
 * Query action plans by status
 */
export const getActionPlansByStatus = async (status: string) => {
  try {
    const q = query(
      collection(db, ACTION_PLANS_COLLECTION),
      where('status', '==', status),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const actionPlans: ActionPlan[] = [];
    
    querySnapshot.forEach((doc) => {
      actionPlans.push({ id: doc.id, ...doc.data() } as ActionPlan);
    });
    
    return { success: true, data: actionPlans };
  } catch (error) {
    console.error('Error querying action plans by status:', error);
    return { success: false, error, data: [] };
  }
};

/**
 * Query action plans by assignee
 */
export const getActionPlansByAssignee = async (assigneeId: string) => {
  try {
    const q = query(
      collection(db, ACTION_PLANS_COLLECTION),
      where('who.primaryAssignee.id', '==', assigneeId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const actionPlans: ActionPlan[] = [];
    
    querySnapshot.forEach((doc) => {
      actionPlans.push({ id: doc.id, ...doc.data() } as ActionPlan);
    });
    
    return { success: true, data: actionPlans };
  } catch (error) {
    console.error('Error querying action plans by assignee:', error);
    return { success: false, error, data: [] };
  }
};

/**
 * Add a new team member to Firestore
 */
export const addTeamMemberToFirestore = async (teamMember: Omit<TeamMember, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, TEAM_MEMBERS_COLLECTION), teamMember);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding team member to Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Get all team members from Firestore
 */
export const getAllTeamMembersFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, TEAM_MEMBERS_COLLECTION));
    const teamMembers: TeamMember[] = [];
    
    querySnapshot.forEach((doc) => {
      teamMembers.push({ id: doc.id, ...doc.data() } as TeamMember);
    });
    
    return { success: true, data: teamMembers };
  } catch (error) {
    console.error('Error getting team members from Firestore:', error);
    return { success: false, error, data: [] };
  }
};

/**
 * Update a team member in Firestore
 */
export const updateTeamMemberInFirestore = async (id: string, updates: Partial<TeamMember>) => {
  try {
    const memberRef = doc(db, TEAM_MEMBERS_COLLECTION, id);
    await updateDoc(memberRef, updates);
    return { success: true };
  } catch (error) {
    console.error('Error updating team member in Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Delete a team member from Firestore
 */
export const deleteTeamMemberFromFirestore = async (id: string) => {
  try {
    const memberRef = doc(db, TEAM_MEMBERS_COLLECTION, id);
    await deleteDoc(memberRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting team member from Firestore:', error);
    return { success: false, error };
  }
};

// ==================== PROJECT FUNCTIONS ====================

/**
 * Add a new project to Firestore
 */
export const addProjectToFirestore = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => {
  try {
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      ...project,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding project to Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Update an existing project in Firestore
 */
export const updateProjectInFirestore = async (id: string, updates: Partial<Project>) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, id);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating project in Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Delete a project from Firestore
 */
export const deleteProjectFromFirestore = async (id: string) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, id);
    await deleteDoc(projectRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting project from Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Get a single project from Firestore by ID
 */
export const getProjectFromFirestore = async (id: string) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, id);
    const docSnap = await getDoc(projectRef);
    
    if (docSnap.exists()) {
      return { 
        success: true, 
        data: { id: docSnap.id, ...docSnap.data() } as Project 
      };
    } else {
      return { success: false, error: 'Project not found' };
    }
  } catch (error) {
    console.error('Error getting project from Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Get all projects from Firestore
 */
export const getAllProjectsFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    const projects: Project[] = [];
    
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as Project);
    });
    
    return { success: true, data: projects };
  } catch (error) {
    console.error('Error getting projects from Firestore:', error);
    return { success: false, error, data: [] };
  }
};

/**
 * Query projects by workspace
 */
export const getProjectsByWorkspace = async (workspaceId: string) => {
  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where('workspace', '==', workspaceId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as Project);
    });
    
    return { success: true, data: projects };
  } catch (error) {
    console.error('Error querying projects by workspace:', error);
    return { success: false, error, data: [] };
  }
};

/**
 * Query projects by status
 */
export const getProjectsByStatus = async (status: 'active' | 'on-hold' | 'archived') => {
  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where('status', '==', status),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as Project);
    });
    
    return { success: true, data: projects };
  } catch (error) {
    console.error('Error querying projects by status:', error);
    return { success: false, error, data: [] };
  }
};

// ==================== WORKSPACE FUNCTIONS ====================

/**
 * Add a new workspace to Firestore
 */
export const addWorkspaceToFirestore = async (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, WORKSPACES_COLLECTION), {
      ...workspace,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding workspace to Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Update an existing workspace in Firestore
 */
export const updateWorkspaceInFirestore = async (id: string, updates: Partial<Workspace>) => {
  try {
    const workspaceRef = doc(db, WORKSPACES_COLLECTION, id);
    await updateDoc(workspaceRef, {
      ...updates,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating workspace in Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Delete a workspace from Firestore
 */
export const deleteWorkspaceFromFirestore = async (id: string) => {
  try {
    const workspaceRef = doc(db, WORKSPACES_COLLECTION, id);
    await deleteDoc(workspaceRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting workspace from Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Get a single workspace from Firestore by ID
 */
export const getWorkspaceFromFirestore = async (id: string) => {
  try {
    const workspaceRef = doc(db, WORKSPACES_COLLECTION, id);
    const docSnap = await getDoc(workspaceRef);
    
    if (docSnap.exists()) {
      return { 
        success: true, 
        data: { id: docSnap.id, ...docSnap.data() } as Workspace 
      };
    } else {
      return { success: false, error: 'Workspace not found' };
    }
  } catch (error) {
    console.error('Error getting workspace from Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Get all workspaces from Firestore
 */
export const getAllWorkspacesFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, WORKSPACES_COLLECTION));
    const workspaces: Workspace[] = [];
    
    querySnapshot.forEach((doc) => {
      workspaces.push({ id: doc.id, ...doc.data() } as Workspace);
    });
    
    return { success: true, data: workspaces };
  } catch (error) {
    console.error('Error getting workspaces from Firestore:', error);
    return { success: false, error, data: [] };
  }
};

// ==================== TEMPLATE FUNCTIONS ====================

const TEMPLATES_COLLECTION = 'templates';

/**
 * Add a new template to Firestore
 */
export const addTemplateToFirestore = async (template: any) => {
  try {
    const docRef = await addDoc(collection(db, TEMPLATES_COLLECTION), {
      ...template,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding template to Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Update an existing template in Firestore
 */
export const updateTemplateInFirestore = async (id: string, updates: any) => {
  try {
    const templateRef = doc(db, TEMPLATES_COLLECTION, id);
    await updateDoc(templateRef, {
      ...updates,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating template in Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Delete a template from Firestore
 */
export const deleteTemplateFromFirestore = async (id: string) => {
  try {
    const templateRef = doc(db, TEMPLATES_COLLECTION, id);
    await deleteDoc(templateRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting template from Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Get all templates from Firestore
 */
export const getAllTemplatesFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, TEMPLATES_COLLECTION));
    const templates: any[] = [];
    
    querySnapshot.forEach((doc) => {
      templates.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: templates };
  } catch (error) {
    console.error('Error getting templates from Firestore:', error);
    return { success: false, error, data: [] };
  }
};

/**
 * Increment template usage count
 */
export const incrementTemplateUsage = async (templateId: string) => {
  try {
    const templateRef = doc(db, TEMPLATES_COLLECTION, templateId);
    const templateSnap = await getDoc(templateRef);
    
    if (templateSnap.exists()) {
      const currentCount = templateSnap.data().usageCount || 0;
      await updateDoc(templateRef, {
        usageCount: currentCount + 1,
        updatedAt: new Date(),
      });
      return { success: true };
    }
    return { success: false, error: 'Template not found' };
  } catch (error) {
    console.error('Error incrementing template usage:', error);
    return { success: false, error };
  }
};
