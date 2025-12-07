'use client';

import { useActionPlansStore } from '@/store/actionPlansStore';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, Mail, Smartphone, Save } from 'lucide-react';
import { useState } from 'react';

export function NotificationPreferences() {
  const { notificationPreferences, updateNotificationPreferences } = useActionPlansStore();
  const [preferences, setPreferences] = useState(notificationPreferences);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateNotificationPreferences(preferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const notificationTypes = [
    { key: 'assignment', label: 'New Assignments', description: 'When you are assigned to an action' },
    { key: 'deadline_24h', label: '24-Hour Deadline Alert', description: 'One day before due date' },
    { key: 'deadline_1h', label: '1-Hour Deadline Alert', description: 'One hour before due date' },
    { key: 'status_change', label: 'Status Changes', description: 'When action status is updated' },
    { key: 'comment', label: 'Comments', description: 'When someone comments on your actions' },
    { key: 'mention', label: 'Mentions', description: 'When someone @mentions you' },
    { key: 'dependency_resolved', label: 'Dependencies Resolved', description: 'When blocking dependencies are completed' },
    { key: 'approval_request', label: 'Approval Requests', description: 'When approval is needed' },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-base">In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications in the application</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.channels.inApp}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  channels: { ...preferences.channels, inApp: e.target.checked },
                })
              }
              className="h-4 w-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.channels.email}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  channels: { ...preferences.channels, email: e.target.checked },
                })
              }
              className="h-4 w-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-base">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.channels.sms}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  channels: { ...preferences.channels, sms: e.target.checked },
                })
              }
              className="h-4 w-4"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notification Types</h3>
        <div className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between">
              <div>
                <Label className="text-base">{type.label}</Label>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.types[type.key as keyof typeof preferences.types]}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    types: {
                      ...preferences.types,
                      [type.key]: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4"
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          {saved ? 'Saved!' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
