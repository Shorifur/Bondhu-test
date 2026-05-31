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
  if (count >= 100)  return { stage: 2, color: '#7BA08A', glow: 'shadow-green-400/40', label: 'Fresh' };
  return { stage: 1, color: '#A3C4B2', glow: 'shadow-green-300/30', label: 'Sprout' };
}

const ACTIVE_RED = '#E85D75';
const ACTIVE_FILL = 'rgba(232, 93, 117, 0.12)';

// ─────────────────────────────────────────────
// 1. LIKE — Elegant leaf-heart hybrid
//    Fills warm red when liked
// ─────────────────────────────────────────────
export function LikeLeafIcon({ className, size = 20, count = 0, active = false }: IconProps) {
  const { stage, color } = getEvolutionStage(count);
  const strokeColor = active ? ACTIVE_RED : color;
  const fillColor = active ? ACTIVE_FILL : 'none';

  if (stage === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fillColor} className={className} stroke={strokeColor} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }

  if (stage === 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fillColor} className={className} stroke={strokeColor} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        <path d="M12 7v8" opacity={0.4} />
        <path d="M12 10c-1.5-.5-2.5-.3-3.5.2" opacity={0.3} />
        <path d="M12 10c1.5-.5 2.5-.3 3.5.2" opacity={0.3} />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fillColor} className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke={strokeColor} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6v10" stroke={strokeColor} strokeWidth={0.8} opacity={0.35} />
      <path d="M12 10c-1.8-.6-3-.4-4 .2" stroke={strokeColor} strokeWidth={0.7} opacity={0.25} />
      <path d="M12 10c1.8-.6 3-.4 4 .2" stroke={strokeColor} strokeWidth={0.7} opacity={0.25} />
      {stage >= 4 && <circle cx="7" cy="7" r="0.8" fill={strokeColor} opacity={0.3} />}
      {stage >= 5 && <circle cx="17" cy="7" r="0.8" fill={strokeColor} opacity={0.35} />}
      {stage >= 6 && <circle cx="12" cy="4" r="1" fill={strokeColor} opacity={0.4} />}
      {stage >= 7 && <circle cx="12" cy="18" r="0.6" fill={strokeColor} opacity={0.3} />}
    </svg>
  );
}

// ─────────────────────────────────────────────
// 2. COMMENT — Elegant tree (Y with roots)
// ─────────────────────────────────────────────
export function CommentTreeIcon({ className, size = 20, count = 0 }: IconProps) {
  const { stage, color } = getEvolutionStage(count);

  if (stage === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V10" />
        <path d="M12 10c-2-3-4-4-7-4" />
        <path d="M12 10c2-3 4-4 7-4" />
        <path d="M12 6c-1-2-2.5-3-4.5-3" opacity={0.4} />
        <path d="M12 6c1-2 2.5-3 4.5-3" opacity={0.4} />
      </svg>
    );
  }

  if (stage === 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V8" />
        <path d="M12 12c-2.5-2-5-2.5-8-1.5" />
        <path d="M12 12c2.5-2 5-2.5 8-1.5" />
        <path d="M12 8c-2-2.5-4-3-7-2" />
        <path d="M12 8c2-2.5 4-3 7-2" />
        <path d="M9 22c.5-1.5 1.5-2.5 3-2.5" opacity={0.4} />
        <path d="M15 22c-.5-1.5-1.5-2.5-3-2.5" opacity={0.4} />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 22V6" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <path d="M12 14c-3-2-6-2.5-9-1" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <path d="M12 14c3-2 6-2.5 9-1" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <path d="M12 10c-2.5-2.5-5-3-8.5-1.5" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
      <path d="M12 10c2.5-2.5 5-3 8.5-1.5" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
      <path d="M12 6c-2-1.5-3.5-1.5-5-.5" stroke={color} strokeWidth={1.1} strokeLinecap="round" opacity={0.7} />
      <path d="M12 6c2-1.5 3.5-1.5 5-.5" stroke={color} strokeWidth={1.1} strokeLinecap="round" opacity={0.7} />
      {stage >= 3 && <path d="M8 18v-3c0-1.5-1.5-2.5-3-2.5" stroke={color} strokeWidth={0.9} strokeLinecap="round" opacity={0.4} />}
      {stage >= 3 && <path d="M16 18v-3c0 1.5 1.5 2.5 3 2.5" stroke={color} strokeWidth={0.9} strokeLinecap="round" opacity={0.4} />}
      {stage >= 4 && <circle cx="5" cy="11" r="0.9" fill={color} opacity={0.25} />}
      {stage >= 5 && <circle cx="19" cy="11" r="0.9" fill={color} opacity={0.3} />}
      {stage >= 6 && <circle cx="12" cy="4" r="1.2" fill={color} opacity={0.35} />}
      {stage >= 7 && <path d="M6 14c1.2 1 2.2 1 3.5 0" stroke={color} strokeWidth={0.7} opacity={0.3} />}
    </svg>
  );
}

// ─────────────────────────────────────────────
// 3. SHARE — Mountain/tree silhouette
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
// 4. SAVE — Seed/sprout
// ─────────────────────────────────────────────
export function SaveSeedIcon({ className, size = 20, count = 0, active = false }: IconProps) {
  const { stage, color } = getEvolutionStage(count);
  const strokeColor = active ? '#5F7A61' : color;
  const fillColor = active ? 'rgba(95, 122, 97, 0.1)' : 'none';

  if (stage === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fillColor} className={className} stroke={strokeColor} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="18" rx="4" ry="5" />
        {active && <path d="M12 13V8M10 10l2-2 2 2" opacity={0.6} />}
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fillColor} className={className}>
      <ellipse cx="12" cy="20" rx="3.5" ry="3" stroke={strokeColor} strokeWidth={1.4} />
      <path d="M12 17V9" stroke={strokeColor} strokeWidth={1.3} strokeLinecap="round" />
      <path d="M12 12c-1.5-1.5-3-1.5-4-.5" stroke={strokeColor} strokeWidth={1.1} strokeLinecap="round" opacity={0.7} />
      <path d="M12 12c1.5-1.5 3-1.5 4-.5" stroke={strokeColor} strokeWidth={1.1} strokeLinecap="round" opacity={0.7} />
      {stage >= 3 && <path d="M12 9c-1.2-1-2.5-1-3.5-.5" stroke={strokeColor} strokeWidth={0.9} strokeLinecap="round" opacity={0.5} />}
      {stage >= 3 && <path d="M12 9c1.2-1 2.5-1 3.5-.5" stroke={strokeColor} strokeWidth={0.9} strokeLinecap="round" opacity={0.5} />}
      {stage >= 4 && <circle cx="12" cy="7" r="1" fill={strokeColor} opacity={0.3} />}
      {stage >= 5 && <circle cx="9" cy="10" r="0.6" fill={strokeColor} opacity={0.25} />}
      {stage >= 6 && <circle cx="15" cy="10" r="0.6" fill={strokeColor} opacity={0.25} />}
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
      <path d="M12 22V9" />
      <path d="M12 13c-2.5-1.5-5-2-8-1" />
      <path d="M12 13c2.5-1.5 5-2 8-1" />
      <path d="M12 9c-2-2-4-2.5-6.5-1.5" />
      <path d="M12 9c2-2 4-2.5 6.5-1.5" />
      <circle cx="12" cy="5" r="1.5" fill="currentColor" fillOpacity={0.12} />
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