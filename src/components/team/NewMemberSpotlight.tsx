'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeamMembers } from '@/contexts/TeamMembersContext';
import { TeamMember } from '@/types';
import { Sparkles, Star, Award, TrendingUp, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SpotlightMember {
  member: TeamMember;
  timestamp: Date;
}

export function NewMemberSpotlight() {
  const { members: updatedMembers } = useTeamMembers();
  const [spotlightMember, setSpotlightMember] = useState<SpotlightMember | null>(null);
  const [previousMembers, setPreviousMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    // Check for new members
    if (previousMembers.length > 0 && updatedMembers.length > previousMembers.length) {
      const newMembers = updatedMembers.filter(
        updated => !previousMembers.some(existing => existing.id === updated.id)
      );
      
      if (newMembers.length > 0) {
        // Show spotlight for the first new member
        setSpotlightMember({
          member: newMembers[0],
          timestamp: new Date(),
        });
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
          setSpotlightMember(null);
        }, 8000);
      }
    }
    
    setPreviousMembers(updatedMembers);
  }, [updatedMembers, previousMembers]);

  return (
    <AnimatePresence>
      {spotlightMember && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSpotlightMember(null)}
        >
          <motion.div
            initial={{ scale: 0.5, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0.5, rotateY: 180 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full"
          >
            <Card className="relative overflow-hidden border-4 border-gradient-to-r from-purple-500 via-pink-500 to-blue-500">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 animate-pulse" />
              
              {/* Floating particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-yellow-400"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}

              <div className="relative p-8 text-center">
                {/* Header */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center gap-2 mb-4"
                >
                  <Sparkles className="h-8 w-8 text-yellow-500" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Welcome to the Team!
                  </h2>
                  <Sparkles className="h-8 w-8 text-yellow-500" />
                </motion.div>

                {/* Member Avatar */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50" />
                    
                    <img
                      src={spotlightMember.member.avatar}
                      alt={spotlightMember.member.name}
                      className="relative h-40 w-40 rounded-full border-8 border-white shadow-2xl"
                    />
                    
                    {/* Crown icon */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2"
                    >
                      <Award className="h-10 w-10 text-yellow-500" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Member Details */}
                <div className="space-y-3 mb-6">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold text-gray-900"
                  >
                    {spotlightMember.member.name}
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-600 flex items-center justify-center gap-2"
                  >
                    <Star className="h-5 w-5 text-purple-500" />
                    {spotlightMember.member.role}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-gray-500"
                  >
                    {spotlightMember.member.department}
                  </motion.p>
                </div>

                {/* Skills Badges */}
                {spotlightMember.member.skills && spotlightMember.member.skills.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-2 mb-6"
                  >
                    {spotlightMember.member.skills.slice(0, 5).map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <Badge
                          variant="secondary"
                          className="px-3 py-1 text-sm font-medium"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Welcome Message */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border-2 border-purple-300"
                >
                  <p className="text-gray-700 font-medium flex items-center justify-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Ready to make an impact and collaborate with the team!
                  </p>
                </motion.div>

                {/* Close hint */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-sm text-gray-400 mt-4"
                >
                  Click anywhere to continue
                </motion.p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
