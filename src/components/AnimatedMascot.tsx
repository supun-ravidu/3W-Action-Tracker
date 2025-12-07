'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedMascotProps {
  completionRate: number;
}

export function AnimatedMascot({ completionRate }: AnimatedMascotProps) {
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');

  useEffect(() => {
    if (completionRate >= 70) {
      setMood('happy');
    } else if (completionRate >= 40) {
      setMood('neutral');
    } else {
      setMood('sad');
    }
  }, [completionRate]);

  const getMascotEmoji = () => {
    switch (mood) {
      case 'happy':
        return '🎉';
      case 'neutral':
        return '😊';
      case 'sad':
        return '💪';
    }
  };

  const getMessage = () => {
    switch (mood) {
      case 'happy':
        return 'Amazing work! Keep it up! 🚀';
      case 'neutral':
        return 'Great progress! You got this! 💪';
      case 'sad':
        return "Let's crush those tasks! 🔥";
    }
  };

  return (
    <motion.div
      className="fixed bottom-24 right-8 z-40"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 100 }}
    >
      <motion.div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 max-w-xs relative"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Speech bubble tail */}
        <div className="absolute -left-2 top-1/2 w-0 h-0 border-t-8 border-r-8 border-b-8 border-transparent border-r-white dark:border-r-slate-800" />

        <div className="flex items-center gap-3">
          <motion.div
            className="text-5xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {getMascotEmoji()}
          </motion.div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {getMessage()}
            </p>
            <div className="mt-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1, delay: 2 }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {completionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <motion.button
          onClick={() => {
            const element = document.querySelector('.fixed.bottom-24') as HTMLElement;
            if (element) {
              element.style.display = 'none';
            }
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ×
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
