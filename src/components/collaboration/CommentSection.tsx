'use client';

import { useState } from 'react';
import { useActionPlansStore } from '@/store/actionPlansStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Smile, AtSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Comment } from '@/types';

interface CommentSectionProps {
  actionPlanId: string;
}

export function CommentSection({ actionPlanId }: CommentSectionProps) {
  const { actionPlans, teamMembers, addComment, addReactionToComment } = useActionPlansStore();
  const [newComment, setNewComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [showMentionList, setShowMentionList] = useState(false);

  const actionPlan = actionPlans.find(p => p.id === actionPlanId);
  const comments = actionPlan?.comments || [];

  const currentUser = {
    id: 'current-user',
    name: 'Current User',
    email: 'user@example.com',
  };

  const emojis = ['👍', '❤️', '😊', '🎉', '🚀', '👏', '✅', '🔥'];

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    const mentions = extractMentions(newComment);
    
    addComment(actionPlanId, {
      author: currentUser,
      content: newComment,
      mentions,
    });

    setNewComment('');
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    if (!matches) return [];

    return matches
      .map(match => {
        const name = match.substring(1);
        const member = teamMembers.find(m => 
          m.name.toLowerCase().includes(name.toLowerCase())
        );
        return member?.id;
      })
      .filter(Boolean) as string[];
  };

  const handleMention = (member: any) => {
    setNewComment(prev => prev + `@${member.name.replace(/\s+/g, '')} `);
    setShowMentionList(false);
  };

  const handleReaction = (commentId: string, emoji: string) => {
    addReactionToComment(commentId, {
      emoji,
      userId: currentUser.id,
      userName: currentUser.name,
    });
    setShowEmojiPicker(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="font-semibold text-lg">Comments</h3>
        <Badge variant="secondary">{comments.length}</Badge>
      </div>

      <Card className="p-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment... Use @ to mention team members"
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              if (e.target.value.endsWith('@')) {
                setShowMentionList(true);
              }
            }}
            className="min-h-[80px]"
          />

          {showMentionList && (
            <Card className="p-2 max-h-48 overflow-y-auto">
              {teamMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => handleMention(member)}
                  className="w-full text-left px-3 py-2 hover:bg-accent rounded flex items-center gap-2"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm">{member.name}</span>
                </button>
              ))}
            </Card>
          )}

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMentionList(!showMentionList)}
            >
              <AtSign className="h-4 w-4 mr-1" />
              Mention
            </Button>
            <Button onClick={handleSubmit} size="sm">
              <Send className="h-4 w-4 mr-1" />
              Post Comment
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {comments.map((comment) => (
          <Card key={comment.id} className="p-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {comment.author.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-sm">{comment.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

                {comment.mentions && comment.mentions.length > 0 && (
                  <div className="mt-2 flex items-center gap-1">
                    <AtSign className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Mentioned {comment.mentions.length} {comment.mentions.length === 1 ? 'person' : 'people'}
                    </span>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmojiPicker(showEmojiPicker === comment.id ? null : comment.id)}
                    >
                      <Smile className="h-4 w-4 mr-1" />
                      React
                    </Button>

                    {showEmojiPicker === comment.id && (
                      <Card className="absolute top-full left-0 mt-1 p-2 flex gap-1 z-10">
                        {emojis.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(comment.id, emoji)}
                            className="hover:bg-accent rounded p-1 text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </Card>
                    )}
                  </div>

                  {comment.reactions && comment.reactions.length > 0 && (
                    <div className="flex gap-1">
                      {Object.entries(
                        comment.reactions.reduce((acc, r) => {
                          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([emoji, count]) => (
                        <Badge key={emoji} variant="secondary" className="gap-1">
                          <span>{emoji}</span>
                          <span className="text-xs">{count}</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No comments yet. Start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}
