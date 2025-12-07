'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle, Activity, Users, RefreshCw } from 'lucide-react';
import { useAdminDashboard } from '@/contexts/AdminDashboardContext';
import { useTeamMembers } from '@/contexts/TeamMembersContext';

export function LiveSyncDashboard() {
  const { pendingTeamRequests, lastUpdate } = useAdminDashboard();
  const { count: teamCount } = useTeamMembers();
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    setIsConnected(true);
  }, []);

  // Trigger pulse animation when data updates
  useEffect(() => {
    if (lastUpdate) {
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
    }
  }, [lastUpdate, pendingTeamRequests, teamCount]);

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-purple-200 p-4 min-w-[320px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={pulseAnimation ? {
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              } : {}}
              transition={{ duration: 0.6 }}
            >
              <Zap className="w-5 h-5 text-purple-600" />
            </motion.div>
            <h3 className="font-bold text-gray-900">Live Sync</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-xs text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div
            animate={pendingTeamRequests > 0 ? {
              scale: [1, 1.05, 1],
            } : {}}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200"
          >
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">Pending</span>
            </div>
            <p className="text-2xl font-bold text-amber-900">{pendingTeamRequests}</p>
          </motion.div>

          <motion.div
            animate={pulseAnimation ? {
              scale: [1, 1.05, 1],
            } : {}}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200"
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Team</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{teamCount}</p>
          </motion.div>
        </div>

        {/* Sync Status */}
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-900">Last Sync</span>
            </div>
            <span className="text-xs text-purple-700 font-mono">
              {formatTime(lastUpdate)}
            </span>
          </div>
        </div>

        {/* Polling Indicator */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-600">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <RefreshCw className="w-3 h-3" />
          </motion.div>
          <span>Auto-polling (2min intervals)</span>
        </div>
      </motion.div>
    </div>
  );
}
