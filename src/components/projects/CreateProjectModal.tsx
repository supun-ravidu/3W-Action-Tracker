'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectsStore } from '@/store/projectsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Sparkles,
  Rocket,
  Zap,
  Target,
  DollarSign,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { addProjectToFirestore } from '@/lib/firestoreUtils';
import { useAuth } from '@/contexts/AuthContext';
import { submitProjectRequest } from '@/lib/projectRequestService';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const projectIcons = [
  '🚀', '⚡', '🎯', '💡', '🔥', '⭐', '🎨', '📱',
  '💻', '🎪', '🎭', '🎬', '🎮', '🏆', '🎓', '🌟',
  '🔮', '🎁', '🌈', '🦄', '👋', '💪', '🐛', '🌺',
  '🎸', '🎤', '📊', '📈', '💰', '🏢', '🌍', '🚢'
];

const projectColors = [
  { name: 'Blue', value: '#3B82F6', gradient: 'from-blue-500 to-blue-600' },
  { name: 'Green', value: '#10B981', gradient: 'from-green-500 to-green-600' },
  { name: 'Purple', value: '#8B5CF6', gradient: 'from-purple-500 to-purple-600' },
  { name: 'Pink', value: '#EC4899', gradient: 'from-pink-500 to-pink-600' },
  { name: 'Orange', value: '#F59E0B', gradient: 'from-orange-500 to-orange-600' },
  { name: 'Red', value: '#EF4444', gradient: 'from-red-500 to-red-600' },
  { name: 'Indigo', value: '#6366F1', gradient: 'from-indigo-500 to-indigo-600' },
  { name: 'Teal', value: '#14B8A6', gradient: 'from-teal-500 to-teal-600' },
  { name: 'Cyan', value: '#06B6D4', gradient: 'from-cyan-500 to-cyan-600' },
  { name: 'Yellow', value: '#EAB308', gradient: 'from-yellow-500 to-yellow-600' },
];

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ open, onOpenChange }) => {
  const { addProject, workspaces, addWorkspace } = useProjectsStore();
  const { user: currentUser, isAdmin } = useAuth();
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Auto-create default workspace if none exist
  React.useEffect(() => {
    if (open && workspaces.length === 0) {
      const defaultWorkspace = {
        name: 'My Workspace',
        description: 'Default workspace for your projects',
        projects: [],
        teamMembers: [],
        owner: {
          id: currentUser?.uid || 'default-user',
          name: currentUser?.displayName || currentUser?.email || 'User',
          email: currentUser?.email || 'user@example.com',
        },
      };
      addWorkspace(defaultWorkspace);
    }
  }, [open, workspaces.length]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🚀',
    color: projectColors[0].value,
    workspace: '',
    startDate: new Date(),
    targetEndDate: undefined as Date | undefined,
    budget: '',
    tags: '',
  });

  // Auto-select first workspace if only one exists
  React.useEffect(() => {
    if (open && workspaces.length === 1 && !formData.workspace) {
      handleInputChange('workspace', workspaces[0].id);
    }
  }, [open, workspaces]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.workspace) {
      setError('⚠️ Please fill in all required fields');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsCreating(true);
    setSuccessMessage('');
    setError('');

    try {
      const defaultUser = {
        id: currentUser?.uid || 'default-user',
        name: currentUser?.displayName || currentUser?.email || 'User',
        email: currentUser?.email || 'user@example.com',
      };

      // Set default target end date if not provided (30 days from start)
      const targetEnd = formData.targetEndDate || new Date(formData.startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      const projectData = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        color: formData.color,
        workspace: formData.workspace,
        startDate: formData.startDate,
        targetEndDate: targetEnd,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        budget: formData.budget ? {
          allocated: parseFloat(formData.budget),
          spent: 0,
          currency: 'USD',
        } : undefined,
      };

      // Admin can create directly, others submit request
      if (isAdmin) {
        const newProject = {
          ...projectData,
          actionPlans: [],
          teamMembers: [],
          lead: defaultUser,
          status: 'active' as const,
          dependencies: [],
        };

        // Save to Firebase directly
        const result = await addProjectToFirestore(newProject);

        if (result.success && result.id) {
          // Add to local store with the Firebase ID
          addProject({
            ...newProject,
            id: result.id,
          } as any);

          setSuccessMessage('🎉 Project created successfully!');
          setShowConfetti(true);
          
          // Confetti celebration
          if (typeof window !== 'undefined') {
            import('canvas-confetti').then((confettiModule) => {
              const confetti = confettiModule.default;
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'],
              });
            });
          }
          
          // Reset form after short delay
          setTimeout(() => {
            setFormData({
              name: '',
              description: '',
              icon: '🚀',
              color: projectColors[0].value,
              workspace: '',
              startDate: new Date(),
              targetEndDate: undefined,
              budget: '',
              tags: '',
            });
            setStep(1);
            setSuccessMessage('');
            onOpenChange(false);
          }, 1500);
        }
      } else {
        // Submit approval request for non-admins
        const result = await submitProjectRequest({
          ...projectData,
          requestedBy: defaultUser,
        });

        if (result.success) {
          setSuccessMessage('✨ Request submitted! Waiting for admin approval...');
          setShowConfetti(true);
          
          // Confetti celebration
          if (typeof window !== 'undefined') {
            import('canvas-confetti').then((confettiModule) => {
              const confetti = confettiModule.default;
              confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#8B5CF6', '#EC4899', '#F59E0B'],
              });
            });
          }
          
          // Reset form after short delay
          setTimeout(() => {
            setFormData({
              name: '',
              description: '',
              icon: '🚀',
              color: projectColors[0].value,
              workspace: '',
              startDate: new Date(),
              targetEndDate: undefined,
              budget: '',
              tags: '',
            });
            setStep(1);
            setSuccessMessage('');
            onOpenChange(false);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`❌ Error: ${errorMessage}`);
      setTimeout(() => setError(''), 4000);
    } finally {
      setIsCreating(false);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.length > 0 && formData.workspace.length > 0;
      case 2:
        return true; // Icon and color are optional with defaults
      case 3:
        return true; // All fields in step 3 are optional
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <div className="relative flex-1 overflow-y-auto">
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-10 pointer-events-none"
            animate={{
              background: [
                'linear-gradient(45deg, #3B82F6, #8B5CF6)',
                'linear-gradient(45deg, #8B5CF6, #EC4899)',
                'linear-gradient(45deg, #EC4899, #F59E0B)',
                'linear-gradient(45deg, #F59E0B, #10B981)',
                'linear-gradient(45deg, #10B981, #3B82F6)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className="relative p-6">
            <DialogHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="flex items-center justify-center mb-4"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              <DialogTitle className="text-2xl font-bold text-center">
                Create New Project
              </DialogTitle>
              <DialogDescription className="text-center">
                Let's bring your ideas to life!
              </DialogDescription>
            </DialogHeader>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 my-6">
              {[1, 2, 3].map((s) => (
                <motion.div
                  key={s}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    s === step ? 'w-12 bg-gradient-to-r from-blue-500 to-purple-600' : 'w-2 bg-gray-300'
                  )}
                  animate={{ scale: s === step ? 1.1 : 1 }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      Project Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter a catchy project name..."
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-500" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="What makes this project awesome?"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="border-2 focus:border-purple-500 transition-colors min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workspace" className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      Workspace *
                    </Label>
                    {workspaces.length > 0 ? (
                      <Select value={formData.workspace} onValueChange={(value) => handleInputChange('workspace', value)}>
                        <SelectTrigger className="border-2 focus:border-green-500">
                          <SelectValue placeholder="Select a workspace" />
                        </SelectTrigger>
                        <SelectContent>
                          {workspaces.map((ws) => (
                            <SelectItem key={ws.id} value={ws.id}>
                              {ws.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200"
                      >
                        <p className="text-sm text-blue-700 flex items-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            ⚡
                          </motion.span>
                          Creating your first workspace...
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Visual Identity */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 max-h-[500px] overflow-y-auto pr-2"
                >
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      Choose an Icon
                    </Label>
                    <div className="grid grid-cols-8 gap-2">
                      {projectIcons.map((icon) => (
                        <motion.button
                          key={icon}
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleInputChange('icon', icon)}
                          className={cn(
                            'p-3 text-2xl rounded-lg border-2 transition-all',
                            formData.icon === icon
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          {icon}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Rocket className="h-4 w-4 text-pink-500" />
                      Pick a Color Theme
                    </Label>
                    <div className="grid grid-cols-5 gap-3">
                      {projectColors.map((color) => (
                        <motion.button
                          key={color.value}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleInputChange('color', color.value)}
                          className={cn(
                            'relative h-16 rounded-xl transition-all',
                            `bg-gradient-to-br ${color.gradient}`,
                            formData.color === color.value && 'ring-4 ring-offset-2 ring-gray-400'
                          )}
                        >
                          {formData.color === color.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <CheckCircle2 className="h-6 w-6 text-white" />
                            </motion.div>
                          )}
                          <span className="sr-only">{color.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <motion.div
                    className="p-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-sm text-gray-600 mb-3 font-medium">Preview:</p>
                    <div
                      className="p-4 rounded-lg shadow-md text-white"
                      style={{ backgroundColor: formData.color }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{formData.icon}</span>
                        <div>
                          <h3 className="font-bold text-lg">{formData.name || 'Project Name'}</h3>
                          <p className="text-sm opacity-90">{formData.description || 'Description'}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 3: Additional Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-blue-500" />
                        Start Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal border-2',
                              !formData.startDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.startDate ? format(formData.startDate, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) => handleInputChange('startDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetEndDate" className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-red-500" />
                        Target End Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal border-2',
                              !formData.targetEndDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.targetEndDate ? format(formData.targetEndDate, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.targetEndDate}
                            onSelect={(date) => handleInputChange('targetEndDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      Budget (USD)
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="Enter budget amount..."
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="border-2 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-500" />
                      Tags (comma-separated)
                    </Label>
                    <Input
                      id="tags"
                      placeholder="e.g., marketing, urgent, q1..."
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="border-2 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="mt-4 p-4 rounded-lg bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300"
                >
                  <div className="flex items-center justify-center gap-2 text-red-700 font-medium">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      ⚠️
                    </motion.div>
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300"
                >
                  <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 0.6, repeat: showConfetti ? Infinity : 0 }}
                    >
                      {successMessage.includes('🎉') ? '🎉' : '✨'}
                    </motion.div>
                    <span>{successMessage}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex justify-between mt-8 gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="flex-1"
              >
                Back
              </Button>

              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isCreating}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  {isCreating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="mr-2"
                      >
                        <Sparkles className="h-4 w-4" />
                      </motion.div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-4 w-4" />
                      Create Project
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
