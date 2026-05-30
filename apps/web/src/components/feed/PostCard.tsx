'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Bookmark, Share2, MoreHorizontal,
  MapPin, Verified, CheckCircle2, BadgeCheck, Award,
  Globe, Users, Lock,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useFeedStore } from '@/stores/feedStore';
import { useUIStore } from '@/stores/uiStore';
import { formatTimeAgo, cn } from '@/lib/utils';
import type { Post, ReactionType } from '@bondhu/shared-types';
import { MediaCarousel } from './MediaCarousel';
import { ReactionPicker } from './ReactionPicker';

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
    <article className="feed-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/profile/${profile?.handle}`)}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border border-border">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-sm">
                {profile?.displayName?.[0] || 'U'}
              </div>
            )}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm group-hover:text-bondhu-green transition-colors">
                {profile?.displayName}
              </span>
              {verification && (
                <verification.icon className={cn('w-4 h-4', verification.color)} />
              )}
            </div>
            <span className="text-xs text-muted-foreground">@{profile?.handle}</span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            {post.visibility === 'PUBLIC' && (
              <span title="সকলের জন্য - Public"><Globe className="w-3 h-3" /></span>
            )}
            {post.visibility === 'FOLLOWERS' && (
              <span title="অনুসারীদের জন্য - Followers"><Users className="w-3 h-3" /></span>
            )}
            {post.visibility === 'PRIVATE' && (
              <span title="ব্যক্তিগত - Private"><Lock className="w-3 h-3" /></span>
            )}
            {formatTimeAgo(post.createdAt, 'bn')}
          </span>
          <button onClick={handleMenu} className="p-1.5 hover:bg-muted rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <div className="text-sm leading-relaxed whitespace-pre-wrap post-content">
          {post.content}
        </div>
      )}

      {/* Location */}
      {post.locationName && (
        <div className="flex items-center gap-1 text-xs text-bondhu-green">
          <MapPin className="w-3.5 h-3.5" />
          <span>{post.locationName}</span>
        </div>
      )}

      {/* Media */}
      {post.mediaAssets && post.mediaAssets.length > 0 && (
        <MediaCarousel assets={post.mediaAssets} />
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-1 relative">
          {/* Reaction Button */}
          <button
            onClick={handleLike}
            onMouseDown={startLongPress}
            onMouseUp={endLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={endLongPress}
            onContextMenu={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-muted transition-colors relative"
          >
            {liked ? (
              <span className="text-lg">{reactionEmoji[post.myReaction || 'LIKE']}</span>
            ) : (
              <Heart className="w-5 h-5 text-muted-foreground" />
            )}
            <span className={cn('text-sm font-medium', liked && 'text-bondhu-red')}>
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

          {/* Comment */}
          <button
            onClick={() => router.push(`/p/${post.id}`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-muted transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{post.commentCount}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-muted transition-colors"
          >
            <Share2 className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{post.shareCount}</span>
          </button>
        </div>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <Bookmark
            className={cn(
              'w-5 h-5 transition-colors',
              bookmarked ? 'fill-bondhu-gold text-bondhu-gold' : 'text-muted-foreground',
            )}
          />
        </button>
      </div>
    </article>
  );
}
