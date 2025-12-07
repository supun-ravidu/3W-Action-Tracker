'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

interface RealtimeSyncIndicatorProps {
  isConnected?: boolean;
  lastSync?: Date;
  showOnlyWhenActive?: boolean;
}

export const RealtimeSyncIndicator: React.FC<RealtimeSyncIndicatorProps> = ({
  isConnected = true,
  lastSync,
  showOnlyWhenActive = true,
}) => {
  const [isVisible, setIsVisible] = useState(!showOnlyWhenActive);
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'error'>('synced');

  useEffect(() => {
    if (!showOnlyWhenActive) return;

    // Show indicator briefly when connection changes
    if (isConnected !== undefined) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, showOnlyWhenActive]);

  useEffect(() => {
    // Animate sync status
    if (lastSync) {
      setSyncStatus('syncing');
      const timer = setTimeout(() => setSyncStatus('synced'), 500);
      return () => clearTimeout(timer);
    }
  }, [lastSync]);

  const getStatusConfig = () => {
    if (!isConnected) {
      return {
        icon: WifiOff,
        color: 'from-red-500 to-rose-500',
        bgColor: 'bg-red-50',
        text: 'Offline',
        pulse: false,
      };
    }

    if (syncStatus === 'syncing') {
      return {
        icon: RefreshCw,
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50',
        text: 'Syncing...',
        pulse: true,
      };
    }

    return {
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      text: 'Live',
      pulse: true,
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="fixed top-20 right-4 z-50"
        >
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border-2 border-white/50 backdrop-blur-md ${config.bgColor}`}
          >
            {/* Pulse effect for live status */}
            {config.pulse && (
              <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.color} opacity-20`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}

            {/* Icon */}
            <motion.div
              animate={
                syncStatus === 'syncing'
                  ? { rotate: 360 }
                  : config.pulse
                  ? { scale: [1, 1.1, 1] }
                  : {}
              }
              transition={
                syncStatus === 'syncing'
                  ? { duration: 1, repeat: Infinity, ease: 'linear' }
                  : { duration: 2, repeat: Infinity }
              }
              className="relative z-10"
            >
              <div className={`p-1 rounded-full bg-gradient-to-r ${config.color}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </motion.div>

            {/* Text */}
            <span className="text-sm font-semibold text-gray-700 relative z-10">
              {config.text}
            </span>

            {/* Last sync time */}
            {lastSync && syncStatus === 'synced' && (
              <span className="text-xs text-gray-500 relative z-10">
                {new Date(lastSync).toLocaleTimeString()}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RealtimeSyncIndicator;
