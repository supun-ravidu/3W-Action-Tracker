'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  Megaphone,
  Code,
  Calendar,
  Rocket,
} from 'lucide-react';
import { addTemplateToFirestore } from '@/lib/firestoreUtils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const categories = [
  { value: 'marketing', label: 'Marketing', icon: Megaphone, color: 'from-purple-500 to-pink-500' },
  { value: 'development', label: 'Development', icon: Code, color: 'from-blue-500 to-cyan-500' },
  { value: 'events', label: 'Events', icon: Calendar, color: 'from-green-500 to-emerald-500' },
  { value: 'operations', label: 'Operations', icon: Rocket, color: 'from-orange-500 to-red-500' },
  { value: 'custom', label: 'Custom', icon: Sparkles, color: 'from-indigo-500 to-purple-500' },
];

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ open, onOpenChange, onSuccess }) => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'custom',
    estimatedDuration: '',
    tags: '',
    requiredRoles: '',
    isPublic: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreating(true);

    try {
      const templateData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        type: 'custom',
        isPublic: formData.isPublic,
        estimatedDuration: parseInt(formData.estimatedDuration) || 7,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        requiredRoles: formData.requiredRoles ? formData.requiredRoles.split(',').map(r => r.trim()) : [],
        actionPlans: [],
        createdBy: {
          id: user?.uid || 'unknown',
          name: user?.displayName || user?.email || 'User',
          email: user?.email || '',
        },
        rating: 0,
      };

      const result = await addTemplateToFirestore(templateData);

      if (result.success) {
        toast.success('Template created successfully!');
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          category: 'custom',
          estimatedDuration: '',
          tags: '',
          requiredRoles: '',
          isPublic: false,
        });
        setStep(1);
        onOpenChange(false);
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error('Failed to create template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('An error occurred while creating the template');
    } finally {
      setIsCreating(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.length > 0 && formData.category.length > 0;
      case 2:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="relative flex-1 overflow-y-auto">
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 opacity-10 pointer-events-none"
            animate={{
              background: [
                'linear-gradient(45deg, #8B5CF6, #EC4899)',
                'linear-gradient(45deg, #EC4899, #F59E0B)',
                'linear-gradient(45deg, #F59E0B, #8B5CF6)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative p-6">
            <DialogHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="flex items-center justify-center mb-4"
              >
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-2xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              <DialogTitle className="text-2xl font-bold text-center">
                Create Custom Template
              </DialogTitle>
              <DialogDescription className="text-center">
                Build a reusable template for your workflows
              </DialogDescription>
            </DialogHeader>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 my-6">
              {[1, 2].map((s) => (
                <motion.div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step 
                      ? 'w-12 bg-gradient-to-r from-purple-500 to-pink-600' 
                      : 'w-2 bg-gray-300'
                  }`}
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
                    <Label htmlFor="name">Template Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Product Launch Workflow"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="border-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this template is for..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="border-2 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => (
                        <motion.button
                          key={cat.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleInputChange('category', cat.value)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.category === cat.value
                              ? `border-purple-500 bg-gradient-to-br ${cat.color} bg-opacity-10`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <cat.icon className="h-5 w-5" />
                            <span className="font-medium">{cat.label}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Additional Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 max-h-[400px] overflow-y-auto pr-2"
                >
                  <div className="space-y-2">
                    <Label htmlFor="duration">Estimated Duration (days)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="e.g., 30"
                      value={formData.estimatedDuration}
                      onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                      className="border-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="e.g., marketing, launch, product"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="border-2"
                    />
                    {formData.tags && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.split(',').map((tag, i) => (
                          <Badge key={i} variant="secondary">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roles">Required Roles (comma-separated)</Label>
                    <Input
                      id="roles"
                      placeholder="e.g., Project Manager, Designer, Developer"
                      value={formData.requiredRoles}
                      onChange={(e) => handleInputChange('requiredRoles', e.target.value)}
                      className="border-2"
                    />
                    {formData.requiredRoles && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.requiredRoles.split(',').map((role, i) => (
                          <Badge key={i} variant="outline">
                            {role.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 p-4 rounded-lg border-2 border-gray-200">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="isPublic" className="cursor-pointer">
                      Make this template public (visible to other users)
                    </Label>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      💡 <strong>Tip:</strong> After creating your template, you can add action plans to it
                      from the template details page.
                    </p>
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

              {step < 2 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
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
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Create Template
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

export default CreateTemplateModal;
