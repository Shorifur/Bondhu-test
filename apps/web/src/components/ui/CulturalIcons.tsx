'use client';

import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  size?: number;
}

/* ─────────── HOME — Bangladeshi Rural Hut / Gate ───────────
   Matches reference: hut-like structure with pillars and curved roof
*/
export function HomeIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {/* Two pillars */}
      <path d="M6 8v10" />
      <path d="M18 8v10" />
      {/* Roof arch */}
      <path d="M4 8c0-2 2.5-4 8-4s8 2 8 4" />
      {/* Top decoration */}
      <circle cx="12" cy="3.5" r="1" fill="currentColor" stroke="none" />
      {/* Cross beam */}
      <path d="M4 8h16" />
      {/* Base */}
      <path d="M3 18h18" />
    </svg>
  );
}

/* ─────────── EXPLORE — Compass in circle ───────────
   Matches reference: thin compass with needle inside circle
*/
export function ExploreIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M12 6v2M12 16v2M6 12h2M16 12h2" strokeWidth={1} opacity={0.4} />
      <path d="m15 9-4 2-2 4 4-2z" />
    </svg>
  );
}

/* ─────────── CREATE — Pen/pencil ───────────
   Matches reference: simple pen/pencil icon
*/
export function CreateIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3-3a2 2 0 000-3l-1-1a2 2 0 00-3 0L8 15l-4 4h4z" />
      <path d="M15 5l4 4" />
    </svg>
  );
}

/* ─────────── PROFILE — Simple person silhouette ───────────
   Matches reference: clean human outline
*/
export function ProfileIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

/* ─────────── MORE — Mandala / Geometric Pattern ───────────
   Matches reference: 4-fold symmetric geometric pattern
*/
export function MoreIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {/* Outer diamond */}
      <path d="M12 3l9 9-9 9-9-9z" />
      {/* Inner diamond */}
      <path d="M12 7l5 5-5 5-5-5z" />
      {/* Center dot */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      {/* Cross lines */}
      <path d="M3 12h5M16 12h5M12 3v5M12 16v5" opacity={0.5} />
    </svg>
  );
}

/* ─────────── LIKE — Simple Leaf / পাতা ───────────
   Matches reference: thin elegant leaf shape
*/
export function LeafIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6 4 3 8.5 3 13s4 9 9 9c.8 0 1.5-.1 2.2-.3L12 22V2z" />
      <path d="M12 22V8" />
      <path d="M12 14c-2.5-1-4-3-4-5.5" opacity={0.5} />
      <path d="M12 11c2.5-1 4-3 4-5.5" opacity={0.5} />
    </svg>
  );
}

/* ─────────── COMMENT — Tree with roots / বটগাছ ───────────
   Matches reference: tree with wide canopy and visible roots
*/
export function TreeIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {/* Canopy */}
      <path d="M12 3C7 5 4 9 4 13c0 3 2 5 4 6" />
      <path d="M12 3c5 2 8 6 8 10 0 3-2 5-4 6" />
      {/* Horizontal branch line */}
      <path d="M6 12h12" opacity={0.4} />
      {/* Trunk */}
      <path d="M12 19v3" />
      {/* Roots */}
      <path d="M9 22c1-1.5 2-2 3-2s2 .5 3 2" />
    </svg>
  );
}

/* ─────────── SHARE — Three connected nodes ───────────
   Matches reference: three dots connected by lines
*/
export function ShareIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M8.5 10.5l6-3" />
      <path d="M8.5 13.5l6 3" />
    </svg>
  );
}

/* ─────────── BOOKMARK — Simple ribbon ───────────
   Matches reference: clean bookmark shape
*/
export function BookmarkIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v18l-6-4-6 4V3z" />
    </svg>
  );
}

/* ─────────── HEADER TREE — Decorative banyan tree ───────────
   Top right decoration on each post card
*/
export function HeaderTreeIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      {/* Trunk */}
      <path d="M12 22V10" />
      {/* Main branches */}
      <path d="M12 14c-3-1-6-1-9 1" />
      <path d="M12 14c3-1 6-1 9 1" />
      <path d="M12 10c-2.5-1.5-5-2-7-1" />
      <path d="M12 10c2.5-1.5 5-2 7-1" />
      <path d="M12 6c-2-1-3.5-1-5 0" />
      <path d="M12 6c2-1 3.5-1 5 0" />
      {/* Top detail */}
      <circle cx="12" cy="4" r="1.5" fill="currentColor" fillOpacity={0.2} />
    </svg>
  );
}

/* ─────────── BONDHU LOGO — Bengali 'ব' ───────────
   Simple gradient square with ব character
*/
export function BondhuLogo({ className, size = 30 }: IconProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg text-white font-bold shrink-0 select-none',
        className
      )}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #A78BFA 0%, #5EEAD4 100%)',
        fontSize: size * 0.45,
        fontFamily: 'var(--font-bangla), "Noto Sans Bengali", sans-serif',
      }}
    >
      ব
    </div>
  );
}

/* ─────────── SEARCH — Magnifying glass ─────────── */
export function SearchIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

/* ─────────── SETTINGS — Gear ─────────── */
export function SettingsIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

/* ─────────── THREE DOTS menu ─────────── */
export function ThreeDotsIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

/* ─────────── Plus/Add icon ─────────── */
export function PlusIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/* ─────────── X / Close icon ─────────── */
export function X({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* ─────────── Shop icon ─────────── */
export function ShopIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      <path d="M3 7l2-3h14l2 3" />
      <path d="M9 14h6" opacity={0.4} />
    </svg>
  );
}

/* ─────────── Bazaar icon ─────────── */
export function BazaarIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9c0-1.5 1.5-3 3-3h12c1.5 0 3 1.5 3 3v2c0 2-1.5 4-4 4s-4-2-4-4c0 2-1.5 4-4 4s-4-2-4-4V9h-2z" />
      <path d="M5 15v4c0 1 .5 2 2 2h10c1.5 0 2-1 2-2v-4" />
    </svg>
  );
}

/* ─────────── Jobs icon ─────────── */
export function JobsIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M8 6V4.5C8 3.7 8.7 3 9.5 3h5c.8 0 1.5.7 1.5 1.5V6" />
      <path d="M12 11v3M10 12.5h4" />
    </svg>
  );
}

/* ─────────── Sport icon ─────────── */
export function SportIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18" opacity={0.3} />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

/* ─────────── Leaderboard/Trophy icon ─────────── */
export function LeaderboardIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M10 21V14h4v7" />
      <path d="M6 8a2 2 0 012-2h8a2 2 0 012 2v1a4 4 0 01-4 4h-4a4 4 0 01-4-4V8z" />
      <path d="M12 2v4" />
    </svg>
  );
}

/* ─────────── SOS icon ─────────── */
export function SOSIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

/* ─────────── Points/Shapla icon ─────────── */
export function PointsIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 5c-2.5 2-3.5 5-3.5 7.5 0 2 1 3.5 3.5 3.5s3.5-1.5 3.5-3.5C15.5 10 14.5 7 12 5z" />
      <path d="M12 16V5" opacity={0.4} />
    </svg>
  );
}

/* ─────────── Adda/Tea icon ─────────── */
export function AddaIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 10h12v5a4 4 0 01-4 4H9a4 4 0 01-4-4v-5z" />
      <path d="M17 12h3a2 2 0 010 4h-3" />
      <path d="M8 4c0 1.5 1.3 2.5 3 2.5S14 5.5 14 4" opacity={0.5} />
    </svg>
  );
}

/* ─────────── Cricket icon ─────────── */
export function CricketIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M4 20l12-12" />
      <path d="M14 6l4 4" />
      <circle cx="19" cy="5" r="3" />
    </svg>
  );
}

/* ─────────── Phone icon ─────────── */
export function PhoneIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

/* ─────────── Map pin icon ─────────── */
export function MapPinIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* ─────────── Clock icon ─────────── */
export function ClockIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

/* ─────────── Globe icon ─────────── */
export function GlobeIcon({ className, size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />
    </svg>
  );
}

/* ─────────── News icon ─────────── */
export function NewsIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h4M7 12h10M7 16h6" />
    </svg>
  );
}

/* ─────────── Crown icon ─────────── */
export function CrownIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

/* ─────────── CheckCircle icon ─────────── */
export function CheckCircleIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/* ─────────── Verified icon ─────────── */
export function VerifiedIcon({ className, size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/* ─────────── Verified Badge (filled) ─────────── */
export function VerifiedBadge({ className, size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#3B82F6" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ─────────── Fire streak icon ─────────── */
export function FireIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  );
}

/* ─────────── Trend Up icon ─────────── */
export function TrendUpIcon({ className, size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

/* ─────────── Trend Down icon ─────────── */
export function TrendDownIcon({ className, size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

/* ─────────── Adventure/Airplane icon ─────────── */
export function AdventureIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20" opacity={0.3} />
      <path d="M2 12l3-7 4 7-4 7z" />
      <path d="M20 12l-3-7-4 7 4 7z" />
    </svg>
  );
}
