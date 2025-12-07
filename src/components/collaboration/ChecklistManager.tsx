'use client';

import { useState } from 'react';
import { useActionPlansStore } from '@/store/actionPlansStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';
import type { ChecklistItem } from '@/types';

interface ChecklistManagerProps {
  actionPlanId: string;
}

export function ChecklistManager({ actionPlanId }: ChecklistManagerProps) {
  const { actionPlans, updateChecklistItem, addChecklistItem, deleteChecklistItem } = useActionPlansStore();
  const [newItemText, setNewItemText] = useState('');

  const actionPlan = actionPlans.find(p => p.id === actionPlanId);
  const checklist = actionPlan?.checklist || [];

  const completedCount = checklist.filter(item => item.completed).length;
  const progress = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    
    addChecklistItem(actionPlanId, {
      text: newItemText,
      completed: false,
      order: checklist.length,
    });
    
    setNewItemText('');
  };

  const handleToggle = (itemId: string) => {
    const item = checklist.find(i => i.id === itemId);
    if (item) {
      updateChecklistItem(actionPlanId, itemId, {
        ...item,
        completed: !item.completed,
      });
    }
  };

  const handleDelete = (itemId: string) => {
    deleteChecklistItem(actionPlanId, itemId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <h3 className="font-semibold text-lg">Checklist</h3>
          <Badge variant="secondary">
            {completedCount}/{checklist.length}
          </Badge>
        </div>
        {checklist.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {progress.toFixed(0)}% Complete
          </span>
        )}
      </div>

      {checklist.length > 0 && (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <Card className="p-4">
        <div className="space-y-2 mb-4">
          {checklist.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 rounded hover:bg-accent/50 group"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
              
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggle(item.id)}
                className="h-4 w-4 cursor-pointer"
              />

              <span
                className={`flex-1 text-sm ${
                  item.completed ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {item.text}
              </span>

              {item.assignee && (
                <Badge variant="outline" className="text-xs">
                  {item.assignee.name}
                </Badge>
              )}

              {item.dueDate && (
                <Badge variant="outline" className="text-xs">
                  {new Date(item.dueDate).toLocaleDateString()}
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add checklist item..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <Button onClick={handleAddItem} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {checklist.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No checklist items yet. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}
