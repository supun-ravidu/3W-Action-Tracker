'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Users, Sparkles, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ApprovalFlowVisualizerProps {
  isActive: boolean;
  memberName: string;
  onComplete?: () => void;
}

export function ApprovalFlowVisualizer({ 
  isActive, 
  memberName,
  onComplete 
}: ApprovalFlowVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: CheckCircle, label: 'Admin Approval', color: 'from-purple-500 to-pink-500' },
    { icon: Zap, label: 'Firebase Sync', color: 'from-blue-500 to-cyan-500' },
    { icon: Sparkles, label: 'Processing Data', color: 'from-green-500 to-emerald-500' },
    { icon: Users, label: 'Team Page Update', color: 'from-amber-500 to-orange-500' },
  ];

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      return;
    }

    const intervals = [0, 800, 1600, 2400];
    const timers = intervals.map((delay, index) => 
      setTimeout(() => setCurrentStep(index + 1), delay)
    );

    const completionTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3500);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      clearTimeout(completionTimer);
    };
  }, [isActive, onComplete]);

  if (!isActive && currentStep === 0) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border-2 border-purple-200 p-6 min-w-[600px]">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  🎉 Approving {memberName}
                </h3>
                <p className="text-sm text-gray-600">
                  Watch the magic happen in real-time!
                </p>
              </div>
              
              <div className="flex items-center justify-between gap-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isComplete = currentStep > index;
                  const isActive = currentStep === index + 1;
                  
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{
                          scale: isActive ? 1.1 : isComplete ? 1 : 0.8,
                          opacity: isActive || isComplete ? 1 : 0.5,
                        }}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center relative ${
                            isComplete || isActive
                              ? `bg-gradient-to-r ${step.color}`
                              : 'bg-gray-200'
                          }`}
                        >
                          <Icon
                            className={`w-8 h-8 ${
                              isComplete || isActive ? 'text-white' : 'text-gray-400'
                            }`}
                          />
                          
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                              }}
                            >
                              <div className={`w-full h-full rounded-full bg-gradient-to-r ${step.color} opacity-30`} />
                            </motion.div>
                          )}
                          
                          {isComplete && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              <CheckCircle className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                        
                        <p className={`text-xs mt-2 font-medium ${
                          isComplete || isActive ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </p>
                      </motion.div>
                      
                      {index < steps.length - 1 && (
                        <ArrowRight 
                          className={`w-6 h-6 ${
                            isComplete ? 'text-green-500' : 'text-gray-300'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full"
              />
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
