'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export function AdminTeamConnectionIndicator() {
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-lg rounded-full shadow-lg border-2 border-purple-200 px-6 py-3 flex items-center gap-3"
      >
        {/* Admin Dashboard Indicator */}
        <div className="flex items-center gap-2">
          <motion.div
            key={`pulse-${pulseCount}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-3 h-3 rounded-full bg-purple-500"
          />
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>

        {/* Animated Connection Line */}
        <div className="relative w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          />
        </div>

        {/* Firebase Sync */}
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Firebase</span>
        </div>

        {/* Animated Connection Line */}
        <div className="relative w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.5,
            }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-green-500 to-transparent"
          />
        </div>

        {/* Team Page Indicator */}
        <div className="flex items-center gap-2">
          <motion.div
            key={`pulse-team-${pulseCount}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-3 h-3 rounded-full bg-green-500"
          />
          <span className="text-sm font-medium text-gray-700">Team</span>
        </div>

        {/* Status Icon */}
        <CheckCircle2 className="w-5 h-5 text-green-600 ml-2" />
      </motion.div>
    </div>
  );
}
