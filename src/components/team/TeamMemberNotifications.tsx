'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useTeamMembers } from '@/contexts/TeamMembersContext';
import { TeamMember } from '@/types';
import { UserPlus, Sparkles, CheckCircle2, Users } from 'lucide-react';

interface NewMemberNotification {
  id: string;
  member: TeamMember;
  timestamp: Date;
}

export function TeamMemberNotifications() {
  const { members: updatedMembers } = useTeamMembers();
  const [notifications, setNotifications] = useState<NewMemberNotification[]>([]);
  const [previousMembers, setPreviousMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    // Check for new members
    if (previousMembers.length > 0 && updatedMembers.length > previousMembers.length) {
      const newMembers = updatedMembers.filter(
        updated => !previousMembers.some(existing => existing.id === updated.id)
      );
      
      if (newMembers.length > 0) {
        // Trigger confetti
        triggerConfetti();
        
        // Add notifications
        const newNotifications = newMembers.map(member => ({
          id: Math.random().toString(36),
          member,
          timestamp: new Date(),
        }));
        
        setNotifications(prev => [...newNotifications, ...prev]);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          setNotifications(prev => 
            prev.filter(n => !newNotifications.some(nn => nn.id === n.id))
          );
        }, 5000);
      }
    }
    
    setPreviousMembers(updatedMembers);
  }, [previousMembers, updatedMembers]);

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="pointer-events-auto"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md border-2 border-green-300">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{ duration: 0.6 }}
                  className="flex-shrink-0"
                >
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      New Team Member!
                    </h4>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={notification.member.avatar}
                      alt={notification.member.name}
                      className="h-8 w-8 rounded-full border-2 border-white"
                    />
                    <div>
                      <p className="font-semibold">{notification.member.name}</p>
                      <p className="text-sm text-white/90">{notification.member.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Request approved & added to team</span>
                  </div>
                </div>
              </div>

              {/* Progress bar animation */}
              <motion.div
                className="h-1 bg-white/30 rounded-full mt-3 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
