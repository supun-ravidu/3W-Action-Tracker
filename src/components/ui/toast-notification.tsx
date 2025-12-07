'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, Sparkles, Rocket, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'celebration';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-900',
  },
  celebration: {
    icon: Rocket,
    color: 'from-purple-500 via-pink-500 to-orange-500',
    bgColor: 'from-purple-50 via-pink-50 to-orange-50',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-900',
  },
  error: {
    icon: XCircle,
    color: 'from-red-500 to-rose-500',
    bgColor: 'from-red-50 to-rose-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-900',
  },
  warning: {
    icon: AlertCircle,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-900',
  },
  info: {
    icon: Info,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-900',
  },
};

export const Toast: React.FC<ToastProps> = ({ id, type, title, message, duration = 5000, onClose }) => {
  const config = toastConfig[type];
  const Icon = config.icon;

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative flex items-start gap-3 p-4 rounded-2xl shadow-2xl border-2 ${config.borderColor} bg-gradient-to-r ${config.bgColor} backdrop-blur-lg min-w-[350px] max-w-[500px] overflow-hidden`}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-5`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Icon with Animation */}
      <motion.div
        animate={
          type === 'celebration'
            ? {
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.2, 1],
              }
            : {
                scale: [1, 1.1, 1],
              }
        }
        transition={{
          duration: type === 'celebration' ? 0.5 : 0.3,
          repeat: type === 'celebration' ? Infinity : 0,
          repeatDelay: 1,
        }}
        className="relative"
      >
        <div className={`p-2 rounded-xl bg-gradient-to-br ${config.color} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        {type === 'celebration' && (
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          >
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </motion.div>
        )}
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0 relative z-10">
        <h4 className={`font-bold text-lg ${config.textColor} mb-1`}>{title}</h4>
        {message && (
          <p className={`text-sm ${config.textColor} opacity-80`}>{message}</p>
        )}
      </div>

      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onClose(id)}
        className={`${config.textColor} opacity-50 hover:opacity-100 transition-opacity`}
      >
        <X className="h-5 w-5" />
      </motion.button>

      {/* Progress Bar */}
      {duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${config.color}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastProps[] }> = ({ toasts }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [
      ...prev,
      {
        ...toast,
        id,
        onClose: (toastId: string) => {
          setToasts((current) => current.filter((t) => t.id !== toastId));
        },
      },
    ]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};
