'use client';

import { useState, useEffect } from 'react';
import { useActionPlansStore } from '@/store/actionPlansStore';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getAllTeamMembersFromFirestore } from '@/lib/firestoreUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  ArrowLeftIcon,
  PlusIcon,
  XIcon,
  SaveIcon,
  UserPlusIcon,
  TagIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Priority, Status, TeamMember } from '@/types';
import { use } from 'react';

interface FormData {
  title: string;
  description: string;
  successCriteria: string[];
  requiredResources: string[];
  primaryAssignee: TeamMember | null;
  supportingMembers: TeamMember[];
  stakeholders: TeamMember[];
  dueDate: string;
  timeEstimate: number;
  reminderEnabled: boolean;
  reminderDate: string;
  priority: Priority;
  status: Status;
  tags: string[];
  dependencies: string[];
}

interface CustomMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function ActionFormPage({ params }: { params: Promise<{ id?: string }> }) {
  const router = useRouter();
  const { id: paramId } = use(params);
  const { getActionPlanById, addActionPlan, updateActionPlan, actionPlans } = useActionPlansStore();
  
  const isEditMode = paramId && paramId !== 'new';
  const existingAction = isEditMode && paramId ? getActionPlanById(paramId) : null;

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    successCriteria: [''],
    requiredResources: [''],
    primaryAssignee: null,
    supportingMembers: [],
    stakeholders: [],
    dueDate: new Date().toISOString().split('T')[0],
    timeEstimate: 8,
    reminderEnabled: false,
    reminderDate: '',
    priority: 'medium',
    status: 'pending',
    tags: [],
    dependencies: [],
  });

  const [newCriterion, setNewCriterion] = useState('');
  const [newResource, setNewResource] = useState('');
  const [newTag, setNewTag] = useState('');
  const [primaryAssigneeName, setPrimaryAssigneeName] = useState('');
  const [supportingMemberName, setSupportingMemberName] = useState('');
  const [stakeholderName, setStakeholderName] = useState('');
  const [customMembers, setCustomMembers] = useState<CustomMember[]>([]);
  const [saving, setSaving] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  // Load team members from Firebase
  useEffect(() => {
    const loadTeamMembers = async () => {
      setLoadingTeam(true);
      const result = await getAllTeamMembersFromFirestore();
      if (result.success) {
        setTeamMembers(result.data);
      }
      setLoadingTeam(false);
    };

    loadTeamMembers();
  }, []);

  useEffect(() => {
    if (existingAction) {
      setFormData({
        title: existingAction.title,
        description: existingAction.what.description,
        successCriteria: existingAction.what.successCriteria,
        requiredResources: existingAction.what.requiredResources,
        primaryAssignee: existingAction.who.primaryAssignee,
        supportingMembers: existingAction.who.supportingMembers,
        stakeholders: existingAction.who.stakeholders,
        dueDate: existingAction.when.dueDate.toISOString().split('T')[0],
        timeEstimate: existingAction.when.timeEstimate,
        reminderEnabled: existingAction.when.reminderSettings.enabled,
        reminderDate: existingAction.when.reminderSettings.reminderDate?.toISOString().split('T')[0] || '',
        priority: existingAction.priority,
        status: existingAction.status,
        tags: existingAction.tags,
        dependencies: existingAction.dependencies,
      });
      setPrimaryAssigneeName(existingAction.who.primaryAssignee.name);
    }
  }, [existingAction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.primaryAssignee && !primaryAssigneeName.trim()) {
      alert('Please enter a primary assignee name');
      return;
    }

    setSaving(true);

    // Create or use primary assignee
    const primaryAssignee = formData.primaryAssignee || {
      id: `custom-${Date.now()}`,
      name: primaryAssigneeName.trim(),
      email: `${primaryAssigneeName.trim().toLowerCase().replace(/\s+/g, '.')}@example.com`,
      avatar: '',
    };

    // Prepare reminder settings without undefined values
    const reminderSettings: any = {
      enabled: formData.reminderEnabled,
    };
    
    // Only include reminderDate if it exists
    if (formData.reminderDate) {
      reminderSettings.reminderDate = new Date(formData.reminderDate);
    }

    const actionData = {
      title: formData.title,
      what: {
        description: formData.description,
        successCriteria: formData.successCriteria.filter(c => c.trim()),
        requiredResources: formData.requiredResources.filter(r => r.trim()),
      },
      who: {
        primaryAssignee: primaryAssignee,
        supportingMembers: formData.supportingMembers,
        stakeholders: formData.stakeholders,
      },
      when: {
        dueDate: new Date(formData.dueDate),
        timeEstimate: formData.timeEstimate,
        reminderSettings: reminderSettings,
      },
      priority: formData.priority,
      status: formData.status,
      tags: formData.tags,
      dependencies: formData.dependencies,
      createdBy: primaryAssignee.name,
    };

    try {
      // Save to Firestore
      if (isEditMode && existingAction) {
        const actionRef = doc(db, 'actionPlans', existingAction.id);
        await updateDoc(actionRef, {
          ...actionData,
          updatedAt: new Date(),
        });
        updateActionPlan(existingAction.id, actionData);
      } else {
        await addDoc(collection(db, 'actionPlans'), {
          ...actionData,
          createdAt: new Date(),
          updatedAt: new Date(),
          statusHistory: [{
            from: 'pending',
            to: actionData.status,
            changedAt: new Date(),
            changedBy: actionData.createdBy,
          }],
        });
        addActionPlan(actionData);
      }

      router.push('/actions');
    } catch (error) {
      console.error('Error saving action plan:', error);
      alert('Failed to save action plan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addSuccessCriterion = () => {
    if (newCriterion.trim()) {
      setFormData({
        ...formData,
        successCriteria: [...formData.successCriteria, newCriterion],
      });
      setNewCriterion('');
    }
  };

  const removeSuccessCriterion = (index: number) => {
    setFormData({
      ...formData,
      successCriteria: formData.successCriteria.filter((_, i) => i !== index),
    });
  };

  const addResource = () => {
    if (newResource.trim()) {
      setFormData({
        ...formData,
        requiredResources: [...formData.requiredResources, newResource],
      });
      setNewResource('');
    }
  };

  const removeResource = (index: number) => {
    setFormData({
      ...formData,
      requiredResources: formData.requiredResources.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const addCustomSupportingMember = () => {
    if (supportingMemberName.trim()) {
      const customMember: CustomMember = {
        id: `custom-${Date.now()}-${Math.random()}`,
        name: supportingMemberName.trim(),
        email: `${supportingMemberName.trim().toLowerCase().replace(/\s+/g, '.')}@example.com`,
        avatar: '',
      };
      setFormData({
        ...formData,
        supportingMembers: [...formData.supportingMembers, customMember as TeamMember],
      });
      setSupportingMemberName('');
    }
  };

  const addCustomStakeholder = () => {
    if (stakeholderName.trim()) {
      const customMember: CustomMember = {
        id: `custom-${Date.now()}-${Math.random()}`,
        name: stakeholderName.trim(),
        email: `${stakeholderName.trim().toLowerCase().replace(/\s+/g, '.')}@example.com`,
        avatar: '',
      };
      setFormData({
        ...formData,
        stakeholders: [...formData.stakeholders, customMember as TeamMember],
      });
      setStakeholderName('');
    }
  };

  const toggleSupportingMember = (member: TeamMember) => {
    const exists = formData.supportingMembers.find(m => m.id === member.id);
    if (exists) {
      setFormData({
        ...formData,
        supportingMembers: formData.supportingMembers.filter(m => m.id !== member.id),
      });
    } else {
      setFormData({
        ...formData,
        supportingMembers: [...formData.supportingMembers, member],
      });
    }
  };

  const toggleStakeholder = (member: TeamMember) => {
    const exists = formData.stakeholders.find(m => m.id === member.id);
    if (exists) {
      setFormData({
        ...formData,
        stakeholders: formData.stakeholders.filter(m => m.id !== member.id),
      });
    } else {
      setFormData({
        ...formData,
        stakeholders: [...formData.stakeholders, member],
      });
    }
  };

  const availableActions = actionPlans.filter(ap => ap.id !== paramId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/actions')}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Actions
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {isEditMode ? 'Edit Action Plan' : 'Create New Action Plan'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a clear, concise title"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Status) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* WHAT Section */}
            <div className="space-y-4 p-6 bg-purple-50 rounded-lg">
              <h2 className="text-xl font-semibold text-purple-900">WHAT</h2>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what needs to be done in detail"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label>Success Criteria</Label>
                <div className="space-y-2">
                  {formData.successCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={criterion} readOnly className="flex-1" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSuccessCriterion(index)}
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newCriterion}
                      onChange={(e) => setNewCriterion(e.target.value)}
                      placeholder="Add success criterion"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSuccessCriterion())}
                    />
                    <Button type="button" onClick={addSuccessCriterion}>
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Required Resources</Label>
                <div className="space-y-2">
                  {formData.requiredResources.map((resource, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={resource} readOnly className="flex-1" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeResource(index)}
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newResource}
                      onChange={(e) => setNewResource(e.target.value)}
                      placeholder="Add required resource"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
                    />
                    <Button type="button" onClick={addResource}>
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* WHO Section */}
            <div className="space-y-4 p-6 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900">WHO</h2>
              
              <div>
                <Label>Primary Assignee *</Label>
                <div className="space-y-2">
                  <Input
                    value={primaryAssigneeName}
                    onChange={(e) => {
                      setPrimaryAssigneeName(e.target.value);
                      setFormData({ ...formData, primaryAssignee: null });
                    }}
                    placeholder="Type assignee name"
                    className="mb-2"
                    required
                  />
                  {loadingTeam ? (
                    <div className="text-xs text-gray-500 py-2">Loading team members...</div>
                  ) : teamMembers.length > 0 ? (
                    <>
                      <div className="text-xs text-gray-500">Or select from team:</div>
                      <Select
                        value={formData.primaryAssignee?.id || ''}
                        onValueChange={(id) => {
                          const member = teamMembers.find(m => m.id === id);
                          if (member) {
                            setFormData({ ...formData, primaryAssignee: member });
                            setPrimaryAssigneeName(member.name);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select from team" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers.map(member => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center gap-2">
                                <span>{member.name}</span>
                                {member.role && <span className="text-xs text-gray-500">({member.role})</span>}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  ) : (
                    <div className="text-xs text-gray-500 py-2">No team members found. Add team members in Firebase or continue by typing a name above.</div>
                  )}
                </div>
              </div>

              <div>
                <Label>Supporting Team Members</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={supportingMemberName}
                      onChange={(e) => setSupportingMemberName(e.target.value)}
                      placeholder="Type member name"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSupportingMember())}
                    />
                    <Button type="button" onClick={addCustomSupportingMember}>
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.supportingMembers.map(member => (
                      <Badge key={member.id} className="flex items-center gap-1">
                        {member.name}
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            supportingMembers: formData.supportingMembers.filter(m => m.id !== member.id),
                          })}
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {!loadingTeam && teamMembers.length > 0 && (
                    <>
                      <div className="text-xs text-gray-500 mt-2">Or select from team:</div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {teamMembers
                          .filter(m => m.id !== formData.primaryAssignee?.id)
                          .map(member => (
                            <button
                              key={member.id}
                              type="button"
                              onClick={() => toggleSupportingMember(member)}
                              className={`flex items-center gap-2 p-2 rounded border ${
                                formData.supportingMembers.find(m => m.id === member.id)
                                  ? 'border-blue-500 bg-blue-100'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              {member.avatar ? (
                                <Avatar className="w-8 h-8">
                                  <img src={member.avatar} alt={member.name} />
                                </Avatar>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold text-xs">
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="text-sm">{member.name}</span>
                            </button>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <Label>Stakeholders</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={stakeholderName}
                      onChange={(e) => setStakeholderName(e.target.value)}
                      placeholder="Type stakeholder name"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomStakeholder())}
                    />
                    <Button type="button" onClick={addCustomStakeholder}>
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.stakeholders.map(member => (
                      <Badge key={member.id} className="flex items-center gap-1">
                        {member.name}
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            stakeholders: formData.stakeholders.filter(m => m.id !== member.id),
                          })}
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {!loadingTeam && teamMembers.length > 0 && (
                    <>
                      <div className="text-xs text-gray-500 mt-2">Or select from team:</div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {teamMembers
                          .filter(m => m.id !== formData.primaryAssignee?.id)
                          .map(member => (
                            <button
                              key={member.id}
                              type="button"
                              onClick={() => toggleStakeholder(member)}
                              className={`flex items-center gap-2 p-2 rounded border ${
                                formData.stakeholders.find(m => m.id === member.id)
                                  ? 'border-blue-500 bg-blue-100'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              {member.avatar ? (
                                <Avatar className="w-8 h-8">
                                  <img src={member.avatar} alt={member.name} />
                                </Avatar>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold text-xs">
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="text-sm">{member.name}</span>
                            </button>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* WHEN Section */}
            <div className="space-y-4 p-6 bg-green-50 rounded-lg">
              <h2 className="text-xl font-semibold text-green-900">WHEN</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="timeEstimate">Time Estimate (hours) *</Label>
                  <Input
                    id="timeEstimate"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.timeEstimate || ''}
                    onChange={(e) => setFormData({ ...formData, timeEstimate: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="reminderEnabled"
                    checked={formData.reminderEnabled}
                    onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
                  />
                  <Label htmlFor="reminderEnabled">Enable Reminder</Label>
                </div>
                {formData.reminderEnabled && (
                  <Input
                    type="date"
                    value={formData.reminderDate}
                    onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                  />
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Tags & Categories</h2>
              
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} className="flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <XIcon className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag}>
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Dependencies */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Dependencies</h2>
              
              <div>
                <Label>Linked Action Plans</Label>
                <Select
                  value=""
                  onValueChange={(id) => {
                    if (!formData.dependencies.includes(id)) {
                      setFormData({
                        ...formData,
                        dependencies: [...formData.dependencies, id],
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Link an action plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableActions
                      .filter(ap => !formData.dependencies.includes(ap.id))
                      .map(action => (
                        <SelectItem key={action.id} value={action.id}>
                          {action.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.dependencies.map(depId => {
                    const action = availableActions.find(ap => ap.id === depId);
                    return action ? (
                      <Badge key={depId} className="flex items-center gap-1">
                        {action.title}
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            dependencies: formData.dependencies.filter(id => id !== depId),
                          })}
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/actions')}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-purple-600 to-blue-600"
                disabled={saving}
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : (isEditMode ? 'Update Action Plan' : 'Create Action Plan')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
