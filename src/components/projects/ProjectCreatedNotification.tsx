'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Rocket, Sparkles, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProjectCreatedNotificationProps {
  projectName: string;
  icon: string;
  color: string;
  show: boolean;
  onClose: () => void;
}

export function ProjectCreatedNotification({ 
  projectName, 
  icon, 
  color, 
  show, 
  onClose 
}: ProjectCreatedNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="fixed top-24 right-6 z-50"
        >
          <Card 
            className="shadow-2xl border-none overflow-hidden min-w-[350px]"
            style={{ backgroundColor: color }}
          >
            {/* Animated Background Pattern */}
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
                  backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                  backgroundSize: '30px 30px',
                }}
              />
            </div>

            {/* Content */}
            <div className="relative p-6">
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-4">
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.2, 1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="text-5xl"
                >
                  {icon}
                </motion.div>

                <div className="flex-1 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </motion.div>
                    <h3 className="font-bold text-lg">Project Created!</h3>
                  </div>

                  <p className="text-white/90 mb-3 font-medium">
                    {projectName}
                  </p>

                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Rocket className="w-4 h-4" />
                    </motion.div>
                    <span>Ready to launch!</span>
                    <Sparkles className="w-4 h-4 ml-auto" />
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-white/30"
              />
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
