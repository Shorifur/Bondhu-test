'use client';

import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  size?: number;
}

/* ─────────── Home — Bengali Rural Hut (Ghor) ─────────── */
export function HomeIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5V21h6v-6h6v6h6V10.5" />
      <path d="M1 12l11-9.5L23 12" />
      <path d="M9 21V13h6v8" />
      <rect x="10" y="15" width="4" height="6" rx="0.5" fill="currentColor" fillOpacity={0.15} />
    </svg>
  );
}

/* ─────────── Explore — Compass with geometric border ─────────── */
export function ExploreIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" strokeWidth={1.2} />
      <path d="m15.5 8.5-5.2 2.3-2.3 5.2 5.2-2.3z" fill="currentColor" fillOpacity={0.15} />
    </svg>
  );
}

/* ─────────── Create — Lotus (Padma) with pen nib ─────────── */
export function CreateIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9 5 8 8 8 10c0 2.5 1.8 4.5 4 4.5s4-2 4-4.5c0-2-1-5-4-8z" />
      <path d="M12 14.5v7M10 18h4" />
      <path d="M7 8c-2 1-4 3-4 5.5 0 2.5 2 4 4 4" />
      <path d="M17 8c2 1 4 3 4 5.5 0 2.5-2 4-4 4" />
      <path d="M12 14.5c-3 0-5.5-2-5.5-4.5" />
      <path d="M12 14.5c3 0 5.5-2 5.5-4.5" />
    </svg>
  );
}

/* ─────────── Profile — Human silhouette with Bengali border ─────────── */
export function ProfileIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

/* ─────────── More — Nakshi Kantha geometric cross pattern ─────────── */
export function MoreIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
      <circle cx="7" cy="7" r="1.2" fill="currentColor" fillOpacity={0.25} />
      <circle cx="17" cy="17" r="1.2" fill="currentColor" fillOpacity={0.25} />
      <path d="M12 7v4M7 12h4M13 12h4M12 13v4" strokeWidth={1} opacity={0.3} />
    </svg>
  );
}

/* ─────────── Like — Leaf / পাতা (pata) ─────────── */
export function LeafIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.5 4 3 8.5 3 13.5 3 18.5 6.5 22 12 22s9-3.5 9-8.5C21 8.5 17.5 4 12 2z" />
      <path d="M12 22V8" />
      <path d="M12 14c-2.5-1-4-3-4-5.5" />
      <path d="M12 11c2.5-1 4-3 4-5.5" />
    </svg>
  );
}

/* ─────────── HeaderTree — Decorative banyan tree for post header ─────────── */
export function HeaderTreeIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" />
      <path d="M12 12c-1.5-3-4.5-5-8-5" />
      <path d="M12 12c1.5-3 4.5-5 8-5" />
      <path d="M12 8c-1-2.5-3-4.5-6-5" />
      <path d="M12 8c1-2.5 3-4.5 6-5" />
      <path d="M12 16c-2-1.5-5-2-8-1" />
      <path d="M12 16c2-1.5 5-2 8-1" />
      <path d="M10 22h4" />
    </svg>
  );
}

/* ─────────── Comment — Banyan tree / বটগাছ ─────────── */
export function TreeIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3C7 5 4 9 4 13c0 3 2 5.5 5 6.5" />
      <path d="M12 3c5 2 8 6 8 10 0 3-2 5.5-5 6.5" />
      <path d="M6 12h12" />
      <path d="M12 19.5V22" />
      <path d="M9 22h6" />
      <path d="M12 8v7" opacity={0.4} />
    </svg>
  );
}

/* ─────────── Share — Three connected dots with Bengali curves ─────────── */
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

/* ─────────── Bookmark with lotus petal tip ─────────── */
export function BookmarkIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v18l-6-4-6 4V3z" />
      <path d="M9 3c0 1.5 1.3 2.5 3 2.5S15 4.5 15 3" opacity={0.5} />
    </svg>
  );
}

/* ─────────── Shop — Bengali market stall ─────────── */
export function ShopIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7c0-1 1-2 2-2h14c1 0 2 1 2 2v2c0 2-1.5 3.5-3.5 3.5S14 11 14 9c0 2-1.5 3.5-3.5 3.5S7 11 7 9c0 2-1.5 3.5-3.5 3.5S0 11 0 9V7h3z" />
      <path d="M4 12.5V20c0 1 .5 2 2 2h12c1.5 0 2-1 2-2v-7.5" />
      <path d="M9 14h6" opacity={0.4} />
    </svg>
  );
}

/* ─────────── Job — Bengali dokan sign board ─────────── */
export function JobsIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 5V3.5C8 2.7 8.7 2 9.5 2h5c.8 0 1.5.7 1.5 1.5V5" />
      <path d="M12 10v5M10 12.5h4" />
      <circle cx="16" cy="10" r="1" fill="currentColor" fillOpacity={0.3} />
    </svg>
  );
}

/* ─────────── Bazaar — Haat (rural market) ─────────── */
export function BazaarIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9c0-1 1-2 2-2h16c1 0 2 1 2 2v2c0 2-1.5 3-3 3s-3-1-3-3c0 2-1.5 3-3 3s-3-1-3-3c0 2-1.5 3-3 3s-3-1-3-3V9z" />
      <path d="M5 14v7c0 1 .5 2 2 2h10c1.5 0 2-1 2-2v-7" />
      <path d="M8 21V14M16 21V14" opacity={0.4} />
      <circle cx="9" cy="17" r="1" fill="currentColor" fillOpacity={0.2} />
      <circle cx="15" cy="17" r="1" fill="currentColor" fillOpacity={0.2} />
    </svg>
  );
}

/* ─────────── Adda — Tea cups ─────────── */
export function AddaIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12v5a4 4 0 01-4 4H8a4 4 0 01-4-4v-5z" />
      <path d="M16 12h3a2 2 0 010 4h-3" />
      <path d="M8 4c0 1.5 1.3 2.5 3 2.5S14 5.5 14 4" opacity={0.5} />
      <path d="M10 21h4" />
    </svg>
  );
}

/* ─────────── Cricket — Bat and ball ─────────── */
export function CricketIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20l12-12" />
      <path d="M14 6l4 4" />
      <path d="M3 21l3-3" />
      <circle cx="19" cy="5" r="3" />
      <path d="M12 14l-2 2" opacity={0.4} />
    </svg>
  );
}

/* ─────────── Sport — Stadium silhouette ─────────── */
export function SportIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c0-5.5 4.5-10 10-10s10 4.5 10 10" />
      <path d="M2 12h20" />
      <path d="M4 12v6c0 1 .5 2 2 2h12c1.5 0 2-1 2-2v-6" />
      <path d="M8 20v-4h8v4" />
      <circle cx="12" cy="8" r="2" fill="currentColor" fillOpacity={0.15} />
    </svg>
  );
}

/* ─────────── Leaderboard — Trophy with Shapla ─────────── */
export function LeaderboardIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M10 21V14h4v7" />
      <path d="M6 7a2 2 0 012-2h8a2 2 0 012 2v1a4 4 0 01-4 4h-4a4 4 0 01-4-4V7z" />
      <path d="M12 2v3" />
      <path d="M12 2c-1 1.5-2.5 2-4 2M12 2c1 1.5 2.5 2 4 2" opacity={0.4} />
    </svg>
  );
}

/* ─────────── Settings — Gear ─────────── */
export function SettingsIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

/* ─────────── SOS — Hand raised with radiating lines ─────────── */
export function SOSIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.2 16.2l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.2 7.8l2.8-2.8" opacity={0.4} />
      <path d="M14 7v8.5c0 1.5-1 2.5-2.5 2.5S9 17 9 15.5V7c0-1 .8-2 2-2s2 1 2 2z" fill="currentColor" fillOpacity={0.1} />
      <path d="M14 7v8.5c0 1.5-1 2.5-2.5 2.5S9 17 9 15.5V7c0-1 .8-2 2-2s2 1 2 2z" />
      <path d="M9 10H7c-.5 0-1 .5-1 1v3c0 .5.5 1 1 1h2" />
    </svg>
  );
}

/* ─────────── Points — Shapla (water lily) in circle ─────────── */
export function PointsIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 5c-2.5 2-3.5 5-3.5 7.5 0 2 1 3.5 3.5 3.5s3.5-1.5 3.5-3.5C15.5 10 14.5 7 12 5z" />
      <path d="M12 16V5" opacity={0.4} />
      <path d="M12 16c-2 0-3.8-1.2-4.5-3" />
      <path d="M12 16c2 0 3.8-1.2 4.5-3" />
    </svg>
  );
}

/* ─────────── Bondhu Logo — Bengali 'ব' in gradient square ─────────── */
export function BondhuLogo({ className, size = 32 }: IconProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl text-white font-bold shrink-0 select-none',
        className
      )}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #A78BFA 0%, #5EEAD4 100%)',
        fontSize: size * 0.5,
        fontFamily: 'var(--font-bangla), "Noto Sans Bengali", sans-serif',
      }}
    >
      ব
    </div>
  );
}

/* ─────────── Search icon ─────────── */
export function SearchIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h4M7 12h10M7 16h6" />
    </svg>
  );
}

/* ─────────── Send icon ─────────── */
export function SendIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

/* ─────────── Adventure/Adventure icon ─────────── */
export function AdventureIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

/* ─────────── Heart filled icon ─────────── */
export function HeartFilledIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

/* ─────────── Trending up icon ─────────── */
export function TrendUpIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

/* ─────────── Trend down icon ─────────── */
export function TrendDownIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

/* ─────────── Fire streak icon ─────────── */
export function FireIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  );
}

/* ─────────── Medal/Rank badge icon ─────────── */
export function MedalIcon({ className, size = 20, rank = 1 }: IconProps & { rank?: number }) {
  const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const color = colors[rank - 1] || '#A78BFA';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="9" r="6" stroke={color} strokeWidth={1.5} />
      <path d="M8 13l-3 9 7-4 7 4-3-9" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <text x="12" y="11.5" textAnchor="middle" fill={color} fontSize="8" fontWeight="bold">{rank}</text>
    </svg>
  );
}

/* ─────────── Map pin icon ─────────── */
export function MapPinIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* ─────────── Phone/call icon ─────────── */
export function PhoneIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

/* ─────────── Crown icon for Legend rank ─────────── */
export function CrownIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

/* ─────────── Check circle icon ─────────── */
export function CheckCircleIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/* ─────────── Clock icon ─────────── */
export function ClockIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

/* ─────────── Taka currency icon (৳) ─────────── */
export function TakaIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <text x="4" y="19" fontSize="20" fontWeight="600" fontFamily="system-ui">৳</text>
    </svg>
  );
}
