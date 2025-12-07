'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeamMembers } from '@/contexts/TeamMembersContext';
import { Users, TrendingUp, UserPlus, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function LiveTeamCounter() {
  const { count } = useTeamMembers();
  const [previousCount, setPreviousCount] = useState(0);
  const [showGrowth, setShowGrowth] = useState(false);

  useEffect(() => {
    if (previousCount > 0 && count > previousCount) {
      setShowGrowth(true);
      setTimeout(() => setShowGrowth(false), 3000);
    }
    
    if (count !== previousCount) {
      setPreviousCount(count);
    }
  }, [count, previousCount]);

  return (
    <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-shadow">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            'linear-gradient(45deg, #8b5cf6, #3b82f6)',
            'linear-gradient(45deg, #3b82f6, #10b981)',
            'linear-gradient(45deg, #10b981, #8b5cf6)',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            Team Size
          </h3>
          
          <AnimatePresence>
            {showGrowth && (
              <motion.div
                initial={{ opacity: 0, scale: 0, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: 20 }}
                className="flex items-center gap-1 text-green-600 text-xs font-bold"
              >
                <TrendingUp className="h-3 w-3" />
                +{count - previousCount}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-baseline gap-3">
          {/* Animated Counter */}
          <motion.div
            key={count}
            initial={{ scale: 1.5, color: '#10b981' }}
            animate={{ scale: 1, color: '#000000' }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-5xl font-bold"
          >
            {count}
          </motion.div>

          <span className="text-gray-500 text-lg">members</span>
        </div>

        {/* Growth indicator */}
        <AnimatePresence>
          {showGrowth && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 flex items-center gap-2 text-sm text-green-600 font-medium"
            >
              <UserPlus className="h-4 w-4" />
              <span>Team is growing!</span>
              <Sparkles className="h-4 w-4 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring effect when growing */}
        <AnimatePresence>
          {showGrowth && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 border-4 border-green-500 rounded-lg"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute inset-0 border-4 border-purple-500 rounded-lg"
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
