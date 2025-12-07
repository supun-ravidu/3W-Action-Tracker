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
  CheckCircle2,
  Circle,
  Sparkles,
  Rocket,
  Users,
  Calendar,
  Target,
  ChevronRight,
  ChevronLeft,
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
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

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

  const steps = [
    { 
      id: 0, 
      title: 'Basic Info', 
      icon: Sparkles, 
      description: 'Set the foundation',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 1, 
      title: 'What', 
      icon: Target, 
      description: 'Define objectives',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 2, 
      title: 'Who', 
      icon: Users, 
      description: 'Assign team',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 3, 
      title: 'When', 
      icon: Calendar, 
      description: 'Set timeline',
      color: 'from-orange-500 to-red-500'
    },
    { 
      id: 4, 
      title: 'Finalize', 
      icon: Rocket, 
      description: 'Tags & launch',
      color: 'from-violet-500 to-purple-500'
    },
  ];

  const isStepValid = (step: number) => {
    switch(step) {
      case 0:
        return formData.title.trim().length > 0;
      case 1:
        return formData.description.trim().length > 0;
      case 2:
        return formData.primaryAssignee !== null || primaryAssigneeName.trim().length > 0;
      case 3:
        return formData.dueDate.length > 0 && formData.timeEstimate > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && isStepValid(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/actions')}
            className="group hover:bg-white/50 backdrop-blur-sm transition-all"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Actions
          </Button>
          
          {!isEditMode && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Creating new action plan</span>
            </div>
          )}
        </div>

        {/* Hero Section */}
        {!isEditMode && (
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-fade-in">
              Create Your Action Plan
            </h1>
            <p className="text-gray-600 text-lg">
              Transform ideas into actionable results with our smart planning wizard
            </p>
          </div>
        )}

        {/* Progress Steps - Only show in create mode */}
        {!isEditMode && (
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === index;
                const isCompleted = completedSteps.includes(index);
                
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (index < currentStep || isCompleted) {
                            setCurrentStep(index);
                          }
                        }}
                        disabled={index > currentStep && !isCompleted}
                        className={`relative group transition-all duration-300 ${
                          index > currentStep && !isCompleted ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <div className={`
                          w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform
                          ${isActive 
                            ? `bg-gradient-to-r ${step.color} scale-110 shadow-lg` 
                            : isCompleted
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-md'
                            : 'bg-white shadow-sm border-2 border-gray-200'
                          }
                          ${!isActive && (index <= currentStep || isCompleted) ? 'hover:scale-105' : ''}
                        `}>
                          {isCompleted && !isActive ? (
                            <CheckCircle2 className="w-8 h-8 text-white" />
                          ) : (
                            <StepIcon className={`w-8 h-8 ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`} />
                          )}
                        </div>
                        
                        {/* Pulse animation for active step */}
                        {isActive && (
                          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.color} animate-ping opacity-20`} />
                        )}
                      </button>
                      
                      <div className="mt-3 text-center">
                        <div className={`font-semibold text-sm transition-colors ${
                          isActive ? 'text-gray-900' : isCompleted ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </div>
                        <div className={`text-xs transition-colors ${
                          isActive ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </div>
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-2 transition-all duration-500 ${
                        isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <Card className="relative overflow-hidden backdrop-blur-xl bg-white/90 border-0 shadow-2xl">
          {/* Decorative gradient overlay */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${steps[currentStep]?.color || 'from-purple-500 to-pink-500'}`} />
          
          <div className="p-8 lg:p-12">
            {isEditMode && (
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8">
                Edit Action Plan
              </h1>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 0: Basic Info */}
            {(isEditMode || currentStep === 0) && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                  <p className="text-sm text-gray-500">Start with a compelling title and priority</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Launch new marketing campaign"
                  required
                  className="h-12 text-lg border-2 focus:border-purple-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-base font-semibold">Priority *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className="h-12 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">🔥 Critical</SelectItem>
                      <SelectItem value="high">⚡ High</SelectItem>
                      <SelectItem value="medium">➡️ Medium</SelectItem>
                      <SelectItem value="low">💤 Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-base font-semibold">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Status) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="h-12 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">⏳ Pending</SelectItem>
                      <SelectItem value="in-progress">🚀 In Progress</SelectItem>
                      <SelectItem value="blocked">🚫 Blocked</SelectItem>
                      <SelectItem value="completed">✅ Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            )}

            {/* Step 1: WHAT Section */}
            {(isEditMode || currentStep === 1) && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">What</h2>
                  <p className="text-sm text-gray-500">Define your goals and success criteria</p>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100 space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a detailed description of what needs to be accomplished..."
                  rows={5}
                  required
                  className="border-2 focus:border-blue-400 transition-colors resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Success Criteria
                </Label>
                <div className="space-y-2">
                  {formData.successCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-start gap-2 group">
                      <div className="flex-1 p-3 bg-white rounded-lg border-2 border-blue-100 group-hover:border-blue-300 transition-colors">
                        {criterion}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSuccessCriterion(index)}
                        className="hover:bg-red-100 hover:text-red-600"
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newCriterion}
                      onChange={(e) => setNewCriterion(e.target.value)}
                      placeholder="e.g., Achieve 80% user satisfaction"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSuccessCriterion())}
                      className="border-2 focus:border-blue-400"
                    />
                    <Button 
                      type="button" 
                      onClick={addSuccessCriterion}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  📦 Required Resources
                </Label>
                <div className="space-y-2">
                  {formData.requiredResources.map((resource, index) => (
                    <div key={index} className="flex items-start gap-2 group">
                      <div className="flex-1 p-3 bg-white rounded-lg border-2 border-blue-100 group-hover:border-blue-300 transition-colors">
                        {resource}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeResource(index)}
                        className="hover:bg-red-100 hover:text-red-600"
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newResource}
                      onChange={(e) => setNewResource(e.target.value)}
                      placeholder="e.g., Design team, Budget: $5000"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
                      className="border-2 focus:border-blue-400"
                    />
                    <Button 
                      type="button" 
                      onClick={addResource}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            </div>
            )}

            {/* Step 2: WHO Section */}
            {(isEditMode || currentStep === 2) && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Who</h2>
                  <p className="text-sm text-gray-500">Assign team members and stakeholders</p>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-100 space-y-6">
              
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  👤 Primary Assignee *
                </Label>
                <div className="space-y-2">
                  <Input
                    value={primaryAssigneeName}
                    onChange={(e) => {
                      setPrimaryAssigneeName(e.target.value);
                      setFormData({ ...formData, primaryAssignee: null });
                    }}
                    placeholder="Enter the primary assignee's name"
                    className="h-12 border-2 focus:border-green-400 transition-colors"
                    required
                  />
                  {loadingTeam ? (
                    <div className="text-sm text-gray-500 py-2 px-3 bg-white rounded-lg border-2 border-green-100">
                      Loading team members...
                    </div>
                  ) : teamMembers.length > 0 ? (
                    <>
                      <div className="text-sm text-gray-600 font-medium mt-3">Or select from your team:</div>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {teamMembers.map(member => (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, primaryAssignee: member });
                              setPrimaryAssigneeName(member.name);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                              formData.primaryAssignee?.id === member.id
                                ? 'border-green-500 bg-green-50 shadow-md'
                                : 'border-gray-200 hover:border-green-300 bg-white'
                            }`}
                          >
                            {member.avatar ? (
                              <Avatar className="w-10 h-10">
                                <img src={member.avatar} alt={member.name} />
                              </Avatar>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="text-left">
                              <div className="text-sm font-medium">{member.name}</div>
                              {member.role && <div className="text-xs text-gray-500">{member.role}</div>}
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 py-2 px-3 bg-white rounded-lg border-2 border-green-100">
                      No team members found. Continue by typing a name above.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  👥 Supporting Team Members
                </Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={supportingMemberName}
                      onChange={(e) => setSupportingMemberName(e.target.value)}
                      placeholder="Add supporting team member"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSupportingMember())}
                      className="border-2 focus:border-green-400"
                    />
                    <Button 
                      type="button" 
                      onClick={addCustomSupportingMember}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.supportingMembers.map(member => (
                      <Badge 
                        key={member.id} 
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all"
                      >
                        <span>{member.name}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            supportingMembers: formData.supportingMembers.filter(m => m.id !== member.id),
                          })}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {!loadingTeam && teamMembers.length > 0 && (
                    <>
                      <div className="text-sm text-gray-600 font-medium mt-3">Quick select from team:</div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {teamMembers
                          .filter(m => m.id !== formData.primaryAssignee?.id)
                          .map(member => (
                            <button
                              key={member.id}
                              type="button"
                              onClick={() => toggleSupportingMember(member)}
                              className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                                formData.supportingMembers.find(m => m.id === member.id)
                                  ? 'border-green-500 bg-green-100 shadow-md'
                                  : 'border-gray-200 hover:border-green-300 bg-white'
                              }`}
                            >
                              {member.avatar ? (
                                <Avatar className="w-8 h-8">
                                  <img src={member.avatar} alt={member.name} />
                                </Avatar>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-xs">
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

              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  🤝 Stakeholders
                </Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={stakeholderName}
                      onChange={(e) => setStakeholderName(e.target.value)}
                      placeholder="Add stakeholder"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomStakeholder())}
                      className="border-2 focus:border-green-400"
                    />
                    <Button 
                      type="button" 
                      onClick={addCustomStakeholder}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.stakeholders.map(member => (
                      <Badge 
                        key={member.id} 
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 transition-all"
                      >
                        <span>{member.name}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            stakeholders: formData.stakeholders.filter(m => m.id !== member.id),
                          })}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {!loadingTeam && teamMembers.length > 0 && (
                    <>
                      <div className="text-sm text-gray-600 font-medium mt-3">Quick select from team:</div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {teamMembers
                          .filter(m => m.id !== formData.primaryAssignee?.id)
                          .map(member => (
                            <button
                              key={member.id}
                              type="button"
                              onClick={() => toggleStakeholder(member)}
                              className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                                formData.stakeholders.find(m => m.id === member.id)
                                  ? 'border-green-500 bg-green-100 shadow-md'
                                  : 'border-gray-200 hover:border-green-300 bg-white'
                              }`}
                            >
                              {member.avatar ? (
                                <Avatar className="w-8 h-8">
                                  <img src={member.avatar} alt={member.name} />
                                </Avatar>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-xs">
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
            </div>
            )}

            {/* Step 3: WHEN Section */}
            {(isEditMode || currentStep === 3) && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">When</h2>
                  <p className="text-sm text-gray-500">Schedule your timeline and reminders</p>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-100 space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-base font-semibold flex items-center gap-2">
                    📅 Due Date *
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                    className="h-12 border-2 focus:border-orange-400 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeEstimate" className="text-base font-semibold flex items-center gap-2">
                    ⏱️ Time Estimate (hours) *
                  </Label>
                  <Input
                    id="timeEstimate"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.timeEstimate || ''}
                    onChange={(e) => setFormData({ ...formData, timeEstimate: parseFloat(e.target.value) || 0 })}
                    required
                    className="h-12 border-2 focus:border-orange-400 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4 bg-white rounded-lg border-2 border-orange-100">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="reminderEnabled"
                    checked={formData.reminderEnabled}
                    onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
                    className="w-5 h-5 text-orange-500 focus:ring-orange-400 rounded"
                  />
                  <Label htmlFor="reminderEnabled" className="text-base font-semibold cursor-pointer">
                    🔔 Enable Reminder
                  </Label>
                </div>
                {formData.reminderEnabled && (
                  <Input
                    type="date"
                    value={formData.reminderDate}
                    onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                    className="border-2 focus:border-orange-400 transition-colors"
                  />
                )}
              </div>
            </div>
            </div>
            )}

            {/* Step 4: Tags & Dependencies */}
            {(isEditMode || currentStep === 4) && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Finalize & Launch</h2>
                  <p className="text-sm text-gray-500">Add tags and dependencies to complete</p>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border-2 border-violet-100 space-y-6">
              
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  🏷️ Tags
                </Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 transition-all text-base"
                    >
                      <span>{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => removeTag(tag)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="e.g., Marketing, Q1, High-Impact"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="border-2 focus:border-violet-400"
                  />
                  <Button 
                    type="button" 
                    onClick={addTag}
                    className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  🔗 Linked Action Plans
                </Label>
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
                  <SelectTrigger className="h-12 border-2">
                    <SelectValue placeholder="Link a dependency" />
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
                      <Badge 
                        key={depId} 
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 transition-all"
                      >
                        <span>{action.title}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            dependencies: formData.dependencies.filter(id => id !== depId),
                          })}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
            </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 border-t-2">
              {!isEditMode && currentStep > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="group hover:bg-purple-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Previous
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/actions')}
                  disabled={saving}
                >
                  Cancel
                </Button>
              )}

              {!isEditMode && currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className={`group ${
                    isStepValid(currentStep)
                      ? `bg-gradient-to-r ${steps[currentStep].color} hover:shadow-lg`
                      : 'bg-gray-300'
                  }`}
                >
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="group bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:shadow-xl transition-all"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2 group-hover:translate-y-[-2px] transition-transform" />
                      {isEditMode ? 'Update Action Plan' : 'Launch Action Plan'}
                    </>
                  )}
                </Button>
              )}
            </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
