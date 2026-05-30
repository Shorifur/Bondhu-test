# Bondhu — Frontend-to-Backend API Wiring Guide

## Architecture

```
Frontend (Next.js 15)
├── Services (typed API wrappers)
├── Zustand Stores (client state)
├── TanStack Query (server state + cache)
├── WebSocket Provider (real-time events)
└── Offline Queue (Dexie + background sync)

Backend (NestJS)
├── REST API (/v1/*)
├── WebSocket Gateway (/ws)
└── Redis Pub/Sub (multi-server broadcast)
```

---

## Authentication Flow

1. **Onboarding** → `POST /v1/auth/otp/send` (phone validation)
2. **Verify** → `POST /v1/auth/otp/verify` (returns JWT pair)
3. **Profile Setup** → `POST /v1/auth/profile` (create UserProfile)
4. **Token Refresh** → `POST /v1/auth/refresh` (silent refresh before expiry)
5. **Logout** → `POST /v1/auth/logout` + clear `bondhu_token` cookie

JWT `accessToken` is injected into every request via `api.ts` interceptor.

---

## Feed Wiring

| Frontend | Backend | Cache Strategy |
|----------|---------|---------------|
| `postService.getForYouFeed()` | `GET /v1/posts/feed/foryou` | TanStack Query 2-min stale |
| `postService.getLatestFeed()` | `GET /v1/posts/feed/latest` | TanStack Query 2-min stale |
| `postService.getLocalFeed()` | `GET /v1/posts/feed/local` | TanStack Query 2-min stale |
| Infinite scroll | `?page=N&limit=20` | Cursor appended, deduplicated |
| Real-time new post | WS `post:created` | Invalidates feed query |

---

## Chat Wiring

| Action | Transport | Details |
|--------|-----------|---------|
| Send message | WebSocket primary (`message:send`) | Instant delivery |
| Send message | REST fallback (`POST /conversations/:id/messages`) | Reliability |
| Receive message | WS `message:received` | Adds to Zustand + invalidates Query |
| Mark read | REST (`POST /conversations/:id/read`) | Updates unread count |
| Typing indicator | WS `typing:start` / `typing:stop` | 2s debounce |
| Presence | WS `presence:update` | Broadcast to friends |
| WebRTC call | WS `call:offer/answer/ice-candidate/end` | P2P signaling relay |

---

## Real-Time Event Map

| WS Event | Frontend Handler | Store Update |
|----------|-----------------|--------------|
| `presence:broadcast` | `useWebSocket` | `chatStore.onlineUsers` |
| `typing:start` | `useWebSocket` | `chatStore.typingUsers` |
| `typing:stop` | `useWebSocket` | `chatStore.typingUsers` |
| `message:received` | `useWebSocket` | `chatStore.addMessage` + invalidate Query |
| `message:read` | `useWebSocket` | Invalidate messages Query |
| `post:created` | `useWebSocket` | Invalidate feed Query |
| `call:offer` | `useWebSocket` | Dispatch to Call UI |
| `call:answer` | `useWebSocket` | Dispatch to Call UI |
| `call:ice-candidate` | `useWebSocket` | Dispatch to Call UI |
| `call:end` | `useWebSocket` | Dispatch to Call UI |

---

## Offline-First Sync

```
User action (like/comment/message)
  ↓
Optimistic UI update (Zustand)
  ↓
Queue in Dexie (offlineActions table)
  ↓
Network restored?
  ├─ YES → Bulk sync to API → Clear queue
  └─ NO  → Keep in queue, retry on next online event
```

---

## Service Layer Index

| Service | Methods |
|---------|---------|
| `authService` | sendOtp, verifyOtp, createProfile, refreshToken, logout, me |
| `postService` | create, getById, update, delete, pin, archive, feed queries, react, bookmark, share |
| `chatService` | getConversations, createConversation, getMessages, sendMessage, markRead, forward, delete |
| `userService` | getMe, getByHandle, updateProfile, follow, unfollow, search, settings, preferences |
| `marketplaceService` | browse, getById, create, update, delete, search |
| `paymentService` | send, requestFunds, createEscrow, confirmEscrow, verify, getHistory |

---

## Environment Variables

```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_MINIO_URL=http://localhost:9000

# Backend
DATABASE_URL=postgresql://bondhu:bondhu_secret@localhost:6432/bondhu?schema=public&pgbouncer=true
REDIS_URL=redis://localhost:6379
JWT_SECRET=...
```

---

## Running Integration Tests

```bash
# Start full stack
pnpm docker:up

# Run backend E2E
pnpm --filter api test:e2e

# Run frontend E2E (Playwright)
pnpm --filter web test:e2e
```
