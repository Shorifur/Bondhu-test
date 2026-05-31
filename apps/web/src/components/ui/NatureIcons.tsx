'use client';

interface IconProps {
  className?: string;
  size?: number;
  count?: number;
  active?: boolean;
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
  if (count >= 100)  return { stage: 2, color: '#5F7A61', glow: 'shadow-green-400/40', label: 'Fresh' };
  return { stage: 1, color: '#8B9D8F', glow: 'shadow-green-300/30', label: 'Sprout' };
}

const ACTIVE_RED = '#E85D75';
const ACTIVE_FILL = 'rgba(232, 93, 117, 0.12)';

// ─────────────────────────────────────────────
// 1. LIKE — Clean leaf (almond shape with vein)
//    Fills warm red when liked
// ─────────────────────────────────────────────
export function LikeLeafIcon({ className, size = 20, count = 0, active = false }: IconProps) {
  const { stage, color } = getEvolutionStage(count);
  const strokeColor = active ? ACTIVE_RED : color;
  const fillColor = active ? ACTIVE_FILL : stage >= 3 ? `rgba(95, 122, 97, 0.08)` : 'none';

  // Stage 1 (0-99): Simple clean leaf
  if (stage === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fillColor} className={className} stroke={strokeColor} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C7 6 4 10 4 14c0 3.5 2.5 6 6 6 1.5 0 3-.5 4.5-1.5" />
        <path d="M12 2c5 4 8 8 8 12 0 3.5-2.5 6-6 6-1.5 0-3-.5-4.5-1.5" />
        <path d="M12 6v10" opacity={0.4} />
      </svg>
    );
  }

  // Stage 2 (100-999): Leaf with vein details
  if (stage === 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fillColor} className={className} stroke={strokeColor} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 6 3.5 10.5 3.5 14.5c0 3.5 2.5 6 6 6 1.8 0 3.5-.6 5-1.8" />
        <path d="M12 2c5.5 4 8.5 8.5 8.5 12.5 0 3.5-2.5 6-6 6-1.8 0-3.5-.6-5-1.8" />
        <path d="M12 5v11.5" opacity={0.4} />
        <path d="M12 10c-1.5-.5-2.5-.3-3.5.2" opacity={0.3} />
        <path d="M12 10c1.5-.5 2.5-.3 3.5.2" opacity={0.3} />
      </svg>
    );
  }

  // Stage 3+: Fuller leaf with glow dots
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fillColor} className={className}>
      <path d="M12 2C6 6 2.5 11 2.5 15c0 3.5 2.5 6 6.5 6 2 0 4-.7 5.5-2" stroke={strokeColor} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2c6 4 9.5 9 9.5 13 0 3.5-2.5 6-6.5 6-2 0-4-.7-5.5-2" stroke={strokeColor} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 4v13" stroke={strokeColor} strokeWidth={0.8} opacity={0.35} />
      <path d="M12 9.5c-1.8-.6-3-.4-4 .2" stroke={strokeColor} strokeWidth={0.7} opacity={0.25} />
      <path d="M12 9.5c1.8-.6 3-.4 4 .2" stroke={strokeColor} strokeWidth={0.7} opacity={0.25} />
      {stage >= 4 && <circle cx="7" cy="7" r="0.8" fill={strokeColor} opacity={0.3} />}
      {stage >= 5 && <circle cx="17" cy="7" r="0.8" fill={strokeColor} opacity={0.35} />}
      {stage >= 6 && <circle cx="12" cy="3" r="1" fill={strokeColor} opacity={0.4} />}
      {stage >= 7 && <circle cx="12" cy="19" r="0.6" fill={strokeColor} opacity={0.3} />}
    </svg>
  );
}

// ─────────────────────────────────────────────
// 2. COMMENT — Deciduous tree (trunk + fluffy canopy)
// ─────────────────────────────────────────────
export function CommentTreeIcon({ className, size = 20, count = 0 }: IconProps) {
  const { stage, color } = getEvolutionStage(count);

  // Stage 1 (0-99): Simple tree — small trunk + round canopy
  if (stage === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        {/* Trunk */}
        <path d="M12 22V12" />
        {/* Canopy — simple round top */}
        <path d="M6 14c0-5 2.5-9 6-9s6 4 6 9" />
        <path d="M7 13c1-3 2.5-5 5-5s4 2 5 5" opacity={0.5} />
      </svg>
    );
  }

  // Stage 2 (100-999): Bigger tree with detail
  if (stage === 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        {/* Trunk */}
        <path d="M12 22V10" />
        {/* Main canopy */}
        <path d="M4 13c0-6 3.5-10 8-10s8 4 8 10" />
        <path d="M6 12c1-4 3-7 6-7s5 3 6 7" opacity={0.5} />
        {/* Small trunk texture */}
        <path d="M10 16c.5-.5 1-.8 2-.8s1.5.3 2 .8" opacity={0.35} />
      </svg>
    );
  }

  // Stage 3+: Full deciduous tree with lush canopy
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Trunk */}
      <path d="M12 22V8" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      {/* Canopy layers — fluffy round shape */}
      <path d="M3 12.5C3 6 6.5 2 12 2s9 4 9 10.5" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <path d="M5 12c1-4.5 3.5-7.5 7-7.5s6 3 7 7.5" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.7} />
      <path d="M7 11.5c1-3 3-5 5-5s4 2 5 5" stroke={color} strokeWidth={1} strokeLinecap="round" opacity={0.5} />
      {/* Trunk texture lines */}
      <path d="M10 14c.5-.5 1.2-.8 2-.8s1.5.3 2 .8" stroke={color} strokeWidth={0.8} opacity={0.35} />
      <path d="M10 17c.5-.4 1-.6 2-.6s1.5.2 2 .6" stroke={color} strokeWidth={0.8} opacity={0.3} />
      {/* Extra lush for higher stages */}
      {stage >= 4 && <path d="M4 13c2-1 3.5-.5 4.5.5" stroke={color} strokeWidth={0.8} opacity={0.3} />}
      {stage >= 5 && <path d="M20 13c-2-1-3.5-.5-4.5.5" stroke={color} strokeWidth={0.8} opacity={0.3} />}
      {stage >= 6 && <circle cx="12" cy="5" r="1.2" fill={color} opacity={0.3} />}
      {stage >= 7 && <path d="M8 9c1.5-.5 3-.3 4 0s2.5-.2 4 0" stroke={color} strokeWidth={0.7} opacity={0.25} />}
    </svg>
  );
}

// ─────────────────────────────────────────────
// 3. SHARE — Mountain/tree silhouette (keep)
// ─────────────────────────────────────────────
export function ShareRootIcon({ className, size = 20, count = 0 }: IconProps) {
  const { stage, color } = getEvolutionStage(count);

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l10 18H2L12 2z" />
      <path d="M12 7l5 10H7l5-10z" opacity={0.35} />
      {stage >= 3 && <path d="M4 20l4-7 3 4" opacity={0.4} />}
      {stage >= 5 && <path d="M20 20l-4-7-3 4" opacity={0.4} />}
      {stage >= 4 && <circle cx="12" cy="5" r="0.7" fill={color} opacity={0.3} />}
      {stage >= 6 && <circle cx="8" cy="14" r="0.5" fill={color} opacity={0.25} />}
      {stage >= 7 && <circle cx="16" cy="14" r="0.5" fill={color} opacity={0.25} />}
    </svg>
  );
}

// ─────────────────────────────────────────────
// 4. SAVE — Stump with roots (tree stump + spreading roots)
// ─────────────────────────────────────────────
export function SaveSeedIcon({ className, size = 20, count = 0, active = false }: IconProps) {
  const { stage, color } = getEvolutionStage(count);
  const strokeColor = active ? '#5F7A61' : color;
  const fillColor = active ? 'rgba(95, 122, 97, 0.1)' : 'none';

  // Stage 1 (0-99): Simple stump with roots
  if (stage === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fillColor} className={className} stroke={strokeColor} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        {/* Stump top */}
        <ellipse cx="12" cy="6" rx="5" ry="2" />
        {/* Stump sides */}
        <path d="M7 6v8c0 1.5 1 2.5 2.5 2.5h5c1.5 0 2.5-1 2.5-2.5V6" />
        {/* Roots */}
        <path d="M9 16c-1 2-2.5 3-4.5 3.5" opacity={0.7} />
        <path d="M15 16c1 2 2.5 3 4.5 3.5" opacity={0.7} />
        <path d="M12 16.5v3" opacity={0.5} />
        {/* Ring line on top */}
        <ellipse cx="12" cy="6" rx="3" ry="1.2" opacity={0.4} />
      </svg>
    );
  }

  // Stage 2+: More detailed stump with spreading roots
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fillColor} className={className}>
      {/* Stump top */}
      <ellipse cx="12" cy="6" rx="5.5" ry="2" stroke={strokeColor} strokeWidth={1.4} />
      {/* Stump body */}
      <path d="M6.5 6v7.5c0 1.8 1.2 3 3 3h5c1.8 0 3-1.2 3-3V6" stroke={strokeColor} strokeWidth={1.4} strokeLinecap="round" />
      {/* Ring lines on top */}
      <ellipse cx="12" cy="6" rx="3.5" ry="1.3" stroke={strokeColor} strokeWidth={0.8} opacity={0.4} />
      <ellipse cx="12" cy="6" rx="1.8" ry="0.7" stroke={strokeColor} strokeWidth={0.6} opacity={0.3} />
      {/* Spreading roots */}
      <path d="M9 16.5c-1.2 1.5-2.5 2.8-4.5 3.2" stroke={strokeColor} strokeWidth={1.1} strokeLinecap="round" opacity={0.7} />
      <path d="M15 16.5c1.2 1.5 2.5 2.8 4.5 3.2" stroke={strokeColor} strokeWidth={1.1} strokeLinecap="round" opacity={0.7} />
      <path d="M12 16.5c0 1.5.3 3 1 4" stroke={strokeColor} strokeWidth={0.9} strokeLinecap="round" opacity={0.5} />
      <path d="M10.5 16c-.5 1.5-1.5 2.5-3 3.2" stroke={strokeColor} strokeWidth={0.8} strokeLinecap="round" opacity={0.4} />
      <path d="M13.5 16c.5 1.5 1.5 2.5 3 3.2" stroke={strokeColor} strokeWidth={0.8} strokeLinecap="round" opacity={0.4} />
      {/* Extra detail for higher stages */}
      {stage >= 3 && <path d="M7 10c1-.3 2-.2 3 0" stroke={strokeColor} strokeWidth={0.6} opacity={0.3} />}
      {stage >= 4 && <path d="M14 10c1-.3 2-.2 3 0" stroke={strokeColor} strokeWidth={0.6} opacity={0.3} />}
      {stage >= 5 && <circle cx="5" cy="20" r="0.6" fill={strokeColor} opacity={0.25} />}
      {stage >= 6 && <circle cx="19" cy="20" r="0.6" fill={strokeColor} opacity={0.25} />}
      {stage >= 7 && <path d="M12 8v5" stroke={strokeColor} strokeWidth={0.5} opacity={0.2} />}
    </svg>
  );
}

// ─────────────────────────────────────────────
// 5. RAIN DROPS — Elegant menu icon
// ─────────────────────────────────────────────
export function RainDropsIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5.5C8 7.4 6.7 9 5 9S2 7.4 2 5.5C2 3.6 5 0 5 0s3 3.6 3 5.5z" opacity={0.75} />
      <path d="M16 5.5C16 7.4 14.7 9 13 9s-3-1.6-3-3.5C10 3.6 13 0 13 0s3 3.6 3 5.5z" opacity={0.55} />
      <path d="M12 14.5c0 1.9-1.3 3.5-3 3.5s-3-1.6-3-3.5C6 12.6 9 9 9 9s3 3.6 3 5.5z" opacity={0.45} />
      <path d="M20 14.5c0 1.9-1.3 3.5-3 3.5s-3-1.6-3-3.5c0-1.9 3-5.5 3-5.5s3 3.6 3 5.5z" opacity={0.65} />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Header decoration — Small tree
// ─────────────────────────────────────────────
export function HeaderTreeIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V10" />
      <path d="M12 14c-3-1.5-5.5-1-8 .5" />
      <path d="M12 14c3-1.5 5.5-1 8 .5" />
      <path d="M12 10c-2.5-2-4-2.5-6.5-1.5" />
      <path d="M12 10c2.5-2 4-2.5 6.5-1.5" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" fillOpacity={0.12} />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Simple wrappers
// ─────────────────────────────────────────────
export function LeafIcon({ className, size = 20 }: IconProps) {
  return <LikeLeafIcon className={className} size={size} count={0} />;
}
export function TreeIcon({ className, size = 20 }: IconProps) {
  return <CommentTreeIcon className={className} size={size} count={0} />;
}
export function ShareIcon({ className, size = 20 }: IconProps) {
  return <ShareRootIcon className={className} size={size} count={0} />;
}
export function BookmarkIcon({ className, size = 20 }: IconProps) {
  return <SaveSeedIcon className={className} size={size} count={0} />;
}
export function ThreeDotsIcon({ className, size = 18 }: IconProps) {
  return <RainDropsIcon className={className} size={size} />;
}