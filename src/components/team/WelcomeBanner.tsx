'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Users, Trophy, Zap } from 'lucide-react';

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the banner before
    const hasSeenBanner = localStorage.getItem('team-welcome-seen');
    if (!hasSeenBanner) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('team-welcome-seen', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="mb-6"
        >
          <Card className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1">
            <div className="bg-background rounded-lg p-6">
              {/* Close Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="absolute top-2 right-2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                    className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl"
                  >
                    <Sparkles className="h-8 w-8 text-white" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome to Your New Team Management System! 🎉
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Now powered by Firebase with real-time synchronization, achievements, and advanced features!
                  </p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span>
                        <strong>Real-time sync</strong> - Changes appear instantly
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Trophy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span>
                        <strong>Achievements</strong> - Gamification system
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                        <Zap className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                      </div>
                      <span>
                        <strong>Performance</strong> - Track metrics & stats
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex-shrink-0">
                  <Button
                    onClick={handleDismiss}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Get Started
                  </Button>
                </div>
              </div>

              {/* Animated Background Dots */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
