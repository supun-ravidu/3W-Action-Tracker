'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Sparkles, CheckCircle, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTeamMembers } from '@/contexts/TeamMembersContext';
import { TeamMember } from '@/types';
import confetti from 'canvas-confetti';

export function NewMemberApprovedNotification() {
  const { members } = useTeamMembers();
  const [newMember, setNewMember] = useState<TeamMember | null>(null);
  const [show, setShow] = useState(false);
  const [previousCount, setPreviousCount] = useState<number | null>(null);

  useEffect(() => {
    if (previousCount === null) {
      setPreviousCount(members.length);
      return;
    }

    // Check if a new member was added
    if (members.length > previousCount) {
      const latestMember = members[members.length - 1];
      setNewMember(latestMember);
      setShow(true);

      // Celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'],
      });

      // Auto-hide after 8 seconds
      setTimeout(() => {
        setShow(false);
      }, 8000);
    }

    setPreviousCount(members.length);
  }, [members, previousCount]);

  if (!newMember) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-24 right-6 z-50"
        >
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl border-none min-w-[350px] overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="w-full h-full"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
            </div>

            {/* Content */}
            <div className="relative p-6">
              <button
                onClick={() => setShow(false)}
                className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-4">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="flex-shrink-0"
                >
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <h3 className="font-bold text-lg">New Member Approved!</h3>
                  </div>

                  <p className="text-white/90 mb-3">
                    <span className="font-semibold">{newMember.name}</span> has been added to the team
                  </p>

                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-medium">{newMember.role}</span>
                    </div>
                    <p className="text-xs text-white/80">
                      {newMember.department}{newMember.timezone ? ` • ${newMember.timezone}` : ''}
                    </p>
                  </div>

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 8 }}
                    className="mt-4 h-1 bg-white/30 rounded-full"
                  >
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 8, ease: 'linear' }}
                      className="h-full bg-white rounded-full"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
