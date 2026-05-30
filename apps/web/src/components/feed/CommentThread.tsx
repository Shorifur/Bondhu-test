'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ChevronDown, Heart } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatTimeAgo, cn } from '@/lib/utils';
import type { Comment } from '@bondhu/shared-types';

interface CommentThreadProps {
  postId: string;
  onClose: () => void;
}

export function CommentThread({ postId, onClose }: CommentThreadProps) {
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await api.get<{ data: Comment[] }>(`comments/post/${postId}`);
      return res.data?.data || [];
    },
  });

  const createComment = useMutation({
    mutationFn: async () => {
      await api.post('comments', { postId, parentId: replyTo, content });
    },
    onSuccess: () => {
      setContent('');
      setReplyTo(null);
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 top-20 z-50 bg-background rounded-t-3xl shadow-2xl flex flex-col max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold">Comments</h3>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-bondhu-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data?.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p>
        ) : (
          data?.map((comment) => (
            <CommentNode key={comment.id} comment={comment} onReply={setReplyTo} depth={0} />
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-card">
        {replyTo && (
          <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-muted rounded-lg text-xs">
            <span>Replying to comment</span>
            <button onClick={() => setReplyTo(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && content.trim()) createComment.mutate(); }}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bondhu-green/20"
          />
          <button
            onClick={() => createComment.mutate()}
            disabled={!content.trim() || createComment.isPending}
            className={cn(
              'p-2.5 rounded-xl transition-colors',
              content.trim() ? 'bg-bondhu-green text-white' : 'bg-muted text-muted-foreground',
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CommentNode({ comment, onReply, depth }: { comment: Comment; onReply: (id: string) => void; depth: number }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const loadReplies = async () => {
    if (replies.length > 0) { setShowReplies(!showReplies); return; }
    setLoadingReplies(true);
    const res = await api.get<{ data: Comment[] }>(`comments/${comment.id}/replies`);
    setReplies(res.data?.data || []);
    setShowReplies(true);
    setLoadingReplies(false);
  };

  return (
    <div className={cn('space-y-2', depth > 0 && 'ml-8 border-l-2 border-border pl-3')}
    >
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 overflow-hidden">
          {comment.user?.avatarUrl ? (
            <img src={comment.user.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold">
              {comment.user?.displayName?.[0] || 'U'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-sm">{comment.user?.displayName}</span>
              <span className="text-xs text-muted-foreground">@{comment.user?.handle}</span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-1 px-2">
            <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Heart className="w-3 h-3" /> {comment.reactionCount}
            </button>
            <button onClick={() => onReply(comment.id)} className="text-xs text-muted-foreground hover:text-foreground">
              Reply
            </button>
            <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt, 'bn')}</span>
          </div>
        </div>
      </div>

      {comment.replyCount > 0 && (
        <button
          onClick={loadReplies}
          className="flex items-center gap-1 text-xs text-bondhu-green font-medium ml-11"
        >
          <ChevronDown className={cn('w-3 h-3 transition-transform', showReplies && 'rotate-180')} />
          {loadingReplies ? 'Loading...' : `${comment.replyCount} replies`}
        </button>
      )}

      <AnimatePresence>
        {showReplies && replies.map((reply) => (
          <CommentNode key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
        ))}
      </AnimatePresence>
    </div>
  );
}
