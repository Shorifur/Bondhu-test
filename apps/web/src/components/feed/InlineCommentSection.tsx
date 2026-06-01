'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { formatTimeAgo } from '@/lib/utils';
import { Send, Loader2, WifiOff } from 'lucide-react';
import type { Comment } from '@bondhu/shared-types';

interface InlineCommentSectionProps {
  postId: string;
  commentCount: number;
  isOpen: boolean;
}

const STORAGE_KEY = 'bondhu_local_comments';

// ── localStorage helpers ──
function getLocalComments(postId: string): LocalComment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, LocalComment[]>;
    return all[postId] || [];
  } catch { return []; }
}

function saveLocalComment(postId: string, comment: LocalComment) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: Record<string, LocalComment[]> = raw ? JSON.parse(raw) : {};
    if (!all[postId]) all[postId] = [];
    all[postId] = [comment, ...all[postId]];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}

// Local comment type (matches Comment shape enough for UI)
interface LocalComment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    displayName: string;
    handle: string;
    avatarUrl: string | null;
  };
  isLocal?: boolean;
}

// ── Skeleton loader ──
function CommentSkeleton() {
  return (
    <div className="space-y-2 py-2">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex gap-2.5 animate-pulse">
          <div className="w-7 h-7 rounded-full bg-[#F5F2FF] flex-shrink-0" />
          <div className="flex-1 space-y-1.5 py-0.5">
            <div className="h-2.5 bg-[#F5F2FF] rounded w-3/4" />
            <div className="h-2 bg-[#F5F2FF] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Single comment item ──
function CommentItem({ comment }: { comment: LocalComment }) {
  return (
    <motion.div
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
            {comment.isLocal && (
              <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-600 bg-amber-50 px-1 py-0.5 rounded-full font-medium">
                <WifiOff className="w-2.5 h-2.5" /> লোকাল
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#3D2B6B] leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function InlineCommentSection({ postId, commentCount, isOpen }: InlineCommentSectionProps) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<LocalComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Load comments: try API first, fall back to localStorage ──
  const loadComments = useCallback(async () => {
    if (hasLoaded) return;
    setIsLoading(true);

    // Always load local comments first (instant)
    const local = getLocalComments(postId);
    if (local.length > 0) {
      setComments(local);
    }

    // Try API (silent: true — no error thrown on 404)
    try {
      const res = await api.get(`posts/${postId}/comments`, { silent: true });
      const data = res?.data;
      if (data) {
        let loaded: any[] = [];
        if (Array.isArray(data)) loaded = data;
        else if (typeof data === 'object') {
          loaded = (data as any).data || (data as any).comments || (data as any).results || [];
        }
        if (loaded.length > 0) {
          setComments((prev) => {
            const localOnly = prev.filter((p) => p.isLocal);
            return [...loaded.map((c: any) => ({ ...c, isLocal: false })), ...localOnly];
          });
        }
      } else {
        setIsOffline(true); // 404 — backend not ready
      }
    } catch {
      setIsOffline(true);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, [postId, hasLoaded]);

  useEffect(() => {
    if (isOpen) {
      loadComments();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, loadComments]);

  // ── Submit comment: API + localStorage fallback ──
  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;

    const content = newComment.trim();
    setNewComment('');

    // Build comment object
    const comment: LocalComment = {
      id: `local-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      user: {
        id: user?.id || 'me',
        displayName: user?.profile?.displayName || 'You',
        handle: user?.profile?.handle || 'you',
        avatarUrl: user?.profile?.avatarUrl || null,
      },
      isLocal: true,
    };

    // Immediately show in UI
    setComments((prev) => [comment, ...prev]);

    // Always save to localStorage (works even when API fails)
    saveLocalComment(postId, comment);

    // Try API (silent: true — no error thrown on 404)
    setIsSubmitting(true);
    try {
      await api.post(`posts/${postId}/comments`, { content }, { silent: true });
      // If API succeeds, mark as synced
      setComments((prev) =>
        prev.map((c) => (c.id === comment.id ? { ...c, isLocal: false } : c))
      );
      setIsOffline(false);
    } catch {
      setIsOffline(true);
      // Keep the local comment visible — it's already in localStorage
    } finally {
      setIsSubmitting(false);
    }
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

            {/* Offline indicator */}
            {isOffline && (
              <div className="flex items-center gap-1.5 mb-2 px-2 py-1 bg-amber-50 rounded-lg">
                <WifiOff className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] text-amber-600 font-medium font-bangla">
                  সার্ভার অফলাইন — মন্তব্য লোকালি সংরক্ষিত হচ্ছে
                </span>
              </div>
            )}

            {/* Comments list */}
            <div className="max-h-[280px] overflow-y-auto space-y-3 mb-3 pr-1 scrollbar-thin">
              {isLoading && comments.length === 0 ? (
                <CommentSkeleton />
              ) : comments.length === 0 ? (
                <p className="text-center text-[13px] text-[#6B5E8A] py-4 font-bangla font-medium">
                  প্রথম মন্তব্য করুন... ✨
                </p>
              ) : (
                comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
              )}
            </div>

            {/* Comment input */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A3C4B2] to-[#7BA08A] p-[1.5px] flex-shrink-0">
                <div className="w-full h-full rounded-full bg-white overflow-hidden">
                  {user?.profile?.avatarUrl ? (
                    <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#F5F2FF] flex items-center justify-center text-[10px] font-bold text-[#5B21B6]">
                      {user?.profile?.displayName?.[0] || 'U'}
                    </div>
                  )}
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
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
