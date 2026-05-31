'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Verified, CheckCircle2, Award, Globe, Users, Lock } from 'lucide-react';
import { api } from '@/lib/api';
import { useFeedStore } from '@/stores/feedStore';
import { useUIStore } from '@/stores/uiStore';
import { formatTimeAgo, cn } from '@/lib/utils';
import { toBengaliDate } from '@/lib/bengali-date';
import type { Post, ReactionType } from '@bondhu/shared-types';
import { MediaCarousel } from './MediaCarousel';
import { ReactionPicker } from './ReactionPicker';
import {
  LeafIcon, TreeIcon, ShareIcon, BookmarkIcon, ThreeDotsIcon, HeaderTreeIcon,
} from '@/components/ui/CulturalIcons';

const reactionEmoji: Record<ReactionType, string> = {
  LIKE: '❤️',
  LOVE: '💕',
  LAUGH: '😂',
  SAD: '😢',
  WOW: '😮',
  ANGRY: '😠',
};

const verificationConfig = {
  BLUE_INDIVIDUAL: { icon: Verified, color: 'text-blue-500', label: 'Verified' },
  GREEN_BUSINESS: { icon: CheckCircle2, color: 'text-green-500', label: 'Business' },
  ORANGE_CREATOR: { icon: Award, color: 'text-orange-500', label: 'Creator' },
};

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const updatePost = useFeedStore((s) => s.updatePost);
  const openSheet = useUIStore((s) => s.openSheet);
  const [showReactions, setShowReactions] = useState(false);
  const [liked, setLiked] = useState(!!post.myReaction);
  const [bookmarked, setBookmarked] = useState(!!post.isBookmarked);
  const [localReactionCount, setLocalReactionCount] = useState(post.reactionCount);
  const [expanded, setExpanded] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const profile = post.user;
  const verification = profile?.verificationType
    ? verificationConfig[profile.verificationType]
    : null;
  const hasLongText = (post.content?.length || 0) > 280;

  const handleLike = async () => {
    if (liked) {
      setLiked(false);
      setLocalReactionCount((c) => Math.max(0, c - 1));
      updatePost(post.id, (p) => ({ ...p, myReaction: null, reactionCount: Math.max(0, p.reactionCount - 1) }));
      try { await api.delete(`posts/${post.id}/react/LIKE`); } catch { /* noop */ }
    } else {
      setLiked(true);
      setLocalReactionCount((c) => c + 1);
      updatePost(post.id, (p) => ({ ...p, myReaction: 'LIKE' as ReactionType, reactionCount: p.reactionCount + 1 }));
      try { await api.post(`posts/${post.id}/react`, { type: 'LIKE' }); } catch { /* noop */ }
    }
  };

  const handleReaction = async (type: ReactionType) => {
    setLiked(true);
    setShowReactions(false);
    setLocalReactionCount((c) => (post.myReaction ? c : c + 1));
    updatePost(post.id, (p) => ({ ...p, myReaction: type, reactionCount: p.myReaction ? p.reactionCount : p.reactionCount + 1 }));
    try { await api.post(`posts/${post.id}/react`, { type }); } catch { /* noop */ }
  };

  const handleBookmark = async () => {
    setBookmarked(!bookmarked);
    updatePost(post.id, (p) => ({ ...p, isBookmarked: !p.isBookmarked }));
    try {
      if (bookmarked) await api.delete(`posts/${post.id}/bookmark`);
      else await api.post(`posts/${post.id}/bookmark`);
    } catch { /* noop */ }
  };

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => setShowReactions(true), 400);
  };
  const endLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const content = post.content || '';
  const displayContent = expanded || !hasLongText ? content : content.slice(0, 280) + '...';

  return (
    <article
      className="bg-white rounded-2xl mx-3 mb-3 overflow-hidden"
      style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <button
          onClick={() => router.push(`/profile/${profile?.handle}`)}
          className="flex items-center gap-2.5 group"
        >
          <div
            className={cn(
              'w-10 h-10 rounded-full p-[2px]',
              'bg-gradient-to-br from-[#A78BFA] to-[#5EEAD4]'
            )}
          >
            <div className="w-full h-full rounded-full bg-white p-[1.5px] overflow-hidden">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full rounded-full bg-[#F0EEF8] flex items-center justify-center font-bold text-sm text-[#7C3AED]">
                  {profile?.displayName?.[0] || 'U'}
                </div>
              )}
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[13px] text-[#1a1a2e] group-hover:text-[#7C3AED] transition-colors">
                {profile?.displayName}
              </span>
              {verification && <verification.icon className={cn('w-3.5 h-3.5', verification.color)} />}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#9B8FC0]">@{profile?.handle}</span>
              <span className="text-[11px] text-[#C4B5E0]">·</span>
              <span className="text-[11px] text-[#9B8FC0]">{formatTimeAgo(post.createdAt, 'bn')}</span>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1.5">
          {post.visibility === 'PUBLIC' && <Globe className="w-3 h-3 text-[#D4CCE8]" title="সকলের জন্য" />}
          {post.visibility === 'FOLLOWERS' && <Users className="w-3 h-3 text-[#D4CCE8]" title="অনুসারীদের জন্য" />}
          {post.visibility === 'PRIVATE' && <Lock className="w-3 h-3 text-[#D4CCE8]" title="ব্যক্তিগত" />}
          <button
            onClick={() => openSheet('postMenu', { postId: post.id, userId: post.userId, content: post.content, createdAt: post.createdAt })}
            className="p-1.5 hover:bg-[#F5F3FF] rounded-full transition-colors"
          >
            <ThreeDotsIcon className="text-[#C4B5E0]" size={18} />
          </button>
          {/* Decorative banyan tree */}
          <HeaderTreeIcon size={22} className="text-[#D4CCE8] opacity-60" />
        </div>
      </div>

      {/* Bengali date */}
      <div className="px-4 -mt-1 mb-1">
        <span className="text-[10px] text-[#C4B5E0] font-bangla">
          {toBengaliDate(post.createdAt).formatted}
        </span>
      </div>

      {/* Rumor Warning */}
      {(post as any).rumorFlags >= 5 && (
        <div className="mx-4 mb-2 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-base">⚠️</span>
          <div>
            <p className="text-[11px] font-medium text-amber-800 font-bangla leading-tight">
              এই পোস্টটি যাচাই করা হয়নি
            </p>
            <p className="text-[10px] text-amber-600 leading-tight">This post is unverified</p>
          </div>
        </div>
      )}

      {/* Content */}
      {content && (
        <div className="px-4 pb-2">
          <p
            className={cn(
              'text-[15px] leading-[1.7] text-[#1a1a2e] whitespace-pre-wrap font-bangla',
              !post.mediaAssets?.length && 'pb-2'
            )}
          >
            {displayContent}
            {hasLongText && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="text-[#7C3AED] font-medium ml-1 hover:underline"
              >
                আরো দেখুন
              </button>
            )}
          </p>
        </div>
      )}

      {/* Media */}
      {post.mediaAssets && post.mediaAssets.length > 0 && (
        <div className="px-0">
          <MediaCarousel assets={post.mediaAssets} />
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between px-3 py-2.5 border-t border-[#F5F3FF]">
        <div className="flex items-center gap-0.5 relative">
          {/* Like (Leaf) */}
          <button
            onClick={handleLike}
            onMouseDown={startLongPress}
            onMouseUp={endLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={endLongPress}
            onContextMenu={(e) => e.preventDefault()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#F5F3FF] transition-colors"
          >
            {liked ? (
              <span className="text-base">{reactionEmoji[post.myReaction || 'LIKE']}</span>
            ) : (
              <LeafIcon size={19} className="text-[#A3B5A8]" />
            )}
            <span className={cn('text-[13px] font-medium', liked ? 'text-[#7BA08A]' : 'text-[#A3B5A8]')}>
              {localReactionCount}
            </span>
          </button>

          <AnimatePresence>
            {showReactions && (
              <ReactionPicker onSelect={handleReaction} onClose={() => setShowReactions(false)} />
            )}
          </AnimatePresence>

          {/* Comment (Tree) */}
          <button
            onClick={() => router.push(`/p/${post.id}`)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#F5F3FF] transition-colors"
          >
            <TreeIcon size={19} className="text-[#A3B5A8]" />
            <span className="text-[13px] font-medium text-[#A3B5A8]">{post.commentCount}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => openSheet('share', { postId: post.id })}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#F5F3FF] transition-colors"
          >
            <ShareIcon size={19} className="text-[#A3B5A8]" />
            <span className="text-[13px] font-medium text-[#A3B5A8]">{post.shareCount}</span>
          </button>
        </div>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className="p-2 rounded-xl hover:bg-[#F5F3FF] transition-colors"
        >
          <BookmarkIcon
            size={19}
            className={cn('transition-colors', bookmarked ? 'text-[#7BA08A]' : 'text-[#A3B5A8]')}
          />
        </button>
      </div>
    </article>
  );
}
