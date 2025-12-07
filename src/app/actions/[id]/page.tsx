'use client';

import { useState } from 'react';
import { useActionPlansStore } from '@/store/actionPlansStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  ArrowLeftIcon,
  Edit2Icon,
  CopyIcon,
  Trash2Icon,
  Share2Icon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  LinkIcon,
  MessageSquareIcon,
  PaperclipIcon,
  ActivityIcon,
  AlertCircleIcon,
  FileTextIcon,
  SendIcon,
  CheckSquareIcon,
  FileCheckIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import { Priority, Status } from '@/types';
import { teamMembers } from '@/store/mockData';
import { use } from 'react';
import { CommentSection } from '@/components/collaboration/CommentSection';
import { ChecklistManager } from '@/components/collaboration/ChecklistManager';
import { ApprovalWorkflowComponent } from '@/components/collaboration/ApprovalWorkflow';

export default function ActionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const {
    getActionPlanById,
    getCommentsByActionPlan,
    getAttachmentsByActionPlan,
    getActivityLogsByActionPlan,
    updateActionPlan,
    deleteActionPlan,
    duplicateActionPlan,
    addComment,
  } = useActionPlansStore();

  const actionPlan = getActionPlanById(id);
  const comments = getCommentsByActionPlan(id);
  const attachments = getAttachmentsByActionPlan(id);
  const activityLogs = getActivityLogsByActionPlan(id);

  const [newComment, setNewComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [activeTab, setActiveTab] = useState('comments');

  if (!actionPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Action Plan Not Found</h1>
          <p className="text-gray-600 mb-4">The action plan you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/actions')}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Actions
          </Button>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${actionPlan.title}"?`)) {
      deleteActionPlan(actionPlan.id);
      router.push('/actions');
    }
  };

  const handleDuplicate = () => {
    duplicateActionPlan(actionPlan.id);
    router.push('/actions');
  };

  const handleStatusChange = (newStatus: Status) => {
    updateActionPlan(id, { status: newStatus });
    setSelectedStatus(null);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(id, {
        author: teamMembers[0], // Current user
        content: newComment,
      });
      setNewComment('');
    }
  };

  const dependencyActions = actionPlan.dependencies
    .map(depId => getActionPlanById(depId))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/actions')}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Actions
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Title & Actions */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={getPriorityColor(actionPlan.priority)}>
                  {actionPlan.priority}
                </Badge>
                <Badge className={getStatusColor(actionPlan.status)}>
                  {actionPlan.status}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {actionPlan.title}
              </h1>
              <div className="text-sm text-gray-500">
                Created {formatDistanceToNow(actionPlan.createdAt, { addSuffix: true })} by {actionPlan.createdBy}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/actions/${id}/edit`)}>
                <Edit2Icon className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleDuplicate}>
                <CopyIcon className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" size="sm">
                <Share2Icon className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2Icon className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Quick Status Change */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Change Status:</span>
            {(['pending', 'in-progress', 'blocked', 'completed'] as Status[]).map(status => (
              <Button
                key={status}
                variant={actionPlan.status === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange(status)}
                disabled={actionPlan.status === status}
              >
                {status}
              </Button>
            ))}
          </div>

          {/* 3W Details */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* WHAT */}
            <Card className="p-4 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <FileTextIcon className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-purple-900">WHAT</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
                  <p className="text-sm text-gray-600">{actionPlan.what.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Success Criteria</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {actionPlan.what.successCriteria.map((criteria, index) => (
                      <li key={index} className="text-sm text-gray-600">{criteria}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Required Resources</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {actionPlan.what.requiredResources.map((resource, index) => (
                      <li key={index} className="text-sm text-gray-600">{resource}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* WHO */}
            <Card className="p-4 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <UserIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-blue-900">WHO</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Primary Assignee</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10">
                      {actionPlan.who.primaryAssignee.avatar ? (
                        <img src={actionPlan.who.primaryAssignee.avatar} alt={actionPlan.who.primaryAssignee.name} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                          {actionPlan.who.primaryAssignee.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{actionPlan.who.primaryAssignee.name}</div>
                      <div className="text-xs text-gray-500">{actionPlan.who.primaryAssignee.email}</div>
                    </div>
                  </div>
                </div>
                
                {actionPlan.who.supportingMembers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Supporting Team</h3>
                    <div className="space-y-2">
                      {actionPlan.who.supportingMembers.map(member => (
                        <div key={member.id} className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </Avatar>
                          <div className="text-sm">{member.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {actionPlan.who.stakeholders.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Stakeholders</h3>
                    <div className="space-y-2">
                      {actionPlan.who.stakeholders.map(stakeholder => (
                        <div key={stakeholder.id} className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            {stakeholder.avatar ? (
                              <img src={stakeholder.avatar} alt={stakeholder.name} />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                {stakeholder.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </Avatar>
                          <div className="text-sm">{stakeholder.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* WHEN */}
            <Card className="p-4 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold text-green-900">WHEN</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Due Date</h3>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{format(actionPlan.when.dueDate, 'MMMM dd, yyyy')}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(actionPlan.when.dueDate, { addSuffix: true })}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Time Estimate</h3>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{actionPlan.when.timeEstimate} hours</span>
                  </div>
                </div>
                {actionPlan.when.reminderSettings.enabled && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Reminder</h3>
                    <div className="flex items-center gap-2">
                      <AlertCircleIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {actionPlan.when.reminderSettings.reminderDate
                          ? format(actionPlan.when.reminderSettings.reminderDate, 'MMM dd, yyyy')
                          : 'Enabled'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Tags */}
          {actionPlan.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {actionPlan.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Dependencies */}
          {dependencyActions.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Dependencies</h3>
              </div>
              <div className="space-y-2">
                {dependencyActions.map(dep => dep && (
                  <Card
                    key={dep.id}
                    className="p-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/actions/${dep.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{dep.title}</div>
                        <div className="text-sm text-gray-500">{dep.who.primaryAssignee.name}</div>
                      </div>
                      <Badge className={getStatusColor(dep.status)}>
                        {dep.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-lg shadow-lg">
          <TabsList className="w-full justify-start border-b rounded-none p-0">
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquareIcon className="w-4 h-4" />
              Comments ({actionPlan.comments?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="checklist" className="flex items-center gap-2">
              <CheckSquareIcon className="w-4 h-4" />
              Checklist ({actionPlan.checklist?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="approval" className="flex items-center gap-2">
              <FileCheckIcon className="w-4 h-4" />
              Approval
            </TabsTrigger>
            <TabsTrigger value="attachments" className="flex items-center gap-2">
              <PaperclipIcon className="w-4 h-4" />
              Attachments ({attachments.length})
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <ActivityIcon className="w-4 h-4" />
              Activity ({activityLogs.length})
            </TabsTrigger>
          </TabsList>

          {/* Comments Tab */}
          <TabsContent value="comments" className="p-6">
            <CommentSection actionPlanId={id} />
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="p-6">
            <ChecklistManager actionPlanId={id} />
          </TabsContent>

          {/* Approval Tab */}
          <TabsContent value="approval" className="p-6">
            <ApprovalWorkflowComponent actionPlanId={id} />
          </TabsContent>

          {/* Original Comments Tab Content (backup) */}
          <TabsContent value="comments-old" className="p-6">
            <div className="space-y-4 mb-6">
              {comments.map(comment => (
                <Card key={comment.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <img src={comment.author.avatar} alt={comment.author.name} />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{comment.author.name}</span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Add Comment */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
                rows={3}
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                <SendIcon className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </TabsContent>

          {/* Attachments Tab */}
          <TabsContent value="attachments" className="p-6">
            <div className="space-y-3">
              {attachments.map(attachment => (
                <Card key={attachment.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PaperclipIcon className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900">{attachment.name}</div>
                        <div className="text-xs text-gray-500">
                          {(attachment.size / 1024).toFixed(2)} KB • 
                          Uploaded by {attachment.uploadedBy} • 
                          {formatDistanceToNow(attachment.uploadedAt, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
              {attachments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No attachments yet
                </div>
              )}
            </div>
            <Button className="mt-4">
              <PaperclipIcon className="w-4 h-4 mr-2" />
              Upload File
            </Button>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="p-6">
            <div className="space-y-3">
              {activityLogs.map(log => (
                <div key={log.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">
                      <span className="font-semibold">{log.performedBy}</span> {log.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
