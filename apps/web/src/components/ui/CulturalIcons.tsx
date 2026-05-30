'use client';

import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  size?: number;
}

/* ─────────── Home — Bangladeshi Rural Hut / Shapla (water lily) ─────────── */
export function HomeIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L2 10h3v10h6v-6h2v6h6V10h3L12 2z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" fill="none" />
      <path d="M8 22V12l4-3 4 3v10" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" fill="none" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" opacity={0.4} />
    </svg>
  );
}

/* ─────────── Explore — Compass with Bengali art styling ─────────── */
export function ExploreIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.5} />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      <path d="m15.5 8.5-5.2 2.3-2.3 5.2 5.2-2.3z" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ─────────── Create — Pen nib (like a quill/lotus) ─────────── */
export function CreateIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 19l7-7 3-3a2.8 2.8 0 000-4l-1-1a2.8 2.8 0 00-4 0L4 21v3h3l5-5z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" fill="none" />
      <path d="M15 5l4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

/* ─────────── Profile — Person silhouette ─────────── */
export function ProfileIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={1.5} />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

/* ─────────── More — Nakshi kantha geometric pattern ─────────── */
export function MoreIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth={1.4} />
      <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth={1.4} />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth={1.4} />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth={1.4} />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" opacity={0.3} />
      <circle cx="17" cy="17" r="1.5" fill="currentColor" opacity={0.3} />
    </svg>
  );
}

/* ─────────── Like — Leaf / পাতা (pata) ─────────── */
export function LeafIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 3-.3 4.2-1L12 22V2z"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M12 2c3 3 5 7 5 10s-2 7-5 10" stroke="currentColor" strokeWidth={1} opacity={0.5} />
      <path d="M12 6v12M9 10h6M8 14h8" stroke="currentColor" strokeWidth={0.8} opacity={0.3} strokeLinecap="round" />
    </svg>
  );
}

/* ─────────── Comment — Tree / গাছ (gach) ─────────── */
export function TreeIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3L6 10h3l-4 6h4v5h6v-5h4l-4-6h3L12 3z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" fill="none" />
      <path d="M12 10v11" stroke="currentColor" strokeWidth={1} opacity={0.4} />
    </svg>
  );
}

/* ─────────── Share ─ Share with flowing lines ─────────── */
export function ShareIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth={1.4} />
      <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth={1.4} />
      <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth={1.4} />
      <path d="M8.5 10.5l6.5-4M8.5 13.5l6.5 4" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

/* ─────────── Bookmark ─ Lotus-tipped bookmark ─────────── */
export function BookmarkIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 3h12v18l-6-4-6 4V3z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" fill="none" />
      <path d="M9 3c0 1.5 1.3 2.5 3 2.5S15 4.5 15 3" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
    </svg>
  );
}

/* ─────────── Tree (decorative header icon) ─────────── */
export function HeaderTreeIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth={1.3} />
      <path d="M12 13v7M9 17h6" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
      <circle cx="10" cy="7" r="1" fill="currentColor" opacity={0.3} />
      <circle cx="14" cy="7" r="1" fill="currentColor" opacity={0.3} />
    </svg>
  );
}

/* ─────────── Bondhu Logo — Bengali 'ব' in rounded square ─────────── */
export function BondhuLogo({ className, size = 32 }: IconProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl text-white font-bold',
        className
      )}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #A78BFA 0%, #5EEAD4 100%)',
        fontSize: size * 0.55,
        fontFamily: 'var(--font-bangla)',
      }}
    >
      ব
    </div>
  );
}

/* ─────────── Shop icon ─────────── */
export function ShopIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 7h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M3 7l2-4h14l2 4" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13h6" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" opacity={0.4} />
    </svg>
  );
}

/* ─────────── Jobs icon ─────────── */
export function JobsIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth={1.4} />
      <path d="M9 5V3.5a1 1 0 011-1h4a1 1 0 011 1V5" stroke="currentColor" strokeWidth={1.4} />
      <path d="M12 11v4M10 13h4" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
}

/* ─────────── Bazaar icon (basket) ─────────── */
export function BazaarIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 9h16l-1.5 9H5.5L4 9z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M8 9V6a2 2 0 012-2h4a2 2 0 012 2v3" stroke="currentColor" strokeWidth={1.4} />
      <path d="M9 13v3M12 13v3M15 13v3" stroke="currentColor" strokeWidth={1} strokeLinecap="round" opacity={0.4} />
    </svg>
  );
}

/* ─────────── Adda icon (tea cups) ─────────── */
export function AddaIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 8h10v6a4 4 0 01-4 4H9a4 4 0 01-4-4V8z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M15 10h3a2 2 0 010 4h-3" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M8 4c0 1 1 2 2 2s2-1 2-2" stroke="currentColor" strokeWidth={1} strokeLinecap="round" opacity={0.5} />
    </svg>
  );
}

/* ─────────── Cricket icon ─────────── */
export function CricketIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={1.3} strokeDasharray="3 2" />
      <path d="M12 4v3M12 17v3M4 12h3M17 12h3" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth={1.3} />
    </svg>
  );
}

/* ─────────── Leaderboard / Trophy ─────────── */
export function LeaderboardIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8 21h8M10 21V14h4v7" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 7a2 2 0 012-2h8a2 2 0 012 2v1a4 4 0 01-4 4h-4a4 4 0 01-4-4V7z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M12 2v3" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

/* ─────────── Settings / Gear ─────────── */
export function SettingsIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={1.4} />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─────────── SOS / Emergency ─────────── */
export function SOSIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.4} />
      <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

/* ─────────── Search icon ─────────── */
export function SearchIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={1.4} />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

/* ─────────── Three dots menu ─────────── */
export function ThreeDotsIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

/* ─────────── News icon ─────────── */
export function NewsIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth={1.4} />
      <path d="M7 8h4M7 12h10M7 16h6" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
}
