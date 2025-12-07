'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Shield, User } from 'lucide-react';

interface AdminStatusIndicatorProps {
  isAdmin: boolean;
  isAuthenticated: boolean;
  userEmail?: string | null;
}

export const AdminStatusIndicator: React.FC<AdminStatusIndicatorProps> = ({
  isAdmin,
  isAuthenticated,
  userEmail,
}) => {
  const getStatusConfig = () => {
    if (!isAuthenticated) {
      return {
        icon: AlertCircle,
        color: 'from-red-500 to-rose-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        text: 'Not Authenticated',
        subtext: 'Please login to approve/reject projects',
        status: 'error',
      };
    }

    if (!isAdmin) {
      return {
        icon: XCircle,
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
        text: 'Not Authorized',
        subtext: 'Admin permissions required',
        status: 'warning',
      };
    }

    return {
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      text: 'Admin Authorized',
      subtext: 'You can approve and reject projects',
      status: 'success',
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 p-4 rounded-xl border-2 ${config.borderColor} ${config.bgColor} shadow-sm`}
    >
      {/* Icon with pulse */}
      <motion.div
        animate={
          config.status === 'success'
            ? { scale: [1, 1.1, 1] }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
        className={`p-2 rounded-full bg-gradient-to-br ${config.color}`}
      >
        <Icon className="h-5 w-5 text-white" />
      </motion.div>

      {/* Status Text */}
      <div className="flex-1">
        <h4 className="font-bold text-gray-900">{config.text}</h4>
        <p className="text-sm text-gray-600">{config.subtext}</p>
        {userEmail && (
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <User className="h-3 w-3" />
            {userEmail}
          </p>
        )}
      </div>

      {/* Shield Badge */}
      {isAdmin && (
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Shield className="h-6 w-6 text-green-600" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminStatusIndicator;
