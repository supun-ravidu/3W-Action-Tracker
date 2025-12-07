'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useProjectsStore } from '@/store/projectsStore';
import { useActionPlansStore } from '@/store/actionPlansStore';
import { getAllTemplatesFromFirestore, incrementTemplateUsage } from '@/lib/firestoreUtils';
import CreateTemplateModal from '@/components/templates/CreateTemplateModal';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Star,
  Users,
  Clock,
  CheckCircle2,
  Plus,
  Download,
  Bookmark,
  TrendingUp,
  Rocket,
  Megaphone,
  Code,
  Calendar,
  Bug,
  UserPlus,
  Eye,
  Sparkles,
} from 'lucide-react';

const TemplatesLibrary = () => {
  const { templates, useTemplate, addTemplate, setTemplates } = useProjectsStore();
  const { addActionPlan } = useActionPlansStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pre-built' | 'custom'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load templates from Firebase
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const result = await getAllTemplatesFromFirestore();
        if (result.success && result.data) {
          setTemplates(result.data);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [setTemplates]);

  const handleRefresh = async () => {
    const result = await getAllTemplatesFromFirestore();
    if (result.success && result.data) {
      setTemplates(result.data);
    }
  };

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        searchQuery === '' ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;

      const matchesType = typeFilter === 'all' || template.type === typeFilter;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [templates, searchQuery, categoryFilter, typeFilter]);

  // Group templates by category
  const templatesByCategory = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    filteredTemplates.forEach((template) => {
      if (!grouped[template.category]) {
        grouped[template.category] = [];
      }
      grouped[template.category].push(template);
    });
    return grouped;
  }, [filteredTemplates]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'marketing':
        return <Megaphone className="h-5 w-5" />;
      case 'development':
        return <Code className="h-5 w-5" />;
      case 'events':
        return <Calendar className="h-5 w-5" />;
      case 'operations':
        return <Rocket className="h-5 w-5" />;
      case 'custom':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Bookmark className="h-5 w-5" />;
    }
  };

  const handleUseTemplate = async (template: any) => {
    try {
      // Increment usage count in Firebase
      await incrementTemplateUsage(template.id);
      useTemplate(template.id);

      // Create action plans from template
      template.actionPlans.forEach((actionPlanTemplate: any) => {
        addActionPlan({
          ...actionPlanTemplate,
          createdAt: new Date(),
          updatedAt: new Date(),
          statusHistory: [
            {
              from: 'pending',
              to: 'pending',
              changedAt: new Date(),
              changedBy: 'current-user',
            },
          ],
        });
      });

      setSelectedTemplate(null);
      toast.success(`Template "${template.name}" applied successfully!`);
      
      // Refresh templates to show updated usage count
      handleRefresh();
    } catch (error) {
      console.error('Error using template:', error);
      toast.error('Failed to apply template');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates Library</h1>
          <p className="text-muted-foreground">
            {templates.length === 0 
              ? 'Create your first custom template to get started'
              : 'Browse templates or create custom ones for your workflows'
            }
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Custom Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">
              {templates.filter((t) => t.type === 'pre-built').length} pre-built
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.reduce((max, t) => (t.usageCount > max.usageCount ? t : max), templates[0])?.name.substring(0, 12)}...
            </div>
            <p className="text-xs text-muted-foreground">
              {templates.reduce((max, t) => (t.usageCount > max.usageCount ? t : max), templates[0])?.usageCount} uses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                templates.reduce((sum, t) => sum + t.estimatedDuration, 0) / templates.length
              )}{' '}
              days
            </div>
            <p className="text-xs text-muted-foreground">Estimated completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(templates.map((t) => t.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">Available categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={(value: any) => setCategoryFilter(value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pre-built">Pre-built</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Display */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Templates ({filteredTemplates.length})</TabsTrigger>
          <TabsTrigger value="pre-built">
            Pre-built ({filteredTemplates.filter((t) => t.type === 'pre-built').length})
          </TabsTrigger>
          <TabsTrigger value="custom">
            Custom ({filteredTemplates.filter((t) => t.type === 'custom').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                {getCategoryIcon(category)}
                <h2 className="text-xl font-semibold capitalize">{category}</h2>
                <Badge variant="secondary">{categoryTemplates.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={() => setSelectedTemplate(template)}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="pre-built">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates
              .filter((t) => t.type === 'pre-built')
              .map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={() => setSelectedTemplate(template)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates
              .filter((t) => t.type === 'custom')
              .map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={() => setSelectedTemplate(template)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {templates.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-purple-500" />
            <h3 className="text-2xl font-bold mb-2">No Templates Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first custom template to streamline your workflows
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-gradient-to-r from-purple-500 to-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Template
            </Button>
          </div>
        </Card>
      )}

      {/* Template Detail Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedTemplate.name}</DialogTitle>
                <DialogDescription>{selectedTemplate.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Template Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Category</div>
                    <Badge className="capitalize">{selectedTemplate.category}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Duration</div>
                    <div className="font-semibold">{selectedTemplate.estimatedDuration} days</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Actions</div>
                    <div className="font-semibold">{selectedTemplate.actionPlans.length}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Usage</div>
                    <div className="font-semibold">{selectedTemplate.usageCount} times</div>
                  </div>
                </div>

                {/* Rating */}
                {selectedTemplate.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{selectedTemplate.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">/ 5.0</span>
                  </div>
                )}

                {/* Required Roles */}
                <div>
                  <h3 className="font-semibold mb-2">Required Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.requiredRoles.map((role: string) => (
                      <Badge key={role} variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Plans Preview */}
                <div>
                  <h3 className="font-semibold mb-3">
                    Included Actions ({selectedTemplate.actionPlans.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedTemplate.actionPlans.map((action: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{action.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {action.what.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <Badge variant="outline">{action.priority}</Badge>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span>{action.when.timeEstimate}h</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                                  <span>{action.what.successCriteria.length} criteria</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={() => handleUseTemplate(selectedTemplate)} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Use This Template
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Template Modal */}
      <CreateTemplateModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

// Template Card Component
const TemplateCard = ({ template, onUse }: { template: any; onUse: () => void }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'marketing':
        return 'bg-purple-100 text-purple-700';
      case 'development':
        return 'bg-blue-100 text-blue-700';
      case 'events':
        return 'bg-green-100 text-green-700';
      case 'operations':
        return 'bg-orange-100 text-orange-700';
      case 'custom':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onUse}>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge className={getCategoryColor(template.category)} variant="secondary">
            {template.category}
          </Badge>
          {template.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{template.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <CardTitle className="line-clamp-1">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2">{template.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>{template.actionPlans.length} actions</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{template.estimatedDuration}d</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Download className="h-4 w-4" />
            <span>{template.usageCount} uses</span>
          </div>
          <Badge variant="outline">{template.type}</Badge>
        </div>

        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={onUse}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplatesLibrary;
