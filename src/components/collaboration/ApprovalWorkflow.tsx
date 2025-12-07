'use client';

import { useState } from 'react';
import { useActionPlansStore } from '@/store/actionPlansStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { CheckCircle2, XCircle, Clock, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ApprovalWorkflow } from '@/types';

interface ApprovalWorkflowProps {
  actionPlanId: string;
}

export function ApprovalWorkflowComponent({ actionPlanId }: ApprovalWorkflowProps) {
  const { actionPlans, teamMembers, requestApproval, respondToApproval } = useActionPlansStore();
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [responseComments, setResponseComments] = useState('');

  const actionPlan = actionPlans.find(p => p.id === actionPlanId);
  const workflow = actionPlan?.approvalWorkflow;

  const currentUser = {
    id: 'current-user',
    name: 'Current User',
    email: 'user@example.com',
  };

  const handleRequestApproval = () => {
    if (selectedApprovers.length === 0) return;

    const approvers = teamMembers.filter((m: any) => selectedApprovers.includes(m.id));
    
    requestApproval(actionPlanId, {
      actionPlanId,
      requestedBy: currentUser,
      approvers,
      comments,
    });

    setSelectedApprovers([]);
    setComments('');
  };

  const handleApprove = () => {
    respondToApproval(actionPlanId, 'approved', currentUser, responseComments);
    setResponseComments('');
  };

  const handleReject = () => {
    respondToApproval(actionPlanId, 'rejected', currentUser, responseComments);
    setResponseComments('');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: Clock,
      approved: CheckCircle2,
      rejected: XCircle,
    };
    return icons[status] || Clock;
  };

  if (!workflow) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <h3 className="font-semibold text-lg">Approval Workflow</h3>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Approvers</label>
              <div className="space-y-2">
                {teamMembers.map(member => (
                  <label key={member.id} className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedApprovers.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedApprovers([...selectedApprovers, member.id]);
                        } else {
                          setSelectedApprovers(selectedApprovers.filter(id => id !== member.id));
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Comments (Optional)</label>
              <Textarea
                placeholder="Add any context for the approval request..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <Button
              onClick={handleRequestApproval}
              disabled={selectedApprovers.length === 0}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Request Approval
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(workflow.status);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5" />
        <h3 className="font-semibold text-lg">Approval Workflow</h3>
        <Badge
          className={`${getStatusColor(workflow.status)} text-white`}
        >
          <StatusIcon className="h-3 w-3 mr-1" />
          {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
        </Badge>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3 pb-4 border-b">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {workflow.requestedBy.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <p className="font-medium">{workflow.requestedBy.name}</p>
              <p className="text-sm text-muted-foreground">
                Requested approval {formatDistanceToNow(new Date(workflow.requestedAt), { addSuffix: true })}
              </p>
              {workflow.comments && (
                <p className="text-sm mt-2 p-2 bg-accent rounded">{workflow.comments}</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Approvers</h4>
            <div className="space-y-2">
              {workflow.approvers.map(approver => (
                <div key={approver.id} className="flex items-center gap-2 p-2 rounded bg-accent/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {approver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{approver.name}</p>
                    <p className="text-xs text-muted-foreground">{approver.role}</p>
                  </div>
                  {workflow.status === 'pending' && (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {workflow.status === 'pending' && (
            <div className="space-y-3 pt-4 border-t">
              <Textarea
                placeholder="Add comments about your decision..."
                value={responseComments}
                onChange={(e) => setResponseComments(e.target.value)}
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button onClick={handleReject} variant="destructive" className="flex-1">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}

          {workflow.status !== 'pending' && workflow.resolvedAt && workflow.resolvedBy && (
            <div className="pt-4 border-t">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {workflow.resolvedBy.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {workflow.resolvedBy.name} {workflow.status === 'approved' ? 'approved' : 'rejected'} this request
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(workflow.resolvedAt), { addSuffix: true })}
                  </p>
                  {workflow.comments && (
                    <p className="text-sm mt-2 p-2 bg-accent rounded">{workflow.comments}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
