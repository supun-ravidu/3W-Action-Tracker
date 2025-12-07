'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  ProjectRequest,
  approveProjectRequest,
  rejectProjectRequest,
  deleteProjectRequest,
} from '@/lib/projectRequestService';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  User as UserIcon,
  Calendar,
  DollarSign,
  FolderKanban,
  Tag,
  AlertCircle,
  Loader2,
  Sparkles,
  Inbox,
  RefreshCw,
} from 'lucide-react';
import { CreativeAdminNavbar } from '@/components/admin/CreativeAdminNavbar';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function ProjectApprovalsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === 'admin@gmail.com') {
        setUser(currentUser);
        setLoading(false);
      } else {
        router.push('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Load pending requests with polling
  useEffect(() => {
    if (!user) return;

    const loadRequests = async () => {
      try {
        const { getPendingProjectRequests } = await import('@/lib/projectRequestService');
        const result = await getPendingProjectRequests();
        if (result.success && result.data) {
          setRequests(result.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setLoading(false);
      }
    };

    loadRequests();
    // Poll every 15 minutes to reduce quota usage
    const interval = setInterval(loadRequests, 900000);

    return () => clearInterval(interval);
  }, [user]);

  const triggerConfetti = () => {
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    });
  };

  const handleApprove = async (request: ProjectRequest) => {
    if (!user || !request.id) return;

    setProcessingId(request.id);

    try {
      const adminUser = {
        id: user.uid,
        name: user.displayName || user.email || 'Admin',
        email: user.email || 'admin@example.com',
      };

      const result = await approveProjectRequest(request.id, adminUser);

      if (result.success) {
        triggerConfetti();
        
        // Remove from list after short delay
        setTimeout(() => {
          if (request.id) {
            deleteProjectRequest(request.id);
          }
        }, 2000);
      } else {
        alert(`Failed to approve: ${result.error}`);
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('Failed to approve project');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClick = (request: ProjectRequest) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
    setRejectionReason('');
  };

  const handleRejectConfirm = async () => {
    if (!user || !selectedRequest?.id || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setRejectingId(selectedRequest.id);

    try {
      const adminUser = {
        id: user.uid,
        name: user.displayName || user.email || 'Admin',
        email: user.email || 'admin@example.com',
      };

      const result = await rejectProjectRequest(
        selectedRequest.id,
        adminUser,
        rejectionReason
      );

      if (result.success) {
        // Remove from list after short delay
        setTimeout(() => {
          if (selectedRequest.id) {
            deleteProjectRequest(selectedRequest.id);
          }
        }, 2000);
        
        setShowRejectDialog(false);
        setSelectedRequest(null);
        setRejectionReason('');
      } else {
        alert(`Failed to reject: ${result.error}`);
      }
    } catch (error) {
      console.error('Rejection error:', error);
      alert('Failed to reject project');
    } finally {
      setRejectingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Creative Admin Navbar */}
      <CreativeAdminNavbar user={user!} />
      
      {/* Page Header */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                <FolderKanban className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Project Approvals
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {requests.length} pending {requests.length === 1 ? 'request' : 'requests'} awaiting review
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="gap-2 hover:border-purple-300 hover:bg-purple-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {requests.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Inbox className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-500 text-center">
                No pending project approval requests at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {requests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                    <CardHeader
                      className="pb-4"
                      style={{ 
                        background: `linear-gradient(135deg, ${request.color}20, ${request.color}10)`
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${request.color}30` }}
                          >
                            {request.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-xl mb-1 truncate">
                              {request.name}
                            </CardTitle>
                            <Badge variant="outline" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {format(request.requestedAt, 'MMM dd, yyyy')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4">
                      {/* Description */}
                      <div>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {request.description}
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 py-3 border-t border-b">
                        <div className="flex items-center gap-2 text-sm">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 truncate">
                            {request.requestedBy.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FolderKanban className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 truncate">
                            {request.workspace}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {format(request.startDate, 'MMM dd')} - {format(request.targetEndDate, 'MMM dd')}
                          </span>
                        </div>
                        {request.budget && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {request.budget.currency} {request.budget.allocated.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {request.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {request.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {request.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{request.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => handleApprove(request)}
                          disabled={processingId === request.id}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 gap-2"
                        >
                          {processingId === request.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleRejectClick(request)}
                          disabled={rejectingId === request.id}
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 gap-2"
                        >
                          {rejectingId === request.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Rejecting...
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Reject Dialog */}
      <AnimatePresence>
        {showRejectDialog && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRejectDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Reject Project</h2>
                  <p className="text-sm text-gray-500">{selectedRequest.name}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a clear reason for rejection..."
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowRejectDialog(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRejectConfirm}
                    disabled={!rejectionReason.trim() || rejectingId === selectedRequest.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 gap-2"
                  >
                    {rejectingId === selectedRequest.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        Confirm Rejection
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
