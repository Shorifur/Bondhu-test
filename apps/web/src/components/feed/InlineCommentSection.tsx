'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { formatTimeAgo } from '@/lib/utils';
import { Send } from 'lucide-react';
import type { Comment } from '@bondhu/shared-types';

interface InlineCommentSectionProps {
  postId: string;
  commentCount: number;
  isOpen: boolean;
}

export function InlineCommentSection({ postId, commentCount, isOpen }: InlineCommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && comments.length === 0) {
      loadComments();
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`posts/${postId}/comments`);
      if (res?.data?.data) {
        setComments(res.data.data);
      }
    } catch { /* noop */ }
    finally { setIsLoading(false); }
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const content = newComment.trim();
    setNewComment('');

    const tempComment: Comment = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      user: { displayName: 'You', handle: 'you', avatarUrl: null },
      likeCount: 0,
      myLike: false,
      replyCount: 0,
    } as Comment;
    setComments((prev) => [tempComment, ...prev]);

    try {
      const res = await api.post(`posts/${postId}/comments`, { content });
      if (res?.data?.data) {
        setComments((prev) => prev.map((c) => (c.id === tempComment.id ? res.data.data : c)));
      }
    } catch {
      setComments((prev) => prev.filter((c) => c.id !== tempComment.id));
    } finally { setIsSubmitting(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-3 pt-1">
            <div className="h-px bg-gradient-to-r from-transparent via-[#D1E5E3] to-transparent mb-3" />

            <div className="max-h-[280px] overflow-y-auto space-y-3 mb-3 pr-1 scrollbar-thin">
              {isLoading ? (
                <div className="space-y-2 py-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-2.5 animate-pulse">
                      <div className="w-7 h-7 rounded-full bg-[#F5F2FF] flex-shrink-0" />
                      <div className="flex-1 space-y-1.5 py-0.5">
                        <div className="h-2.5 bg-[#F5F2FF] rounded w-3/4" />
                        <div className="h-2 bg-[#F5F2FF] rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <p className="text-center text-[13px] text-[#6B5E8A] py-4 font-bangla font-medium">
                  প্রথম মন্তব্য করুন... ✨
                </p>
              ) : (
                comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A3C4B2] to-[#7BA08A] p-[1.5px] flex-shrink-0">
                      <div className="w-full h-full rounded-full bg-white overflow-hidden">
                        {comment.user?.avatarUrl ? (
                          <img src={comment.user.avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full rounded-full bg-[#F5F2FF] flex items-center justify-center text-[10px] font-bold text-[#5B21B6]">
                            {comment.user?.displayName?.[0] || 'U'}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="bg-[#F5F2FF] rounded-2xl rounded-tl-sm px-3 py-2 inline-block max-w-full">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[12px] font-semibold text-[#0F0A1E]">
                            {comment.user?.displayName || 'User'}
                          </span>
                          <span className="text-[10px] text-[#6B5E8A] font-medium">
                            {formatTimeAgo(comment.createdAt, 'bn')}
                          </span>
                        </div>
                        <p className="text-[13px] text-[#3D2B6B] leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1 ml-1">
                        <button className="text-[11px] text-[#6B5E8A] hover:text-[#5B21B6] transition-colors font-semibold">
                          Like
                        </button>
                        <button className="text-[11px] text-[#6B5E8A] hover:text-[#5B21B6] transition-colors font-semibold">
                          Reply
                        </button>
                        {comment.likeCount > 0 && (
                          <span className="text-[11px] text-[#6B5E8A] font-medium">{comment.likeCount} likes</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A3C4B2] to-[#7BA08A] p-[1.5px] flex-shrink-0">
                <div className="w-full h-full rounded-full bg-white overflow-hidden">
                  <div className="w-full h-full rounded-full bg-[#F5F2FF] flex items-center justify-center text-[10px] font-bold text-[#5B21B6]">
                    U
                  </div>
                </div>
              </div>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="মন্তব্য করুন... 💭"
                  className="w-full bg-[#F5F2FF] rounded-full px-4 py-2 text-[13px] text-[#0F0A1E] placeholder:text-[#9B8FC0] focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/30 transition-all"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!newComment.trim() || isSubmitting}
                className="p-2 rounded-full bg-gradient-to-br from-[#A3C4B2] to-[#7BA08A] text-white disabled:opacity-30 disabled:scale-100 hover:scale-105 active:scale-95 transition-all flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}