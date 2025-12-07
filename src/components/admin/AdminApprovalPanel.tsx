'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Mail,
  Briefcase,
  MapPin,
  Award,
  Zap,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  approveTeamMemberRequest,
  rejectTeamMemberRequest,
  deleteRequest,
  TeamMemberRequest,
  getPendingRequests,
} from '@/lib/teamRequestService';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminDashboard } from '@/contexts/AdminDashboardContext';
import confetti from 'canvas-confetti';
import { ApprovalFlowVisualizer } from './ApprovalFlowVisualizer';

export function AdminApprovalPanel() {
  const { user, isAdmin } = useAuth();
  const { refetch: refetchAdminStats } = useAdminDashboard();
  const [requests, setRequests] = useState<TeamMemberRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<TeamMemberRequest | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showFlowVisualizer, setShowFlowVisualizer] = useState(false);
  const [approvingMemberName, setApprovingMemberName] = useState('');

  useEffect(() => {
    // Load pending requests on mount and poll every 30 seconds
    const loadRequests = async () => {
      const result = await getPendingRequests();
      if (result.success && result.data) {
        setRequests(result.data);
      }
    };

    loadRequests();
    // Poll every 3 minutes to reduce quota usage
    const interval = setInterval(loadRequests, 180000);

    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (request: TeamMemberRequest) => {
    setProcessing(request.id);
    setApprovingMemberName(request.memberData.name);
    setShowFlowVisualizer(true);
    
    try {
      console.log('🚀 Approving request:', request.id);
      const memberId = await approveTeamMemberRequest(request.id, user?.email || 'admin@gmail.com');
      console.log('✅ Member added with ID:', memberId);
      
      // Multi-stage confetti celebration!
      const celebrateInStages = () => {
        // Stage 1: Initial burst
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3B82F6', '#8B5CF6', '#EC4899'],
          scalar: 1.2,
        });
        
        // Stage 2: Side cannons (left)
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: ['#10B981', '#3B82F6'],
          });
        }, 200);
        
        // Stage 3: Side cannons (right)
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: ['#F59E0B', '#EC4899'],
          });
        }, 400);
        
        // Stage 4: Top shower
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 180,
            origin: { y: 0.1 },
            colors: ['#8B5CF6', '#06B6D4', '#F59E0B'],
            ticks: 300,
          });
        }, 600);
      };
      
      celebrateInStages();
      
      // Success message with team page update hint
      setSuccessMessage(`🎉 ${request.memberData.name} approved! Check Team page for updates! ✨`);
      
      setTimeout(() => {
        setSuccessMessage('');
        setShowFlowVisualizer(false);
      }, 5000);

      // Auto-delete after 3.5 seconds (after flow visualization completes)
      setTimeout(async () => {
        try {
          await deleteRequest(request.id);
          console.log('🗑️ Request cleaned up');
        } catch (err) {
          console.error('Error deleting request:', err);
        }
      }, 3500);
    } catch (error) {
      console.error('❌ Error approving request:', error);
      setSuccessMessage(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowFlowVisualizer(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    setProcessing(selectedRequest.id);
    const requestIdToDelete = selectedRequest.id;
    const requestName = selectedRequest.memberData.name;
    
    try {
      console.log('🚫 Rejecting request:', selectedRequest.id);
      await rejectTeamMemberRequest(
        selectedRequest.id,
        user?.email || 'admin@gmail.com',
        rejectionReason
      );
      
      setIsRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedRequest(null);
      
      setSuccessMessage(`✋ ${requestName} rejected. Notification sent.`);
      setTimeout(() => setSuccessMessage(''), 4000);

      // Auto-delete after 2 seconds
      setTimeout(async () => {
        try {
          await deleteRequest(requestIdToDelete);
          console.log('🗑️ Rejected request cleaned up');
        } catch (err) {
          console.error('Error deleting request:', err);
        }
      }, 2000);
    } catch (error) {
      console.error('❌ Error rejecting request:', error);
      setSuccessMessage(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (requestId: string) => {
    if (confirm('Are you sure you want to delete this request?')) {
      try {
        await deleteRequest(requestId);
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  const openRejectDialog = (request: TeamMemberRequest) => {
    setSelectedRequest(request);
    setIsRejectDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Approval Flow Visualizer */}
      <ApprovalFlowVisualizer
        isActive={showFlowVisualizer}
        memberName={approvingMemberName}
        onComplete={() => {
          console.log('✅ Flow visualization complete');
        }}
      />
      
      {/* Success Message Banner */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <Card className="border-2 border-green-500/50 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.2, 1, 1.2, 1],
                    }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Zap className="h-6 w-6 text-green-600" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      {successMessage}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Check the Team page for real-time updates! 🚀
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Team Member Requests
          </h2>
          <p className="text-muted-foreground mt-1">
            Review and approve pending team member applications
          </p>
        </div>
        <Badge
          variant={requests.length > 0 ? 'default' : 'secondary'}
          className="text-lg px-4 py-2"
        >
          <Clock className="h-4 w-4 mr-2" />
          {requests.length} Pending
        </Badge>
      </div>

      {/* Empty State */}
      {requests.length === 0 && (
        <Card className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">All Caught Up! 🎉</h3>
          <p className="text-muted-foreground">
            No pending team member requests at the moment.
          </p>
        </Card>
      )}

      {/* Requests Grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all">
                {/* Priority Badge */}
                {request.priority === 'urgent' && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge variant="destructive" className="gap-1 animate-pulse">
                      <AlertTriangle className="h-3 w-3" />
                      Urgent
                    </Badge>
                  </div>
                )}

                {/* Processing Overlay */}
                {processing === request.id && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2 animate-spin">
                        <Zap className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium">Processing...</p>
                    </div>
                  </div>
                )}

                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-14 w-14 border-2 border-background shadow-lg">
                      {request.memberData.avatar ? (
                        <img
                          src={request.memberData.avatar}
                          alt={request.memberData.name}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                          {request.memberData.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                      )}
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {request.memberData.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {request.memberData.role || 'Team Member'}
                      </p>
                      {request.memberData.department && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {request.memberData.department}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{request.memberData.email}</span>
                    </div>

                    {request.memberData.timezone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{request.memberData.timezone}</span>
                      </div>
                    )}

                    {request.memberData.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2 pt-2">
                        {request.memberData.bio}
                      </p>
                    )}
                  </div>

                  {/* Skills */}
                  {request.memberData.skills && request.memberData.skills.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 font-medium">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {request.memberData.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {request.memberData.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{request.memberData.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Request Info */}
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">
                          {request.requestedBy}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleApprove(request)}
                      disabled={processing === request.id}
                      className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => openRejectDialog(request)}
                      disabled={processing === request.id}
                      variant="destructive"
                      className="flex-1 gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleDelete(request.id)}
                      disabled={processing === request.id}
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (optional)..."
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleReject}
                disabled={processing !== null}
                variant="destructive"
                className="flex-1"
              >
                Confirm Rejection
              </Button>
              <Button
                onClick={() => {
                  setIsRejectDialogOpen(false);
                  setRejectionReason('');
                  setSelectedRequest(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
