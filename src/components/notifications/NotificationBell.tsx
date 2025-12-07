'use client';

import { Bell, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useActionPlansStore } from '@/store/actionPlansStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export function NotificationBell() {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useActionPlansStore();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      assignment: '👤',
      deadline_24h: '⏰',
      deadline_1h: '🚨',
      status_change: '🔄',
      comment: '💬',
      mention: '@',
      dependency_resolved: '✅',
      approval_request: '📋',
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      assignment: 'bg-blue-500/10 text-blue-600',
      deadline_24h: 'bg-orange-500/10 text-orange-600',
      deadline_1h: 'bg-red-500/10 text-red-600',
      status_change: 'bg-purple-500/10 text-purple-600',
      comment: 'bg-green-500/10 text-green-600',
      mention: 'bg-yellow-500/10 text-yellow-600',
      dependency_resolved: 'bg-emerald-500/10 text-emerald-600',
      approval_request: 'bg-indigo-500/10 text-indigo-600',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-600';
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-[600px] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Notifications</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearAllNotifications()}
            >
              Clear All
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-accent/50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-accent/30' : ''
                }`}
                onClick={() => {
                  markNotificationAsRead(notification.id);
                  if (notification.link) {
                    window.location.href = notification.link;
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {notification.message}
                        </p>
                        {notification.actionPlanTitle && (
                          <p className="text-xs text-muted-foreground mt-1 font-mono">
                            {notification.actionPlanTitle}
                          </p>
                        )}
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
