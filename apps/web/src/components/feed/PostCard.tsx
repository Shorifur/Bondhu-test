'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Verified, CheckCircle2, BadgeCheck, Award,
  Globe, Users, Lock,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useFeedStore } from '@/stores/feedStore';
import { useUIStore } from '@/stores/uiStore';
import { formatTimeAgo, cn } from '@/lib/utils';
import { toBengaliDate } from '@/lib/bengali-date';
import type { Post, ReactionType } from '@bondhu/shared-types';
import { MediaCarousel } from './MediaCarousel';
import { ReactionPicker } from './ReactionPicker';
import {
  LeafIcon,
  TreeIcon,
  ShareIcon,
  BookmarkIcon,
  ThreeDotsIcon,
  HeaderTreeIcon,
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
  const [localBookmarkCount, setLocalBookmarkCount] = useState(post.bookmarkCount);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const profile = post.user;
  const verification = profile?.verificationType
    ? verificationConfig[profile.verificationType]
    : null;

  const handleLike = async () => {
    if (liked) {
      setLiked(false);
      setLocalReactionCount((c) => c - 1);
      updatePost(post.id, (p) => ({ ...p, myReaction: null, reactionCount: p.reactionCount - 1 }));
      await api.delete(`posts/${post.id}/react/LIKE`);
    } else {
      setLiked(true);
      setLocalReactionCount((c) => c + 1);
      updatePost(post.id, (p) => ({ ...p, myReaction: 'LIKE' as ReactionType, reactionCount: p.reactionCount + 1 }));
      await api.post(`posts/${post.id}/react`, { type: 'LIKE' });
    }
  };

  const handleReaction = async (type: ReactionType) => {
    setLiked(true);
    setShowReactions(false);
    setLocalReactionCount((c) => (post.myReaction ? c : c + 1));
    updatePost(post.id, (p) => ({ ...p, myReaction: type, reactionCount: p.myReaction ? p.reactionCount : p.reactionCount + 1 }));
    await api.post(`posts/${post.id}/react`, { type });
  };

  const handleBookmark = async () => {
    setBookmarked(!bookmarked);
    setLocalBookmarkCount((c) => (bookmarked ? c - 1 : c + 1));
    updatePost(post.id, (p) => ({ ...p, isBookmarked: !p.isBookmarked, bookmarkCount: bookmarked ? p.bookmarkCount - 1 : p.bookmarkCount + 1 }));
    if (bookmarked) {
      await api.delete(`posts/${post.id}/bookmark`);
    } else {
      await api.post(`posts/${post.id}/bookmark`);
    }
  };

  const handleShare = () => {
    openSheet('share', { postId: post.id });
  };

  const handleMenu = () => {
    openSheet('postMenu', { postId: post.id, userId: post.userId, content: post.content, createdAt: post.createdAt });
  };

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => setShowReactions(true), 400);
  };

  const endLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  return (
    <article className="feed-card p-4 mx-3 mb-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/profile/${profile?.handle}`)}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-[#F0EEF8] overflow-hidden border-2 border-[#E8E4F5]">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#7C3AED]">
                {profile?.displayName?.[0] || 'U'}
              </div>
            )}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[13px] text-[#1a1a2e] group-hover:text-purple-600 transition-colors">
                {profile?.displayName}
              </span>
              {verification && (
                <verification.icon className={cn('w-3.5 h-3.5', verification.color)} />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#9B8FC0]">@{profile?.handle}</span>
              {/* Visibility icon */}
              {post.visibility === 'PUBLIC' && (
                <span title="সকলের জন্য - Public"><Globe className="w-3 h-3 text-[#C4B8E0]" /></span>
              )}
              {post.visibility === 'FOLLOWERS' && (
                <span title="অনুসারীদের জন্য - Followers"><Users className="w-3 h-3 text-[#C4B8E0]" /></span>
              )}
              {post.visibility === 'PRIVATE' && (
                <span title="ব্যক্তিগত - Private"><Lock className="w-3 h-3 text-[#C4B8E0]" /></span>
              )}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-[#9B8FC0]">
              {formatTimeAgo(post.createdAt, 'bn')}
            </span>
            <span className="text-[10px] text-[#C4B8E0] font-bangla">
              {toBengaliDate(post.createdAt).formatted}
            </span>
          </div>
          <button
            onClick={handleMenu}
            className="p-1.5 hover:bg-[#F0EEF8] rounded-full transition-colors"
          >
            <ThreeDotsIcon className="text-[#C4B8E0]" size={18} />
          </button>
        </div>
      </div>

      {/* Rumor Flag Warning */}
      {(post as any).rumorFlags >= 5 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-base">⚠️</span>
          <div>
            <p className="text-[11px] font-medium text-amber-800 font-bangla">
              এই পোস্টটি যাচাই করা হয়নি
            </p>
            <p className="text-[10px] text-amber-600">
              This post is unverified
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {post.content && (
        <div
          className={cn(
            'whitespace-pre-wrap post-content',
            !post.mediaAssets?.length && 'text-[15px] leading-relaxed p-3 rounded-xl',
            !post.mediaAssets?.length && 'bg-[#FAFAFF]'
          )}
        >
          {post.content}
        </div>
      )}

      {/* Location */}
      {post.locationName && (
        <div className="flex items-center gap-1 text-[11px]" style={{ color: '#7C3AED' }}>
          <MapPin className="w-3.5 h-3.5" />
          <span className="font-bangla">{post.locationName}</span>
        </div>
      )}

      {/* Media */}
      {post.mediaAssets && post.mediaAssets.length > 0 && (
        <div className="rounded-xl overflow-hidden">
          <MediaCarousel assets={post.mediaAssets} />
        </div>
      )}

      {/* Action Bar — Cultural Icons */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-0.5 relative">
          {/* Leaf / Like Button */}
          <button
            onClick={handleLike}
            onMouseDown={startLongPress}
            onMouseUp={endLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={endLongPress}
            onContextMenu={(e) => e.preventDefault()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#F0EEF8] transition-colors"
          >
            {liked ? (
              <span className="text-base">{reactionEmoji[post.myReaction || 'LIKE']}</span>
            ) : (
              <LeafIcon size={20} className="text-[#9B8FC0]" />
            )}
            <span className={cn('text-[13px] font-medium', liked ? 'text-purple-600' : 'text-[#9B8FC0]')}>
              {localReactionCount}
            </span>
          </button>

          {/* Floating Reaction Picker */}
          <AnimatePresence>
            {showReactions && (
              <ReactionPicker
                onSelect={handleReaction}
                onClose={() => setShowReactions(false)}
              />
            )}
          </AnimatePresence>

          {/* Tree / Comment Button */}
          <button
            onClick={() => router.push(`/p/${post.id}`)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#F0EEF8] transition-colors"
          >
            <TreeIcon size={20} className="text-[#9B8FC0]" />
            <span className="text-[13px] font-medium text-[#9B8FC0]">{post.commentCount}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#F0EEF8] transition-colors"
          >
            <ShareIcon size={20} className="text-[#9B8FC0]" />
            <span className="text-[13px] font-medium text-[#9B8FC0]">{post.shareCount}</span>
          </button>
        </div>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className="p-2 rounded-xl hover:bg-[#F0EEF8] transition-colors"
        >
          <BookmarkIcon
            size={20}
            className={cn(
              'transition-colors',
              bookmarked ? 'text-purple-500' : 'text-[#9B8FC0]',
            )}
          />
        </button>
      </div>
    </article>
  );
}
