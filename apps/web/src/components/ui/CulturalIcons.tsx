'use client';

import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  size?: number;
}

/* ════════════════════════════════════════════
   1. BONDHU LOGO — Bengali 'ব' in green/teal rounded square
   ════════════════════════════════════════════ */
export function BondhuLogo({ className, size = 30 }: IconProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl bg-[#E2F2EE] p-2 shrink-0 select-none',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2E7D6B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 4h12v4L6 14h12v6H6" />
        <path d="M18 8v12" />
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════
   2. HOME — Bangladeshi Rural Hut / Gate
   ════════════════════════════════════════════ */
export function HomeIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8v10" />
      <path d="M18 8v10" />
      <path d="M4 8c0-2 2.5-4 8-4s8 2 8 4" />
      <circle cx="12" cy="3.5" r="1" fill="currentColor" stroke="none" />
      <path d="M4 8h16" />
      <path d="M3 18h18" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   3. HOME TAB — Grid-style home tab icon
   ════════════════════════════════════════════ */
export function HomeTabIcon({ className, size = 22 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
      <path d="M15 21V9" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   4. EXPLORE — Compass in circle
   ════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════
   5. CREATE — Pen/pencil
   ════════════════════════════════════════════ */
export function CreateIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3-3a2 2 0 000-3l-1-1a2 2 0 00-3 0L8 15l-4 4h4z" />
      <path d="M15 5l4 4" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   6. PROFILE — Simple person silhouette
   ════════════════════════════════════════════ */
export function ProfileIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   7. MORE — Mandala / Geometric Pattern
   ════════════════════════════════════════════ */
export function MoreIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l9 9-9 9-9-9z" />
      <path d="M12 7l5 5-5 5-5-5z" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M3 12h5M16 12h5M12 3v5M12 16v5" opacity={0.5} />
    </svg>
  );
}

/* ════════════════════════════════════════════
   8. LIKE — Elegant Leaf (matches reference)
   ════════════════════════════════════════════ */
export function LeafIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z" />
      <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   9. COMMENT — Deciduous tree with fluffy canopy
   ════════════════════════════════════════════ */
export function TreeIcon({ className, size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22V12" />
      <path d="M12 12c-2-1-4-1-5-3s0-4 2-4 3 2 3 4" />
      <path d="M12 12c2-1 4-1 5-3s0-4-2-4-3 2-3 4" />
      <path d="M12 9c-1.5-1.5-2.5-3.5-1-5.5s3.5 0 3.5 2.5" />
      <path d="M7 16c-1-1.5-1-3.5 1-4.5s3.5.5 3.5 2.5" />
      <path d="M17 16c1-1.5 1-3.5-1-4.5s-3.5.5-3.5 2.5" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   10. SHARE — Three connected nodes
   ════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════
   11. BOOKMARK — Simple ribbon
   ════════════════════════════════════════════ */
export function BookmarkIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v18l-6-4-6 4V3z" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   12. HEADER TREE — Decorative banyan
   ════════════════════════════════════════════ */
export function HeaderTreeIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V10" />
      <path d="M12 14c-3-1-6-1-9 1" />
      <path d="M12 14c3-1 6-1 9 1" />
      <path d="M12 10c-2.5-1.5-5-2-7-1" />
      <path d="M12 10c2.5-1.5 5-2 7-1" />
      <path d="M12 6c-2-1-3.5-1-5 0" />
      <path d="M12 6c2-1 3.5-1 5 0" />
      <circle cx="12" cy="4" r="1.5" fill="currentColor" fillOpacity={0.2} />
    </svg>
  );
}

/* ════════════════════════════════════════════
   13. SEARCH — Magnifying glass
   ════════════════════════════════════════════ */
export function SearchIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   14. SETTINGS — Gear
   ════════════════════════════════════════════ */
export function SettingsIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   15. THREE DOTS — Menu
   ════════════════════════════════════════════ */
export function ThreeDotsIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   16. PLUS — Add icon
   ════════════════════════════════════════════ */
export function PlusIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   17. CLOSE — X icon
   ════════════════════════════════════════════ */
export function XIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   18. SHOP — Storefront
   ════════════════════════════════════════════ */
export function ShopIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      <path d="M3 7l2-3h14l2 3" />
      <path d="M9 14h6" opacity={0.4} />
    </svg>
  );
}

/* ════════════════════════════════════════════
   19. BAZAAR — Market basket
   ════════════════════════════════════════════ */
export function BazaarIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9c0-1.5 1.5-3 3-3h12c1.5 0 3 1.5 3 3v2c0 2-1.5 4-4 4s-4-2-4-4c0 2-1.5 4-4 4s-4-2-4-4V9h-2z" />
      <path d="M5 15v4c0 1 .5 2 2 2h10c1.5 0 2-1 2-2v-4" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   20. JOBS — Briefcase
   ════════════════════════════════════════════ */
export function JobsIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M8 6V4.5C8 3.7 8.7 3 9.5 3h5c.8 0 1.5.7 1.5 1.5V6" />
      <path d="M12 11v3M10 12.5h4" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   21. SPORT — Cricket ball
   ════════════════════════════════════════════ */
export function SportIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18" opacity={0.3} />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   22. LEADERBOARD — Trophy
   ════════════════════════════════════════════ */
export function LeaderboardIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M10 21V14h4v7" />
      <path d="M6 8a2 2 0 012-2h8a2 2 0 012 2v1a4 4 0 01-4 4h-4a4 4 0 01-4-4V8z" />
      <path d="M12 2v4" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   23. SOS — Alert circle
   ════════════════════════════════════════════ */
export function SOSIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   24. POINTS — Star coin
   ════════════════════════════════════════════ */
export function PointsIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7l1.5 3.5H17l-3 2.5 1 3.5-3-2.5-3 2.5 1-3.5-3-2.5h3.5z" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   25. RAIN DROPS — Menu icon
   ════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════
   26. CRICKET — Ball with seam
   ════════════════════════════════════════════ */
export function CricketIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.5 6.5l2 2M16.5 15.5l2 2M6.5 16.5l-2 2M15.5 5.5l2-2" />
      <path d="M12 8v8M8 12h8" opacity={0.3} />
    </svg>
  );
}

/* ════════════════════════════════════════════
   27. NEWS — Newspaper
   ════════════════════════════════════════════ */
export function NewsIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-4 0v-9h4" />
      <path d="M10 6h6M10 10h6M10 14h4" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   28. MEDAL — Award medal
   ════════════════════════════════════════════ */
export function MedalIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A5 5 0 0012 22a5 5 0 003.5-7.5" />
      <path d="M6 3h3l3 10 3-10h3M6 3l3 10M18 3l-3 10" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   29. CROWN — Royal crown
   ════════════════════════════════════════════ */
export function CrownIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18h18M4 18V8l4 3 4-6 4 6 4-3v10" />
      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   30. FIRE — Trending flame
   ════════════════════════════════════════════ */
export function FireIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c4-2 6-6 6-10 0-3-2-5-2-8-3 2-4 4-4 7 0 0-2-2-2-4-2 2-3 4-2 7 0 0-3-1-4-3 0 0-1 3 0 5s4 6 10 6z" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   31. TREND UP — Upward arrow
   ════════════════════════════════════════════ */
export function TrendUpIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 6l-9 9-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   32. TREND DOWN — Downward arrow
   ════════════════════════════════════════════ */
export function TrendDownIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 18l-9-9-5 5L1 6" />
      <path d="M17 18h6v-6" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   33. PHONE — Call icon
   ════════════════════════════════════════════ */
export function PhoneIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   34. ALERT TRIANGLE — Warning
   ════════════════════════════════════════════ */
export function AlertTriangle({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   35. ADDA ICON — Community/Tong
   ════════════════════════════════════════════ */
export function AddaIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zM6 2v3M10 2v3M14 2v3" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   BACKWARD COMPATIBILITY ALIASES
   ════════════════════════════════════════════ */
export { XIcon as X };

/* ════════════════════════════════════════════
   LEGACY: Re-export from lucide-react for compatibility
   ════════════════════════════════════════════ */
export { Briefcase as BriefcaseIcon, MapPin as MapPinIcon, Clock as ClockIcon, CheckCircle2 as CheckCircleIcon } from 'lucide-react';
