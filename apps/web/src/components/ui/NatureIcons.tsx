'use client';

import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  size?: number;
  count?: number; // For evolving icons
}

// ─────────────────────────────────────────────
// Color evolution based on engagement count
// ─────────────────────────────────────────────
export function getEvolutionStage(count: number = 0) {
  if (count >= 1_000_000) return { stage: 7, color: '#DC2626', glow: 'shadow-red-500/50', label: 'Legendary' };
  if (count >= 100_000) return { stage: 6, color: '#F97316', glow: 'shadow-orange-500/50', label: 'Epic' };
  if (count >= 10_000) return { stage: 5, color: '#FBBF24', glow: 'shadow-amber-400/50', label: 'Famous' };
  if (count >= 5_000) return { stage: 4, color: '#2DD4BF', glow: 'shadow-teal-400/50', label: 'Blooming' };
  if (count >= 1_000) return { stage: 3, color: '#34D399', glow: 'shadow-emerald-400/50', label: 'Growing' };
  if (count >= 100) return { stage: 2, color: '#7BA08A', glow: 'shadow-green-400/40', label: 'Fresh' };
  return { stage: 1, color: '#A3C4B2', glow: 'shadow-green-300/30', label: 'Sprout' };
}

// ─────────────────────────────────────────────
// 1. LIKE ICON — Leaf that evolves with count
// ─────────────────────────────────────────────
export function LikeLeafIcon({ className, size = 22, count = 0 }: IconProps) {
  const { stage, color } = getEvolutionStage(count);

  // Stage 1: Simple small leaf (0-99)
  if (stage === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V8" />
        <path d="M12 8C9 6 7 7 5 9c-1.5 2-1 5 2 7" />
        <path d="M12 8c3-2 5-1 7 1 1.5 2 1 5-2 7" />
      </svg>
    );
  }

  // Stage 2: Fuller leaf (100-999)
  if (stage === 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V6" />
        <path d="M12 6C8 4 5 5 3 8c-2 3.5-1 8 3 10" />
        <path d="M12 6c4-2 7-1 9 2 2 3.5 1 8-3 10" />
        <path d="M12 14c-2-1-3.5-1-4.5-.5" opacity={0.5} />
        <path d="M12 14c2-1 3.5-1 4.5-.5" opacity={0.5} />
      </svg>
    );
  }

  // Stage 3: Vibrant leaf with veins (1K-5K)
  if (stage === 3) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V4" />
        <path d="M12 4C7 2 4 4 2 8s0 9 5 11" />
        <path d="M12 4c5-2 8 0 10 4s0 9-5 11" />
        <path d="M12 10c-2.5-1-4-.5-5 0" opacity={0.6} />
        <path d="M12 10c2.5-1 4-.5 5 0" opacity={0.6} />
        <path d="M12 15c-2-1-3.5-.5-4.5 0" opacity={0.4} />
        <path d="M12 15c2-1 3.5-.5 4.5 0" opacity={0.4} />
      </svg>
    );
  }

  // Stage 4-7: Glowing multi-leaf (5K+)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Main leaf */}
      <path d="M12 22V4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 4C7 2 4 4 2 8s0 9 5 11" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 4c5-2 8 0 10 4s0 9-5 11" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Side leaves */}
      <path d="M8 14c-2-1-3.5 0-4 1.5" stroke={color} strokeWidth={1} strokeLinecap="round" opacity={0.7} />
      <path d="M16 14c2-1 3.5 0 4 1.5" stroke={color} strokeWidth={1} strokeLinecap="round" opacity={0.7} />
      {/* Glow dots for higher stages */}
      {(stage >= 5) && <circle cx="6" cy="10" r="1" fill={color} opacity={0.4} />}
      {(stage >= 6) && <circle cx="18" cy="10" r="1" fill={color} opacity={0.5} />}
      {(stage >= 7) && <circle cx="12" cy="2" r="1.5" fill={color} opacity={0.6} />}
    </svg>
  );
}

// ─────────────────────────────────────────────
// 2. COMMENT ICON — Tree that grows with count
// ─────────────────────────────────────────────
export function CommentTreeIcon({ className, size = 22, count = 0 }: IconProps) {
  const { stage, color } = getEvolutionStage(count);

  // Stage 1: Small sapling
  if (stage === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V10" />
        <path d="M12 10c-1.5-2-3-3-5-3" />
        <path d="M12 10c1.5-2 3-3 5-3" />
        <path d="M12 6c-1-1.5-2-2-3-2" opacity={0.5} />
        <path d="M12 6c1-1.5 2-2 3-2" opacity={0.5} />
      </svg>
    );
  }

  // Stage 2: Growing tree
  if (stage === 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V8" />
        <path d="M12 12c-2.5-1.5-5-2-7-1" />
        <path d="M12 12c2.5-1.5 5-2 7-1" />
        <path d="M12 8c-2-2-4-2.5-6-2" />
        <path d="M12 8c2-2 4-2.5 6-2" />
        {/* Roots */}
        <path d="M9 22c.5-1.5 1.5-2 3-2" opacity={0.5} />
        <path d="M15 22c-.5-1.5-1.5-2-3-2" opacity={0.5} />
      </svg>
    );
  }

  // Stage 3+: Full banyan tree with roots
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Trunk */}
      <path d="M12 22V6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      {/* Main branches */}
      <path d="M12 14c-3-1.5-6-2-9-1" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 14c3-1.5 6-2 9-1" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 10c-2.5-2-5-2.5-8-2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 10c2.5-2 5-2.5 8-2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      {/* Top canopy */}
      <path d="M12 6c-2-1.5-3.5-1.5-5-1" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.8} />
      <path d="M12 6c2-1.5 3.5-1.5 5-1" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.8} />
      {/* Aerial roots for higher stages */}
      {stage >= 3 && <path d="M8 18v-2c0-1-1-2-2-2" stroke={color} strokeWidth={1} strokeLinecap="round" opacity={0.5} />}
      {stage >= 3 && <path d="M16 18v-2c0 1 1 2 2 2" stroke={color} strokeWidth={1} strokeLinecap="round" opacity={0.5} />}
      {/* Extra lush for stage 4+ */}
      {stage >= 4 && <circle cx="5" cy="11" r="1" fill={color} opacity={0.3} />}
      {stage >= 4 && <circle cx="19" cy="11" r="1" fill={color} opacity={0.3} />}
      {stage >= 5 && <circle cx="12" cy="4" r="1.5" fill={color} opacity={0.4} />}
      {stage >= 6 && <path d="M6 14c1 1 2 1 3 0" stroke={color} strokeWidth={0.8} opacity={0.4} />}
      {stage >= 6 && <path d="M18 14c-1 1-2 1-3 0" stroke={color} strokeWidth={0.8} opacity={0.4} />}
      {stage >= 7 && <circle cx="12" cy="16" r="1" fill={color} opacity={0.35} />}
    </svg>
  );
}

// ─────────────────────────────────────────────
// 3. SHARE ICON — Tree roots that grow
// ─────────────────────────────────────────────
export function ShareRootIcon({ className, size = 22, count = 0 }: IconProps) {
  const { stage, color } = getEvolutionStage(count);

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Center trunk */}
      <path d="M12 4v8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      {/* Share branches going outward */}
      <path d="M12 8L6 12" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 8l6 4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 12l-6 4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 12l6 4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      {/* Endpoints */}
      <circle cx="6" cy="12" r="1.5" stroke={color} strokeWidth={1.2} />
      <circle cx="18" cy="12" r="1.5" stroke={color} strokeWidth={1.2} />
      <circle cx="6" cy="16" r="1.5" stroke={color} strokeWidth={1.2} />
      <circle cx="18" cy="16" r="1.5" stroke={color} strokeWidth={1.2} />
      {/* Root growth for higher stages */}
      {stage >= 3 && <path d="M6 16c0 2-1 3-2 4" stroke={color} strokeWidth={1} opacity={0.5} />}
      {stage >= 3 && <path d="M18 16c0 2 1 3 2 4" stroke={color} strokeWidth={1} opacity={0.5} />}
      {stage >= 4 && <path d="M9 16c0 1.5-.5 3-1.5 4" stroke={color} strokeWidth={0.8} opacity={0.4} />}
      {stage >= 4 && <path d="M15 16c0 1.5.5 3 1.5 4" stroke={color} strokeWidth={0.8} opacity={0.4} />}
      {stage >= 5 && <circle cx="4" cy="20" r="1" fill={color} opacity={0.3} />}
      {stage >= 5 && <circle cx="20" cy="20" r="1" fill={color} opacity={0.3} />}
      {stage >= 6 && <path d="M12 12v8" stroke={color} strokeWidth={1} strokeDasharray="2 2" opacity={0.4} />}
      {stage >= 7 && <circle cx="12" cy="21" r="1.5" fill={color} opacity={0.4} />}
    </svg>
  );
}

// ─────────────────────────────────────────────
// 4. SAVE ICON — Seed that sprouts
// ─────────────────────────────────────────────
export function SaveSeedIcon({ className, size = 22, count = 0 }: IconProps) {
  const { stage, color } = getEvolutionStage(count);

  // Stage 1: Simple seed
  if (stage === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="18" rx="4" ry="5" />
        <path d="M12 13c0-3 2-6 4-8" opacity={0.5} />
      </svg>
    );
  }

  // Stage 2: Seed with small sprout
  if (stage === 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="20" rx="3" ry="3.5" />
        <path d="M12 16.5V10" />
        <path d="M12 13c-1.5-1-2.5-.5-3 0" opacity={0.6} />
        <path d="M12 13c1.5-1 2.5-.5 3 0" opacity={0.6} />
      </svg>
    );
  }

  // Stage 3+: Sprouting plant
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Pot/seed base */}
      <ellipse cx="12" cy="21" rx="3" ry="2.5" stroke={color} strokeWidth={1.5} />
      {/* Stem */}
      <path d="M12 18.5V8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      {/* Leaves */}
      <path d="M12 14c-2-1.5-4-1.5-5-.5" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <path d="M12 14c2-1.5 4-1.5 5-.5" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <path d="M12 10c-1.5-1.5-3-1.5-4-.5" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.8} />
      <path d="M12 10c1.5-1.5 3-1.5 4-.5" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.8} />
      {/* Flower/fruit for high stages */}
      {stage >= 4 && <circle cx="12" cy="6" r="2" stroke={color} strokeWidth={1} />}
      {stage >= 5 && <circle cx="10" cy="6" r="0.8" fill={color} opacity={0.4} />}
      {stage >= 6 && <circle cx="14" cy="6" r="0.8" fill={color} opacity={0.5} />}
      {stage >= 7 && <circle cx="12" cy="4" r="1.2" fill={color} opacity={0.5} />}
    </svg>
  );
}

// ─────────────────────────────────────────────
// 5. RAIN DROPS — Replace 3-dot menu
// ─────────────────────────────────────────────
export function RainDropsIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      {/* Three rain drops in a pattern */}
      <path
        d="M8 6.5C8 8.4 6.7 10 5 10S2 8.4 2 6.5C2 4.6 5 1 5 1s3 3.6 3 5.5z"
        opacity={0.8}
      />
      <path
        d="M16 6.5C16 8.4 14.7 10 13 10s-3-1.6-3-3.5C10 4.6 13 1 13 1s3 3.6 3 5.5z"
        opacity={0.6}
      />
      <path
        d="M12 15.5C12 17.4 10.7 19 9 19s-3-1.6-3-3.5C6 13.6 9 10 9 10s3 3.6 3 5.5z"
        opacity={0.5}
      />
      <path
        d="M20 15.5C20 17.4 18.7 19 17 19s-3-1.6-3-3.5c0-1.9 3-5.5 3-5.5s3 3.6 3 5.5z"
        opacity={0.7}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Header decoration — Small tree silhouette
// ─────────────────────────────────────────────
export function HeaderTreeIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V10" />
      <path d="M12 14c-3-1.5-5.5-1-8 .5" />
      <path d="M12 14c3-1.5 5.5-1 8 .5" />
      <path d="M12 10c-2.5-2-4-2-6-1" />
      <path d="M12 10c2.5-2 4-2 6-1" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" fillOpacity={0.15} />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Simple wrapper for non-evolving usage
// ─────────────────────────────────────────────
export function LeafIcon({ className, size = 22 }: IconProps) {
  return <LikeLeafIcon className={className} size={size} count={0} />;
}
export function TreeIcon({ className, size = 22 }: IconProps) {
  return <CommentTreeIcon className={className} size={size} count={0} />;
}
export function ShareIcon({ className, size = 22 }: IconProps) {
  return <ShareRootIcon className={className} size={size} count={0} />;
}
export function BookmarkIcon({ className, size = 22 }: IconProps) {
  return <SaveSeedIcon className={className} size={size} count={0} />;
}
export function ThreeDotsIcon({ className, size = 20 }: IconProps) {
  return <RainDropsIcon className={className} size={size} />;
}