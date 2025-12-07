'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wifi, Database, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface FirebaseStatusProps {
  isConnected: boolean;
  isLoading: boolean;
  itemCount: number;
  lastUpdate?: Date;
}

export function FirebaseStatus({ isConnected, isLoading, itemCount, lastUpdate }: FirebaseStatusProps) {
  const [pulseColor, setPulseColor] = useState('bg-green-500');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setPulseColor('bg-red-500');
    } else if (isLoading) {
      setPulseColor('bg-yellow-500');
    } else {
      setPulseColor('bg-green-500');
    }
  }, [isConnected, isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2">
        <div className="flex items-center justify-between">
          {/* Connection Status */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Database className="h-6 w-6 text-blue-600" />
              <motion.div
                className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${pulseColor}`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">Firebase</h3>
                {isLoading ? (
                  <Badge variant="outline" className="gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Syncing
                  </Badge>
                ) : isConnected ? (
                  <Badge variant="default" className="gap-1 bg-green-600">
                    <Zap className="h-3 w-3" />
                    Live
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <Wifi className="h-3 w-3" />
                    Offline
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time synchronization active
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {itemCount}
              </p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
            
            {lastUpdate && mounted && (
              <div className="text-right">
                <p className="text-xs font-semibold">
                  {new Date(lastUpdate).toLocaleTimeString()}
                </p>
                <p className="text-xs text-muted-foreground">Last update</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
