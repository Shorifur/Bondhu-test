'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Send, X, Heart, MessageSquare, Trash2, ChevronDown, Smile } from 'lucide-react';
import { api } from '@/lib/api';
import { PostCard } from '@/components/feed/PostCard';
import { useAuthStore } from '@/stores/authStore';
import { cn, formatTimeAgo } from '@/lib/utils';
import { formatBengaliDateShort } from '@/lib/bengali-date';
import type { Comment } from '@bondhu/shared-types';

const emojiReactions = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '🎉'];

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyToUser, setReplyToUser] = useState<string>('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: post, isLoading } = useQuery<any>({
    queryKey: ['post', postId],
    queryFn: async () => {
      const res = await api.get(`posts/${postId}`);
      return (res as any).data;
    },
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery<{ data: Comment[] }>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await api.get(`comments/post/${postId}`);
      return (res as any).data || { data: [] };
    },
  });

  const createComment = useMutation({
    mutationFn: async () => {
      await api.post('comments', { postId, content, parentId: replyTo });
    },
    onSuccess: () => {
      setContent('');
      setReplyTo(null);
      setReplyToUser('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-bondhu-green" />
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-12 text-muted-foreground">Post not found</div>;
  }

  const isOwnPost = post.userId === user?.id;

  return (
    <div className="py-4 space-y-4">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <PostCard post={post} />

      {/* Bengali date */}
      <div className="text-xs text-muted-foreground text-center">
        {formatBengaliDateShort(post.createdAt)}
      </div>

      {post.factCheckStatus && post.factCheckStatus !== 'UNVERIFIED' && (
        <div className={cn(
          'p-3 rounded-xl text-sm font-medium flex items-center gap-2',
          post.factCheckStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' :
          post.factCheckStatus === 'FALSE_INFORMATION' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
        )}>
          {post.factCheckStatus === 'VERIFIED' ? '✓ Verified' :
           post.factCheckStatus === 'FALSE_INFORMATION' ? '✗ False Information' :
           '⚠️ Under Review'}
        </div>
      )}

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Comments</h3>

        {/* Comments List */}
        {commentsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-bondhu-green" />
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {commentsData?.data?.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No comments yet. Be the first!</p>
            )}
            {commentsData?.data?.map((comment: Comment) => (
              <CommentNode
                key={comment.id}
                comment={comment}
                onReply={(id, name) => {
                  setReplyTo(id);
                  setReplyToUser(name);
                  inputRef.current?.focus();
                }}
                depth={0}
                postId={postId}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Comment Input - Fixed at bottom */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t pt-3 pb-4 -mx-4 px-4 z-30">
        {replyTo && (
          <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-muted rounded-lg text-xs">
            <span>Replying to <span className="font-medium">{replyToUser}</span></span>
            <button onClick={() => { setReplyTo(null); setReplyToUser(''); }} className="text-muted-foreground hover:text-foreground">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
            {user?.profile?.avatarUrl ? (
              <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                {user?.profile?.displayName?.[0] || 'U'}
              </div>
            )}
          </div>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a comment..."
              rows={1}
              className="w-full px-4 py-2.5 bg-muted rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-bondhu-green/20 max-h-24"
              style={{ minHeight: '40px' }}
            />
          </div>
          <button
            onClick={() => createComment.mutate()}
            disabled={!content.trim() || createComment.isPending}
            className={cn(
              'p-2.5 rounded-full transition-colors mb-0.5',
              content.trim() ? 'bg-bondhu-green text-white' : 'bg-muted text-muted-foreground',
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentNode({
  comment,
  onReply,
  depth,
  postId,
  currentUserId,
}: {
  comment: Comment;
  onReply: (id: string, name: string) => void;
  depth: number;
  postId: string;
  currentUserId?: string;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [localReaction, setLocalReaction] = useState<string | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const isOwn = comment.userId === currentUserId;

  const loadReplies = async () => {
    if (replies.length > 0) { setShowReplies(!showReplies); return; }
    setLoadingReplies(true);
    const res = await api.get(`comments/${comment.id}/replies`);
    setReplies((res as any).data?.data || []);
    setShowReplies(true);
    setLoadingReplies(false);
  };

  const likeComment = useMutation({
    mutationFn: async () => {
      await api.post(`comments/${comment.id}/like`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', postId] }),
  });

  const deleteComment = useMutation({
    mutationFn: async () => {
      await api.delete(`comments/${comment.id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', postId] }),
  });

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => setShowEmojiPicker(true), 600);
  };

  const endLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('space-y-1', depth > 0 && 'ml-10 relative')}
    >
      {depth > 0 && (
        <div className="absolute left-[-20px] top-0 bottom-0 w-px bg-border" />
      )}

      <div className="flex gap-2.5">
        {/* Avatar */}
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
          {/* Comment Bubble */}
          <div
            className={cn(
              'rounded-2xl px-3.5 py-2.5 inline-block max-w-full',
              isOwn ? 'bg-bondhu-green/10 rounded-br-sm' : 'bg-muted rounded-bl-sm'
            )}
            onMouseDown={startLongPress}
            onMouseUp={endLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={endLongPress}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-bold text-xs">{comment.user?.displayName}</span>
              <span className="text-[10px] text-muted-foreground">@{comment.user?.handle}</span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
            {localReaction && (
              <span className="text-sm mt-1 block">{localReaction}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-1 px-1">
            <button
              onClick={() => likeComment.mutate()}
              className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
            >
              <Heart className={cn('w-3 h-3', comment.reactionCount > 0 && 'fill-red-500 text-red-500')} />
              {comment.reactionCount > 0 && comment.reactionCount}
            </button>
            <button
              onClick={() => onReply(comment.id, comment.user?.displayName || '')}
              className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              Reply
            </button>
            {isOwn && (
              <button
                onClick={() => {
                  if (confirm('Delete this comment?')) deleteComment.mutate();
                }}
                className="text-[11px] text-red-400 hover:text-red-600 flex items-center gap-0.5 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            <span className="text-[11px] text-muted-foreground">{formatTimeAgo(comment.createdAt, 'bn')}</span>
          </div>
        </div>
      </div>

      {/* Emoji Reaction Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setShowEmojiPicker(false)}
          >
            <div className="bg-card rounded-2xl p-4 flex gap-2 flex-wrap max-w-xs justify-center" onClick={(e) => e.stopPropagation()}>
              {emojiReactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setLocalReaction(emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-2xl p-2 hover:bg-muted rounded-xl transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replies toggle */}
      {comment.replyCount > 0 && (
        <button
          onClick={loadReplies}
          className="flex items-center gap-1 text-xs text-bondhu-green font-medium ml-10"
        >
          <ChevronDown className={cn('w-3 h-3 transition-transform', showReplies && 'rotate-180')} />
          {loadingReplies ? 'Loading...' : `${comment.replyCount} replies`}
        </button>
      )}

      {/* Nested Replies */}
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {replies.map((reply) => (
              <CommentNode
                key={reply.id}
                comment={reply}
                onReply={onReply}
                depth={depth + 1}
                postId={postId}
                currentUserId={currentUserId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
