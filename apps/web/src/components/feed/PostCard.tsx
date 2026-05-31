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
import { InlineCommentSection } from './InlineCommentSection';
import {
  LikeLeafIcon, CommentTreeIcon, ShareRootIcon, SaveSeedIcon, RainDropsIcon, HeaderTreeIcon,
  getEvolutionStage,
} from '@/components/ui/NatureIcons';

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
  const openCommentsPostId = useFeedStore((s) => s.openCommentsPostId);
  const toggleComments = useFeedStore((s) => s.toggleComments);
  const openSheet = useUIStore((s) => s.openSheet);
  const [showReactions, setShowReactions] = useState(false);
  const [liked, setLiked] = useState(!!post.myReaction);
  const [bookmarked, setBookmarked] = useState(!!post.isBookmarked);
  const [localReactionCount, setLocalReactionCount] = useState(post.reactionCount);
  const [expanded, setExpanded] = useState(false);
  const commentsOpen = openCommentsPostId === post.id;
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
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card-hover p-4 md:p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/profile/${profile?.handle}`)}
          className="flex items-center gap-2.5 group"
        >
          <div className="avatar-ring">
            <div className="w-10 h-10 rounded-full bg-white p-[1.5px] overflow-hidden">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#E8D5F5] to-[#D4F1E0] flex items-center justify-center font-bold text-sm text-[#5B21B6]">
                  {profile?.displayName?.[0] || 'U'}
                </div>
              )}
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="font-bold text-[13px] text-[#0F0A1E] group-hover:text-[#5B21B6] transition-colors font-bangla">
                {profile?.displayName || 'User'}
              </span>
              {verification && <verification.icon className={cn('w-3.5 h-3.5', verification.color)} />}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#6B5E8A] font-medium">@{profile?.handle || 'user'}</span>
              <span className="text-[11px] text-[#B8A9E3]">&middot;</span>
              <span className="text-[11px] text-[#6B5E8A]">{formatTimeAgo(post.createdAt, 'bn')}</span>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1">
          {post.visibility === 'PUBLIC' && <Globe className="w-3 h-3 text-[#B8A9E3]" />}
          {post.visibility === 'FOLLOWERS' && <Users className="w-3 h-3 text-[#B8A9E3]" />}
          {post.visibility === 'PRIVATE' && <Lock className="w-3 h-3 text-[#B8A9E3]" />}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openSheet('postMenu', { postId: post.id, userId: post.userId, content: post.content, createdAt: post.createdAt })}
            className="p-1.5 hover:bg-white/60 rounded-full transition-colors"
          >
            <RainDropsIcon className="text-[#7C6AAE]" size={18} />
          </motion.button>
          <HeaderTreeIcon size={18} className="text-[#B8A9E3] opacity-50" />
        </div>
      </div>

      {/* Bengali date */}
      <div className="mt-1 mb-1">
        <span className="text-[10px] text-[#6B5E8A] font-medium font-bangla">
          {toBengaliDate(post.createdAt).formatted}
        </span>
      </div>

      {/* Content */}
      {content && (
        <div className="mt-2">
          <p className="text-[15px] leading-[1.7] text-[#0F0A1E] whitespace-pre-wrap font-bangla">
            {displayContent}
            {hasLongText && !expanded && (
              <button onClick={() => setExpanded(true)} className="text-[#5B21B6] font-semibold ml-1 hover:underline">
                আরো দেখুন
              </button>
            )}
          </p>
        </div>
      )}

      {/* Media */}
      {post.mediaAssets && post.mediaAssets.length > 0 && (
        <div className="mt-3 -mx-1">
          <MediaCarousel assets={post.mediaAssets} />
        </div>
      )}

      {/* Action Bar with Framer Motion */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/40">
        <div className="flex items-center gap-1 relative">
          {/* Like */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.88 }}
            onClick={handleLike}
            onMouseDown={startLongPress}
            onMouseUp={endLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={endLongPress}
            onContextMenu={(e) => e.preventDefault()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-white/50 transition-colors"
          >
            {liked ? (
              <LikeLeafIcon size={18} count={localReactionCount} active className="text-[#E85D75]" />
            ) : (
              <LikeLeafIcon size={18} count={localReactionCount} className="text-[#4C3A8A]" />
            )}
            <span className="text-[12px] font-bold" style={{ color: liked ? '#E85D75' : getEvolutionStage(localReactionCount).color }}>
              {localReactionCount}
            </span>
          </motion.button>

          <AnimatePresence>
            {showReactions && (
              <ReactionPicker onSelect={handleReaction} onClose={() => setShowReactions(false)} />
            )}
          </AnimatePresence>

          {/* Comment */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => toggleComments(post.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-white/50 transition-colors"
          >
            <CommentTreeIcon size={18} count={post.commentCount} className="text-[#4C3A8A]" />
            <span className="text-[12px] font-bold" style={{ color: getEvolutionStage(post.commentCount).color }}>
              {post.commentCount}
            </span>
          </motion.button>

          {/* Share */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => openSheet('share', { postId: post.id })}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-white/50 transition-colors"
          >
            <ShareRootIcon size={18} count={post.shareCount} className="text-[#4C3A8A]" />
            <span className="text-[12px] font-bold" style={{ color: getEvolutionStage(post.shareCount).color }}>
              {post.shareCount}
            </span>
          </motion.button>
        </div>

        {/* Save */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleBookmark}
          className="p-2 rounded-xl hover:bg-white/50 transition-colors"
        >
          <SaveSeedIcon
            size={18}
            count={bookmarked ? 1 : 0}
            active={bookmarked}
            className={cn('transition-colors', bookmarked ? 'text-[#5B21B6]' : 'text-[#4C3A8A]')}
          />
        </motion.button>
      </div>

      {/* Inline Comment Section */}
      <InlineCommentSection postId={post.id} commentCount={post.commentCount} isOpen={commentsOpen} />
    </motion.article>
  );
}
