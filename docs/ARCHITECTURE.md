# Bondhu (বন্ধু) — Complete Architecture Map

## Project Overview

**Bondhu** is a modern social media platform engineered specifically for the Bangladeshi market. It supports Bangla script (বাংলা), International English, and Phonetic Banglish with deep localization, offline-first architecture, and production-grade scaling targets of 2M registered users and 1M DAU within year 1.

---

## Monorepo Structure

```
bondhu/
├── apps/
│   ├── api/                          # NestJS backend (Node.js 20+)
│   │   ├── src/
│   │   │   ├── auth/                 # OTP, JWT, session management
│   │   │   ├── users/                # Profiles, verification, settings
│   │   │   ├── posts/                # Posts, reactions, bookmarks, shares
│   │   │   ├── comments/             # 5-level nested threaded comments
│   │   │   ├── stories/              # 24h ephemeral stories + stickers
│   │   │   ├── messages/             # Direct messaging, conversations
│   │   │   ├── communities/          # Groups, memberships, rules
│   │   │   ├── marketplace/          # F-Commerce listings
│   │   │   ├── payments/             # MFS integration (bKash, Nagad, Rocket, Upay)
│   │   │   ├── search/               # Elasticsearch trends, discovery
│   │   │   ├── notifications/        # Push, in-app, digest routing
│   │   │   ├── media/                # Upload, CDN, HLS streaming
│   │   │   ├── moderation/           # Reports, content filtering
│   │   │   ├── settings/             # User preferences, blocked words
│   │   │   ├── ws/                   # WebSocket gateway (real-time)
│   │   │   ├── common/
│   │   │   │   ├── guards/           # Auth, throttling guards
│   │   │   │   ├── interceptors/     # Response transform, logging
│   │   │   │   ├── filters/          # Exception filters
│   │   │   │   ├── pipes/            # Validation pipes
│   │   │   │   ├── decorators/       # @CurrentUser, @Public
│   │   │   │   ├── utils/            # Helper functions
│   │   │   │   ├── services/         # Prisma, Redis, Logger
│   │   │   │   └── modules/          # Shared module definitions
│   │   │   ├── config/               # App, DB, Redis configuration
│   │   │   ├── main.ts               # Bootstrap entry
│   │   │   └── app.module.ts         # Root module
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Complete relational schema (17 models + enums)
│   │   │   ├── seed.ts               # District/sub-district seed data
│   │   │   └── migrations/           # Partition setup migrations
│   │   ├── test/                     # E2E tests
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.build.json
│   │   └── nest-cli.json
│   │
│   └── web/                          # Next.js 15 frontend (App Router)
│       ├── src/
│       │   ├── app/                  # Next.js App Router routes
│       │   │   ├── (auth)/           # Onboarding flow group
│       │   │   │   ├── onboarding/
│       │   │   │   │   ├── page.tsx          # Entry gateway (Screen 1.1)
│       │   │   │   │   ├── phone/
│       │   │   │   │   │   └── page.tsx      # Mobile input (Screen 1.2)
│       │   │   │   │   ├── verify/
│       │   │   │   │   │   └── page.tsx      # OTP validation (Screen 1.3)
│       │   │   │   │   └── profile/
│       │   │   │   │       └── page.tsx      # Profile creation (Screen 1.4)
│       │   │   │   └── layout.tsx
│       │   │   ├── (main)/           # Main authenticated app shell
│       │   │   │   ├── layout.tsx    # Top nav + bottom nav + providers
│       │   │   │   ├── page.tsx      # Home feed (For You / Latest / Local)
│       │   │   │   ├── explore/
│       │   │   │   │   └── page.tsx  # Trends, discovery, people, communities
│       │   │   │   ├── create/
│       │   │   │   │   └── page.tsx  # Content ingestion suite
│       │   │   │   ├── chat/
│       │   │   │   │   ├── page.tsx  # Inbox list
│       │   │   │   │   └── [id]/
│       │   │   │   │       └── page.tsx  # Chat window
│       │   │   │   ├── profile/
│       │   │   │   │   ├── page.tsx  # Self profile
│       │   │   │   │   └── [handle]/
│       │   │   │   │       └── page.tsx  # Public profile
│       │   │   │   ├── marketplace/
│       │   │   │   │   └── page.tsx  # F-Commerce grid
│       │   │   │   ├── settings/
│       │   │   │   │   └── page.tsx  # Master settings tree
│       │   │   │   └── communities/
│       │   │   │       └── [slug]/
│       │   │   │           └── page.tsx  # Community board
│       │   │   ├── layout.tsx
│       │   │   └── globals.css
│       │   ├── components/
│       │   │   ├── ui/               # shadcn/ui base components
│       │   │   ├── feed/
│       │   │   │   ├── PostCard.tsx
│       │   │   │   ├── PostActionBar.tsx
│       │   │   │   ├── ReactionPicker.tsx
│       │   │   │   ├── CommentThread.tsx
│       │   │   │   ├── MediaCarousel.tsx
│       │   │   │   └── FeedTabs.tsx
│       │   │   ├── onboarding/
│       │   │   │   ├── LanguageSelector.tsx
│       │   │   │   ├── PhoneInput.tsx
│       │   │   │   ├── OtpBlocks.tsx
│       │   │   │   ├── DistrictSelector.tsx
│       │   │   │   └── HandleValidator.tsx
│       │   │   ├── sheets/
│       │   │   │   ├── PostMenuSheet.tsx       # Three-dot menu
│       │   │   │   ├── ShareDrawer.tsx         # Distribution hub
│       │   │   │   ├── CreateSheet.tsx         # Content ingestion
│       │   │   │   ├── FintechDrawer.tsx       # In-chat MFS
│       │   │   │   ├── CommunitySheet.tsx      # Group management
│       │   │   │   └── StoryComposer.tsx       # Story creation
│       │   │   ├── chat/
│       │   │   │   ├── ChatHeader.tsx
│       │   │   │   ├── MessageBubble.tsx
│       │   │   │   ├── MessageInput.tsx
│       │   │   │   ├── VoiceRecorder.tsx
│       │   │   │   └── PaymentButton.tsx
│       │   │   ├── navigation/
│       │   │   │   ├── TopBar.tsx
│       │   │   │   ├── BottomNav.tsx
│       │   │   │   └── SearchBar.tsx
│       │   │   └── common/
│       │   │       ├── Avatar.tsx
│       │   │       ├── VerifiedBadge.tsx
│       │   │       ├── Skeleton.tsx
│       │   │       └── ErrorBoundary.tsx
│       │   ├── hooks/
│       │   │   ├── useAuth.ts
│       │   │   ├── useFeed.ts
│       │   │   ├── useInfiniteScroll.ts
│       │   │   ├── useWebSocket.ts
│       │   │   ├── useOfflineQueue.ts
│       │   │   ├── usePresence.ts
│       │   │   ├── useLocalStorage.ts
│       │   │   └── useNetworkStatus.ts
│       │   ├── lib/
│       │   │   ├── utils.ts          # cn(), formatters, validators
│       │   │   ├── db.ts             # Dexie offline DB
│       │   │   ├── api.ts            # Axios/fetch API client
│       │   │   ├── queryClient.ts    # TanStack Query config
│       │   │   └── i18n.ts           # Localization config
│       │   ├── stores/
│       │   │   ├── authStore.ts      # Zustand auth state
│       │   │   ├── feedStore.ts      # Feed cache state
│       │   │   ├── uiStore.ts        # Theme, modal, sheet state
│       │   │   └── chatStore.ts      # Message buffer state
│       │   ├── types/
│       │   │   └── index.ts          # Frontend-specific types
│       │   ├── locales/
│       │   │   ├── bn.json           # Bangla translations
│       │   │   ├── en.json           # English translations
│       │   │   └── bng.json          # Banglish translations
│       │   ├── services/
│       │   │   ├── auth.service.ts
│       │   │   ├── post.service.ts
│       │   │   ├── chat.service.ts
│       │   │   └── media.service.ts
│       │   └── workers/
│       │       └── sync.worker.ts    # Background sync Web Worker
│       ├── public/
│       │   ├── manifest.json
│       │   └── icons/
│       ├── package.json
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── postcss.config.js
│
├── packages/
│   ├── shared-types/                 # Cross-package TypeScript definitions
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── enums.ts              # All Prisma enum mirrors
│   │   │   ├── entities.ts           # Core entity interfaces
│   │   │   ├── dto.ts                # Request/response DTOs
│   │   │   ├── api.ts                # API response wrappers
│   │   │   └── websocket.ts          # WS event contracts
│   │   └── package.json
│   ├── ui/                           # Shared UI component library
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   └── config/                       # Shared tooling configs
│       ├── src/
│       │   └── index.ts
│       └── package.json
│
├── infrastructure/
│   ├── docker/
│   │   ├── docker-compose.yml        # Full local stack
│   │   ├── init-scripts/
│   │   │   └── 00-extensions.sql     # PostGIS + partition functions
│   │   ├── pgbouncer/
│   │   │   └── pgbouncer.ini         # Connection pool config
│   │   └── nginx/
│   │       └── nginx.conf            # Reverse proxy + rate limits
│   ├── terraform/                    # (Future) IaC for AWS/GCP
│   ├── k8s/                          # (Future) Kubernetes manifests
│   └── scripts/
│       ├── db-backup.sh
│       └── partition-maintain.sh
│
├── docs/
│   ├── ARCHITECTURE.md               # This document
│   └── REDIS_SCHEMA.md               # Cache-aside key patterns
│
├── package.json                      # Root workspace config
├── turbo.json                        # Turborepo pipeline
├── tsconfig.json                     # Root TypeScript config
└── .env.example                      # Environment variable template
```

---

## Database Architecture

### Primary: PostgreSQL 16 + PostGIS

| Layer | Purpose |
|-------|---------|
| **PostgreSQL** | Primary transactional datastore |
| **PostGIS** | Geospatial indexing for district/sub-district feeds & geofencing |
| **PgBouncer** | Transaction-mode connection pooling (max 10,000 client conns) |
| **Partitioning** | Monthly RANGE partitions on `posts`, `comments`, `direct_messages`, `post_interactions`, `story_views` |

### Partition Strategy

**High-Traffic Tables (Partitioned by Month)**
- `posts` — content creation firehose
- `comments` — threaded discussion volume
- `direct_messages` — chat throughput
- `post_interactions` — like/reaction flood
- `story_views` — ephemeral view tracking

**Partition Maintenance**
- Auto-created 3 months ahead via `maintain_monthly_partitions()`
- Future months auto-provisioned via cron job or pg_cron

### Core Entity Relationship Summary

```
User (1) ──── (1) UserProfile
User (1) ──── (*) Post
User (1) ──── (*) Comment
User (1) ──── (*) DirectMessage
User (1) ──── (*) Story
User (1) ──── (*) Community (as owner)
User (1) ──── (*) CommunityMembership
User (1) ──── (*) MarketplaceItem
User (1) ──── (*) Payment
User (1) ──── (*) Fundraiser
User (1) ──── (*) Report
User (1) ──── (*) Notification

Post (1) ──── (*) Comment
Post (1) ──── (*) PostInteraction
Post (1) ──── (*) Bookmark
Post (1) ──── (*) MediaAsset
Post (1) ──── (1) Poll
Post (*) ──── (*) Hashtag (via PostHashtag)

Comment (1) ──── (*) Comment (self-referential, depth 0-4)

Conversation (1) ──── (*) ConversationParticipant
Conversation (1) ──── (*) DirectMessage

Community (1) ──── (*) CommunityMembership
Community (1) ──── (*) CommunityRule
Community (1) ──── (*) JoinQuestion

District (1) ──── (*) SubDistrict
District (1) ──── (*) Post
District (1) ──── (*) Community
```

---

## Cache Architecture

### Redis 7 (Cache-Aside Strategy)

| Cache Segment | Data Structure | TTL | Purpose |
|---------------|---------------|-----|---------|
| `feed:foryou:<user_id>` | ZSET | 300s | Weighted ranked feed |
| `feed:latest:<user_id>` | ZSET | 180s | Chronological following feed |
| `feed:local:<district>:<sub>` | ZSET | 120s | Geo-localized feed |
| `profile:<user_id>` | Hash | 3600s | User metadata |
| `profile:handle:<handle>` | String | 86400s | Handle → ID lookup |
| `post:<post_id>` | Hash | 600s | Post detail |
| `post:<id>:reactions` | Hash | 300s | Reaction counts |
| `trends:global` | ZSET | 300s | Trending hashtags |
| `trends:district:<id>` | ZSET | 600s | Local trends |
| `presence:<user_id>` | Hash | 300s | Online/busy/offline |
| `chat:buffer:<conv_id>` | List | 3600s | Recent messages |
| `search:suggest:*` | ZSET | 1800s | Autocomplete index |
| `ratelimit:*` | String | varies | Throttling counters |
| `auth:blocklist:<jti>` | String | token expiry | Revoked JWTs |

---

## API Architecture

### NestJS Module Organization

```
AuthModule
├── OTP service (SMS/voice fallback)
├── JWT strategy (access + refresh)
├── Guest mode handler
└── Device fingerprinting

UsersModule
├── Profile CRUD
├── Verification pipeline (NID/OCR/Face)
├── Follow/unfollow
├── Block/mute
├── Settings & preferences
└── Contact sync

PostsModule
├── Create/read/delete
├── Feed algorithms (For You / Latest / Local)
├── Reactions (6-emoji picker)
├── Bookmarks
├── Share tracking
└── Pin/archive/edit (30-min window)

CommentsModule
├── CRUD
├── Nested threading (5 levels)
└── Reaction counts

StoriesModule
├── 24h expiration engine
├── Media processing
├── Sticker overlays (poll, question, geotag)
└── View tracking

MessagesModule
├── Conversation management
├── Message CRUD + replies + forwards
├── Voice message (playback speed)
└── Read receipts

PaymentsModule
├── P2P transfer (bKash/Nagad/Rocket/Upay)
├── Fund request cards
├── Escrow workflow
└── Biometric/2FA verification gate

SearchModule
├── Elasticsearch indexing
├── Trend aggregation (phonetic unification)
├── User/hashtag/community discovery
└── Geofenced community search

WSModule (WebSocket Gateway)
├── Presence broadcasting
├── Typing indicators
├── Real-time messaging
├── Call signaling (WebRTC)
└── Feed push updates
```

---

## Frontend Architecture

### Next.js 15 App Router

| Route Group | Purpose |
|-------------|---------|
| `(auth)` | Onboarding pipeline (4 screens) — no shell |
| `(main)` | Authenticated experience with TopBar + BottomNav |

### State Management

| Layer | Tool | Responsibility |
|-------|------|----------------|
| Server Cache | TanStack Query | API data, infinite scroll, background refetch |
| Global UI | Zustand | Theme, modals, sheets, auth token |
| Local Persistence | Dexie (IndexedDB) | Offline posts, messages, profiles, action queue |
| Network Status | `navigator.onLine` + events | Queue interception, sync triggers |

### Offline-First Mechanics

1. **Read Path**: Check Dexie cache first → fetch from API → update cache
2. **Write Path**: Optimistic UI update → queue action in Dexie → background sync
3. **Sync Worker**: Web Worker polls queue when online → bulk API calls → clear queue
4. **Cache Warmth**: Top 50 posts, DM history, profile metadata pre-cached

---

## Scaling Strategy

### Database Scaling
- **Horizontal**: Read replicas for feed generation & search
- **Vertical**: Partitioned tables reduce index bloat
- **Connection Pooling**: PgBouncer transaction mode (400 server conns, 10,000 clients)

### Application Scaling
- **Stateless API**: Any pod can handle any request
- **WebSocket**: Sticky sessions or Redis pub/sub for multi-node broadcasts
- **Media**: Object storage (MinIO dev / S3 prod) + CDN edge caching
- **Search**: Elasticsearch cluster with Bangla analyzer

### Surge Mitigation
- Feed cache TTL: 120-300s (stale-while-revalidate acceptable)
- Profile cache: 1 hour (rarely changes)
- Rate limiting: 5 OTP/hour, 100 API/min, 10 auth/min
- Circuit breakers on MFS provider APIs

---

## Security Architecture

| Layer | Implementation |
|-------|---------------|
| Transport | TLS 1.3, HSTS preload |
| Authentication | JWT (access 15m, refresh 7d), OTP via SMS/Voice |
| Authorization | RBAC (User, Moderator, Admin, Owner) |
| Input Validation | Zod + class-validator |
| Rate Limiting | NestJS Throttler + nginx limit_req |
| CORS | Strict origin whitelist |
| File Upload | Mime-type validation, size limits, virus scan (ClamAV) |
| Payments | Biometric/PIN intercept, 2FA for > threshold |
| Data Privacy | AES-256 at rest, encrypted DMs (future) |

---

## Monitoring & Observability

| Tool | Purpose |
|------|---------|
| Winston + DailyRotateFile | Structured application logs |
| Sentry | Error tracking + performance |
| DataDog / Prometheus | Metrics, APM, infrastructure |
| nginx access logs | Request tracing |
| PostgreSQL slow query log | Query optimization |

---

## Development Workflow

```bash
# Start full local stack
pnpm docker:up

# Run Prisma migrations
pnpm db:migrate:dev

# Seed districts & sub-districts
pnpm db:seed

# Start API dev server
pnpm --filter api dev

# Start Web dev server
pnpm --filter web dev

# Generate Prisma client after schema changes
pnpm db:generate
```

---

## Production Checklist

- [ ] Rotate all secrets (JWT, OTP, cookie, DB passwords)
- [ ] Enable PostgreSQL read replicas
- [ ] Configure Redis Sentinel HA
- [ ] Set up Elasticsearch cluster
- [ ] Provision CDN for media delivery
- [ ] Configure backup strategy (WAL archiving, PITR)
- [ ] Enable SSL certificates (Let's Encrypt / ACM)
- [ ] Set up log aggregation (ELK / Loki)
- [ ] Configure alerting (PagerDuty / Opsgenie)
- [ ] Run load tests (k6 / Artillery) against feed & chat endpoints
- [ ] Penetration test auth & payment flows
