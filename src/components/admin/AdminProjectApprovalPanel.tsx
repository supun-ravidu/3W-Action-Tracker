'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  ProjectRequest,
  subscribeToPendingProjectRequests,
  approveProjectRequest,
  rejectProjectRequest,
  deleteProjectRequest,
} from '@/lib/projectRequestService';
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  DollarSign,
  Sparkles,
  Rocket,
  FolderKanban,
  Tag,
  AlertCircle,
  Loader2,
  PartyPopper,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { useToast, ToastContainer } from '@/components/ui/toast-notification';
import { AdminStatusIndicator } from './AdminStatusIndicator';

export function AdminProjectApprovalPanel() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toasts, addToast } = useToast();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    console.log('🔄 AdminProjectApprovalPanel mounted, loading requests...', { 
      authLoading, 
      hasUser: !!user, 
      userEmail: user?.email, 
      isAdmin 
    });
    
    // Load pending project requests with polling
    const loadRequests = async () => {
      try {
        const { getPendingProjectRequests } = await import('@/lib/projectRequestService');
        const result = await getPendingProjectRequests();
        if (result.success && result.data) {
          console.log('✅ Loaded', result.data.length, 'pending project requests');
          setRequests(result.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('❌ Error loading requests:', error);
        setLoading(false);
      }
    };

    loadRequests();
    // Poll every 2 minutes
    const interval = setInterval(loadRequests, 120000);

    return () => {
      console.log('🔴 AdminProjectApprovalPanel unmounting, cleaning up...');
      clearInterval(interval);
    };
  }, []); // Empty dependency array - load once on mount

  const triggerConfetti = (projectName: string) => {
    // Epic multi-stage confetti celebration for project approval
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

    // Stage 1: Massive center explosion
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 },
      colors: colors,
      scalar: 1.5,
      gravity: 0.8,
    });

    // Stage 2: Side rockets
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: colors,
        startVelocity: 45,
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: colors,
        startVelocity: 45,
      });
    }, 300);

    // Stage 3: Fireworks from top
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 180,
        origin: { y: 0 },
        colors: colors,
        ticks: 400,
        gravity: 0.6,
      });
    }, 600);

    // Stage 4: Continuous rain
    const duration = 2000;
    const end = Date.now() + duration;
    
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Success message
    setSuccessMessage(`🎉 ${projectName} approved! Project dashboard updating... ✨`);
    setTimeout(() => setSuccessMessage(''), 6000);
  };

  const handleApprove = async (request: ProjectRequest) => {
    // Validation checks with creative error messages
    if (!user) {
      addToast({
        type: 'error',
        title: '🚫 Authentication Required',
        message: 'Please login as admin to approve projects',
        duration: 5000,
      });
      console.error('❌ No user authenticated');
      return;
    }

    if (!request.id) {
      addToast({
        type: 'error',
        title: '⚠️ Invalid Request',
        message: 'Project request ID is missing',
        duration: 4000,
      });
      console.error('❌ Missing request ID');
      return;
    }

    // Check admin permissions
    if (!isAdmin) {
      addToast({
        type: 'error',
        title: '🔒 Permission Denied',
        message: 'Only administrators can approve projects',
        duration: 5000,
      });
      console.error('❌ User is not admin:', user.email);
      return;
    }

    console.log('🚀 Starting approval process for:', request.name);
    setProcessingId(request.id);
    setErrorDetails('');

    try {
      const adminUser = {
        id: user.uid,
        name: user.displayName || user.email || 'Admin',
        email: user.email || 'admin@example.com',
      };

      console.log('📤 Sending approval request with admin:', adminUser);
      const result = await approveProjectRequest(request.id, adminUser);

      if (result.success) {
        // Success celebration!
        triggerConfetti(request.name);
        
        addToast({
          type: 'celebration',
          title: '🎉 Project Approved!',
          message: `${request.name} is now live in the projects dashboard`,
          duration: 8000,
        });
        
        setSuccessMessage(`✨ ${request.name} approved successfully! Check the Projects page.`);
        console.log('✅ Project approved:', request.name, 'ID:', result.projectId);
        
        // Animate out and delete
        setTimeout(() => {
          if (request.id) {
            deleteProjectRequest(request.id);
            console.log('🗑️ Request cleaned up');
          }
        }, 3000);
        
        setTimeout(() => setSuccessMessage(''), 8000);
      } else {
        // Handle failure with detailed error
        const errorMsg = result.error || 'Unknown error occurred';
        setErrorDetails(errorMsg);
        
        addToast({
          type: 'error',
          title: '❌ Approval Failed',
          message: errorMsg,
          duration: 6000,
        });
        
        setSuccessMessage(`❌ Failed to approve: ${errorMsg}`);
        console.error('❌ Approval failed:', errorMsg);
        setTimeout(() => setSuccessMessage(''), 6000);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unexpected error';
      setErrorDetails(errorMsg);
      
      addToast({
        type: 'error',
        title: '💥 System Error',
        message: `Failed to process approval: ${errorMsg}`,
        duration: 7000,
      });
      
      console.error('💥 Exception during approval:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (request: ProjectRequest) => {
    // Validation checks
    if (!user) {
      addToast({
        type: 'error',
        title: '🚫 Authentication Required',
        message: 'Please login as admin to reject projects',
        duration: 5000,
      });
      console.error('❌ No user authenticated');
      return;
    }

    if (!request.id) {
      addToast({
        type: 'error',
        title: '⚠️ Invalid Request',
        message: 'Project request ID is missing',
        duration: 4000,
      });
      console.error('❌ Missing request ID');
      return;
    }

    if (!isAdmin) {
      addToast({
        type: 'error',
        title: '🔒 Permission Denied',
        message: 'Only administrators can reject projects',
        duration: 5000,
      });
      console.error('❌ User is not admin:', user.email);
      return;
    }

    const reason = rejectionReason.trim() || 'Does not meet project criteria';
    console.log('🚫 Starting rejection process for:', request.name, 'Reason:', reason);
    setProcessingId(request.id);
    setErrorDetails('');

    try {
      const adminUser = {
        id: user.uid,
        name: user.displayName || user.email || 'Admin',
        email: user.email || 'admin@example.com',
      };

      console.log('📤 Sending rejection with admin:', adminUser);
      const result = await rejectProjectRequest(request.id, adminUser, reason);

      if (result.success) {
        addToast({
          type: 'warning',
          title: '✋ Project Rejected',
          message: `${request.name} has been declined with feedback sent to requester`,
          duration: 6000,
        });
        
        setSuccessMessage(`✋ ${request.name} rejected successfully. Notification sent.`);
        console.log('✅ Project rejected:', request.name);
        
        // Clean up UI
        setTimeout(() => {
          if (request.id) {
            deleteProjectRequest(request.id);
            console.log('🗑️ Rejected request cleaned up');
          }
        }, 2000);
        
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        const errorMsg = result.error || 'Unknown error occurred';
        setErrorDetails(errorMsg);
        
        addToast({
          type: 'error',
          title: '❌ Rejection Failed',
          message: errorMsg,
          duration: 6000,
        });
        
        setSuccessMessage(`❌ Failed to reject: ${errorMsg}`);
        console.error('❌ Rejection failed:', errorMsg);
        setTimeout(() => setSuccessMessage(''), 6000);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unexpected error';
      setErrorDetails(errorMsg);
      
      addToast({
        type: 'error',
        title: '💥 System Error',
        message: `Failed to process rejection: ${errorMsg}`,
        duration: 7000,
      });
      
      console.error('💥 Exception during rejection:', error);
    } finally {
      setProcessingId(null);
      setRejectingId(null);
      setRejectionReason('');
    }
  };

  // Show loading while fetching data
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-6 w-6 text-purple-500" />
            </motion.div>
            <p className="text-gray-600">Loading requests...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />
      
      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && errorDetails && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-1">Debug Information</h4>
                <p className="text-sm text-red-700 font-mono break-all">{errorDetails}</p>
                <p className="text-xs text-red-600 mt-2">User: {user?.email || 'Not logged in'}</p>
                <p className="text-xs text-red-600">Admin: {isAdmin ? 'Yes' : 'No'}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setErrorDetails('')}
                  className="mt-2"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message Banner */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <Card className="border-2 border-green-500/50 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.2, 1, 1.2, 1],
                    }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Rocket className="h-6 w-6 text-green-600" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      {successMessage}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Check the Projects page for real-time updates! 🚀
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Status Indicator */}
      <AdminStatusIndicator
        isAdmin={isAdmin}
        isAuthenticated={!!user}
        userEmail={user?.email}
      />

      {/* Header Stats */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <FolderKanban className="h-6 w-6" />
                Project Approval Requests
              </CardTitle>
              <CardDescription>Review and approve new project submissions</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-purple-100 text-purple-700 border-purple-300">
                  <Clock className="h-4 w-4 mr-2" />
                  {requests.length} Pending
                </Badge>
              </motion.div>
            </div>
          </div>
          
          {/* Quick Stats */}
          {requests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  ${requests.reduce((sum, r) => sum + (r.budget?.allocated || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">Total Budget</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(requests.reduce((sum, r) => {
                    const days = (r.targetEndDate.getTime() - r.startDate.getTime()) / (1000 * 60 * 60 * 24);
                    return sum + days;
                  }, 0) / requests.length)} days
                </p>
                <p className="text-xs text-gray-600">Avg Duration</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600">
                  {new Set(requests.flatMap(r => r.tags)).size}
                </p>
                <p className="text-xs text-gray-600">Unique Tags</p>
              </div>
            </motion.div>
          )}
        </CardHeader>
      </Card>

      {/* Requests List */}
      <AnimatePresence mode="popLayout">
        {requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex justify-center mb-4"
                  >
                    <CheckCircle2 className="h-16 w-16 text-green-500 opacity-50" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    All caught up! 🎉
                  </h3>
                  <p className="text-gray-500">
                    No pending project requests at the moment
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <Card className="overflow-hidden border-2 hover:shadow-2xl transition-all h-full relative group">
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${request.color}33 0%, ${request.color}11 100%)`,
                    }}
                  />
                  
                  {/* Project Color Header with shimmer */}
                  <motion.div
                    className="h-3 relative overflow-hidden"
                    style={{ backgroundColor: request.color }}
                    whileHover={{ height: '16px' }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                  </motion.div>

                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {/* Project Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="text-5xl"
                      >
                        {request.icon}
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {request.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{request.description}</p>
                        
                        {/* Tags */}
                        {request.tags && request.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {request.tags.map((tag, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-500">Requested by</p>
                              <p className="font-medium">{request.requestedBy.name}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4 text-green-500" />
                            <div>
                              <p className="text-xs text-gray-500">Start Date</p>
                              <p className="font-medium">
                                {format(request.startDate, 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <div>
                              <p className="text-xs text-gray-500">Target End</p>
                              <p className="font-medium">
                                {format(request.targetEndDate, 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>

                          {request.budget && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <div>
                                <p className="text-xs text-gray-500">Budget</p>
                                <p className="font-medium">
                                  ${request.budget.allocated.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>

                  {/* Action Buttons or Rejection Form */}
                  <AnimatePresence mode="wait">
                    {rejectingId === request.id ? (
                      <motion.div
                        key="reject-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-red-50 rounded-lg border-2 border-red-200"
                      >
                        <div className="flex items-start gap-2 mb-3">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-red-900">Rejection Reason</h4>
                            <p className="text-sm text-red-700">
                              Provide feedback for the requester
                            </p>
                          </div>
                        </div>
                        <Textarea
                          placeholder="e.g., Insufficient budget details, unclear objectives..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="mb-3 border-red-300 focus:border-red-500"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleReject(request)}
                            disabled={processingId === request.id}
                            variant="destructive"
                            className="flex-1"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Confirm Rejection
                          </Button>
                          <Button
                            onClick={() => {
                              setRejectingId(null);
                              setRejectionReason('');
                            }}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="action-buttons"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-3 mt-4"
                      >
                        <Button
                          onClick={() => handleApprove(request)}
                          disabled={processingId === request.id || !user || !isAdmin}
                          className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-blue-600 hover:from-green-600 hover:via-emerald-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === request.id ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="mr-2"
                              >
                                <Loader2 className="h-4 w-4" />
                              </motion.div>
                              <span className="flex items-center gap-1">
                                <span>Approving</span>
                                <motion.span
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >...</motion.span>
                              </span>
                            </>
                          ) : !user ? (
                            <>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Login Required
                            </>
                          ) : !isAdmin ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Admin Only
                            </>
                          ) : (
                            <>
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                                className="mr-2"
                              >
                                <PartyPopper className="h-4 w-4" />
                              </motion.div>
                              Approve Project
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => setRejectingId(request.id || null)}
                          disabled={processingId === request.id || !user || !isAdmin}
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                            className="mr-2"
                          >
                            <XCircle className="h-4 w-4" />
                          </motion.div>
                          {!user || !isAdmin ? 'Access Denied' : 'Reject'}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
