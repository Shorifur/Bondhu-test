# Bondhu App — Launch Checklist

## Build Status
- [x] `cd apps/api && npx tsc --project tsconfig.build.json` — PASSES
- [x] `cd apps/web && npx next build --no-lint` — PASSES

---

## Features Implemented

### Part 1: Bangladesh-Specific Features
| Feature | Status | Notes |
|---------|--------|-------|
| District/Upazila System | ✅ | 64 districts seeded, schema supports district/sub-district on profiles/posts |
| Language & Bangla Support | ✅ | AppLanguage enum (BANGLA/ENGLISH/BANGLISH), Bengali date utility created |
| Adda Corner (আড্ডা কর্নার) | ✅ | `/adda` page, Redis-based rooms, reactions, 2h expiry |
| Cricket Live Discussion | ✅ | `/cricket` page with Bangladesh flag theme, live score UI, reactions |
| Festival Themes | ✅ | Config file at `apps/web/src/lib/festivals.ts` with 7 major BD festivals |
| Local Bazaar (বাজার দর) | ✅ | `/bazaar` page, PriceReport table, trends by district |
| Bondhu Points Reward System | ✅ | Points log, level badges (নতুন বন্ধু → কিংবদন্তি), leaderboard API |
| Anti-Rumor / Fact Check Flag | ✅ | `rumor_flags` table, post `factCheckStatus`, 5+ flags triggers review |
| Emergency SOS | ✅ | SOS alerts table, trusted contacts, 1h location sharing |
| Job Board (চাকরি খুঁজুন) | ✅ | `/jobs` page, Jobs table, filter by category/district |

### Part 2: Community Fixes
| Fix | Status | Notes |
|-----|--------|-------|
| SECRETARY role added | ✅ | CommunityRole enum updated |
| Owner cannot leave | ✅ | Service throws "Transfer Ownership First" |
| Transfer ownership endpoint | ✅ | `POST /communities/:id/transfer-ownership` |
| Role badges on members | ✅ | Frontend shows OWNER/ADMIN/MODERATOR/SECRETARY/MEMBER badges |
| Rules tab | ✅ | Community rules displayed in `/communities/[slug]` |
| Posts tab | ✅ | Lists community posts |
| Members tab | ✅ | Lists members with role badges |

### Part 3: Sharing Fixes
| Fix | Status | Notes |
|-----|--------|-------|
| Repost Instantly | ✅ | `POST /posts/:id/repost` |
| Quote Share | ✅ | Navigates to `/create?quote=postId` |
| Send via DM | ✅ | Navigates to `/chat?share=postId` |
| Post to Community | ✅ | Community picker modal + POST |
| Copy Link | ✅ | `navigator.clipboard.writeText` |
| Native Share | ✅ | `navigator.share` fallback to clipboard |
| Save Media | ✅ | Fetch blob + trigger download |
| Hide from Timeline | ✅ | `PATCH /posts/:id/hide` |

### Part 4: Create Post Modes
| Mode | Status | Notes |
|------|--------|-------|
| TEXT POST | ✅ | 500 char limit, Bold/Italic/@/# formatting, visibility selector |
| PHOTO/VIDEO | ✅ | Drag & drop / click upload, preview grid, caption, location |
| STORY (24h) | ✅ | Gradient background picker, text overlay, font size/color, music tag |
| REEL (short video) | ✅ | Video upload UI, caption, music tag, hashtags |
| GO LIVE | ✅ | Schedule form with "Coming Soon" badge |
| POLL | ✅ | 2-5 options, duration 1h-7d, public/followers toggle |
| FUNDRAISER | ✅ | Title, description, BDT goal, end date, beneficiary info |
| PUBLIC POLL | ✅ | Same as poll with PUBLIC visibility |

### Part 5: Shop Feature
| Feature | Status | Notes |
|---------|--------|-------|
| /shop browse | ✅ | Grid with search |
| /shop/create | ✅ | Create shop form |
| /shop/[handle] | ✅ | Shop profile, products grid, follow button |
| Products CRUD | ✅ | Photos, price (BDT), stock, condition, status |
| Contact Seller | ✅ | Opens DM chat |
| Boost Post / Go Live Sale | ✅ | "Coming Soon" buttons |

### Part 6: Search Fixes
| Fix | Status | Notes |
|-----|--------|-------|
| People tab | ✅ | `GET /users/search?q=` |
| Posts tab | ✅ | `GET /search?q=&type=posts` |
| Communities tab | ✅ | `GET /search?q=&type=communities` |
| Hashtags tab | ✅ | `GET /search?q=&type=hashtags` |
| Real-time suggestions | ✅ | Debounced 300ms input |
| Recent searches | ✅ | Saved to localStorage |
| Trending hashtags | ✅ | Shown when search empty |
| Hashtag page | ✅ | `/hashtag/[tag]` shows posts |

### Part 7: Comments Fix
| Fix | Status | Notes |
|-----|--------|-------|
| Load comments | ✅ | `GET /comments/post/:postId` |
| Submit comment | ✅ | `POST /comments` |
| Reply | ✅ | `POST /comments` with parentId |
| Like comment | ✅ | `POST /comments/:id/like` |
| Delete own | ✅ | `DELETE /comments/:id` |
| Nested replies | ✅ | Indent + load replies button |
| Pagination | ✅ | Backend supports page/limit |

### Part 8: PWA & Android Launch
| Feature | Status | Notes |
|---------|--------|-------|
| manifest.json | ✅ | Bondhu branding, icons, screenshots |
| Service worker | ✅ | next-pwa generates `public/sw.js` |
| Offline support | ✅ | PWA configured with skipWaiting |
| Meta tags | ✅ | Next.js handles mobile optimization |

---

## Files Created

### Backend (API)
- `apps/api/src/bazaar/bazaar.module.ts`
- `apps/api/src/bazaar/bazaar.controller.ts`
- `apps/api/src/bazaar/bazaar.service.ts`
- `apps/api/src/bazaar/dto/bazaar.dto.ts`
- `apps/api/src/jobs/jobs.module.ts`
- `apps/api/src/jobs/jobs.controller.ts`
- `apps/api/src/jobs/jobs.service.ts`
- `apps/api/src/jobs/dto/jobs.dto.ts`
- `apps/api/src/shops/shops.module.ts`
- `apps/api/src/shops/shops.controller.ts`
- `apps/api/src/shops/shops.service.ts`
- `apps/api/src/shops/dto/shops.dto.ts`
- `apps/api/src/addas/addas.module.ts`
- `apps/api/src/addas/addas.controller.ts`
- `apps/api/src/addas/addas.service.ts`

### Frontend (Web)
- `apps/web/src/app/(main)/adda/page.tsx`
- `apps/web/src/app/(main)/bazaar/page.tsx`
- `apps/web/src/app/(main)/cricket/page.tsx`
- `apps/web/src/app/(main)/jobs/page.tsx`
- `apps/web/src/app/(main)/shop/page.tsx`
- `apps/web/src/app/(main)/shop/create/page.tsx`
- `apps/web/src/app/(main)/shop/[handle]/page.tsx`
- `apps/web/src/app/(main)/hashtag/[tag]/page.tsx`
- `apps/web/src/lib/bengali-date.ts`
- `apps/web/src/lib/festivals.ts`
- `apps/web/public/manifest.json`

### Docs
- `LAUNCH_CHECKLIST.md`

## Files Modified

### Backend (API)
- `apps/api/prisma/schema.prisma` — New tables, enums, fields
- `apps/api/src/app.module.ts` — Registered Bazaar, Jobs, Shops, Addas modules
- `apps/api/src/posts/posts.controller.ts` — Added repost, hide, rumor flag, fact-check endpoints
- `apps/api/src/posts/posts.service.ts` — Added repost, hide, rumor, fact-check, points awarding
- `apps/api/src/posts/dto/posts.dto.ts` — Added sharedPostId, type, fundraiser fields
- `apps/api/src/comments/comments.controller.ts` — Added like/unlike endpoints
- `apps/api/src/comments/comments.service.ts` — Added like/unlike logic
- `apps/api/src/communities/communities.controller.ts` — Added transfer ownership endpoint
- `apps/api/src/communities/communities.service.ts` — Owner leave guard, SECRETARY support, role hierarchy
- `apps/api/src/users/users.controller.ts` — Added trusted contacts, SOS, points, leaderboard endpoints
- `apps/api/src/users/users.service.ts` — Added trusted contacts, SOS, points, leaderboard logic

### Frontend (Web)
- `apps/web/src/components/sheets/ShareDrawer.tsx` — All 8 share options implemented
- `apps/web/src/app/(main)/create/page.tsx` — Unique UI per post mode
- `apps/web/src/app/(main)/p/[id]/page.tsx` — Full comments with nested replies, likes, delete
- `apps/web/src/app/(main)/explore/page.tsx` — Real-time search, recent searches, trending, tabs
- `apps/web/src/app/(main)/communities/[slug]/page.tsx` — Role badges, rules/members/posts tabs, manage panel, type cast fix for SECRETARY
- `apps/web/src/app/(main)/stories/[id]/page.tsx` — Added heart reaction button + reply input with auto-pause
- `apps/web/src/components/feed/PostCard.tsx` — Added Bengali date display, rumor flag warning banner (5+ flags)
- `apps/web/src/app/(main)/settings/page.tsx` — Added SOS Emergency modal + Trusted Contacts management, language switcher fix
- `apps/web/src/components/navigation/BottomNav.tsx` — Added Cricket to secondary quick access bar

---

## Known Issues / Limitations
1. **Adda real-time chat** — Rooms are stored in Redis but the actual WebSocket message relay for adda rooms is not wired to a dedicated chat UI yet. The page shows rooms and reactions but a full chatroom component would need additional WebSocket event handlers.
2. **Cricket live scores** — The score widget is a mock UI. For production, embed Cricbuzz or use a cricket API (e.g., CricAPI) and connect to real match data.
3. **Festival themes** — The festival config exists but the automatic theme application across the app is not globally wired (can be added via a context/provider that reads `getActiveFestival()`).
4. ~~**Bengali date on posts** — FIXED: `toBengaliDate()` now integrated into `PostCard` with `font-bangla` class below English timestamp.~~ ✅
5. **SMS OTP** — Currently uses a dev bypass. See deployment section below.
6. **File storage** — Media uploads use mock CDN URLs. See deployment section below.
7. **Shop follow button** — UI exists but backend follow logic for shops is not implemented (can be added similarly to user follows).
8. **Push notifications** — PWA service worker is registered but push notification handlers need FCM/APNs keys and a notification service worker.
9. **Admin fact-check** — The `POST /posts/:id/fact-check` endpoint does not yet enforce admin role (relies on future authz middleware).
10. **Story draw tool** — Story creation has background/text/music but no freehand draw tool (would need a canvas library like Fabric.js).

---

## Deployment Guide

### 1. Deploy API (Railway / VPS)
```bash
cd apps/api
# Set environment variables:
# DATABASE_URL=postgresql://...
# DIRECT_DATABASE_URL=postgresql://...
# REDIS_URL=redis://...
# JWT_SECRET=...
# NODE_ENV=production

npm install
npx prisma migrate deploy
npx prisma generate
npm run build
npm run start:prod
```

### 2. Deploy Web (Vercel)
```bash
cd apps/web
# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://api.bondhu.app/v1
# NEXT_PUBLIC_WS_URL=wss://api.bondhu.app/ws
# NEXT_PUBLIC_APP_URL=https://bondhu.app

npm install
npm run build
```

### 3. Real SMS OTP (instead of dev bypass)
- Sign up at [Twilio](https://www.twilio.com/) or [MessageBird](https://messagebird.com/) or a local Bangladeshi SMS provider (e.g., SSL Wireless, Robi/Airtel SMS API).
- Update `apps/api/src/auth/otp.service.ts` to call the provider's API instead of the dev console log.
- Remove or gate the `DEV_TOKEN` bypass in `apps/api/src/auth/auth.controller.ts`.

### 4. Real File Storage (S3 / Cloudflare R2)
- Create a bucket in AWS S3 or Cloudflare R2.
- Set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT` (for R2) in environment variables.
- Update `apps/api/src/media/media.controller.ts` to upload to S3/R2 instead of local/mock, and return the real CDN URL.
- Update `apps/web/next.config.ts` `images.remotePatterns` to allow your CDN domain.

### 5. PostgreSQL + PostGIS
- Use Railway Postgres, AWS RDS, or a VPS with PostgreSQL 16.
- Enable PostGIS extension: `CREATE EXTENSION postgis;`
- Run migrations: `npx prisma migrate deploy`

### 6. Redis
- Use Railway Redis, Upstash, or a VPS Redis instance.
- Set `REDIS_URL` environment variable.

### 7. PWA / Mobile
- Generate icon files (`icon-192x192.png`, `icon-512x512.png`, `screenshot-wide.png`, `screenshot-narrow.png`) and place in `apps/web/public/`.
- The service worker is auto-generated by `next-pwa` at build time.
- For Android app: use Trusted Web Activity (TWA) or Capacitor to wrap the PWA.

---

## Post-Launch Roadmap
- [ ] Integrate real cricket score API
- [ ] Adda room real-time chat UI with WebSocket
- [ ] Global festival theme provider
- [ ] Bengali date display on all post cards
- [ ] Shop follow / notifications
- [ ] Push notification service worker + FCM
- [ ] Admin dashboard for fact-checking
- [ ] NID verification webhook integration
- [ ] Real-time bazaar price map visualization
