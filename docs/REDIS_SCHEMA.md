# Bondhu Redis Cache-Aside Schema

## Connection Strategy
- **Primary**: `redis://localhost:6379` (development) / Redis Cluster (production)
- **Sentinel**: `redis-sentinel://localhost:26379` for HA failover
- **Strategy**: Cache-aside with TTL-based eviction + LRU overflow

---

## Key Naming Conventions

```
bondhu:<service>:<entity>:<id>[:<attribute>]
```

---

## 1. Feed Cache

### Home Feed (For You)
```
Key:    bondhu:feed:foryou:<user_id>
Type:   Sorted Set (ZSET)
Score:  feed_score (computed ranking matrix)
Value:  post_id
TTL:    300s (5 minutes)

Key:    bondhu:feed:foryou:<user_id>:meta
Type:   Hash
Fields: last_updated, cursor, total_count
TTL:    300s
```

### Latest Feed (Following)
```
Key:    bondhu:feed:latest:<user_id>
Type:   Sorted Set
Score:  created_at timestamp
Value:  post_id
TTL:    180s
```

### Local District Feed
```
Key:    bondhu:feed:local:<district_id>:<sub_district_id>
Type:   Sorted Set
Score:  created_at timestamp
Value:  post_id
TTL:    120s
```

### Feed Warm Strategy
- Warm on user login
- Invalidate on new post from followed user
- Background job refreshes stale feeds every 60s for active users

---

## 2. User Profile Cache

```
Key:    bondhu:profile:<user_id>
Type:   Hash
Fields: id, handle, display_name, avatar_url, bio, 
        is_verified, verification_type, follower_count,
        following_count, post_count, district_id, 
        sub_district_id, language, theme
TTL:    3600s (1 hour)
```

### Profile Metadata (lightweight for feed cards)
```
Key:    bondhu:profile:meta:<user_id>
Type:   String (JSON)
TTL:    1800s
```

### Handle → ID Lookup
```
Key:    bondhu:profile:handle:<handle>
Type:   String
Value:  user_id
TTL:    86400s (24 hours)
```

---

## 3. Post Cache

### Post Detail
```
Key:    bondhu:post:<post_id>
Type:   Hash
Fields: id, user_id, content, location_name, district_id,
        visibility, is_pinned, comment_count, reaction_count,
        share_count, bookmark_count, score, created_at
TTL:    600s
```

### Post Reactions Summary
```
Key:    bondhu:post:<post_id>:reactions
Type:   Hash
Fields: LIKE, LOVE, LAUGH, SAD, WOW, ANGRY (counts)
TTL:    300s
```

### Post User Reaction (did user react?)
```
Key:    bondhu:post:<post_id>:user_reaction:<user_id>
Type:   String
Value:  reaction_type or "none"
TTL:    300s
```

---

## 4. Trending Hashtags

### Global Trends
```
Key:    bondhu:trends:global
Type:   Sorted Set
Score:  trending_score (volume × velocity × recency)
Value:  hashtag_id|hashtag_text
TTL:    300s
```

### District-local Trends
```
Key:    bondhu:trends:district:<district_id>
Type:   Sorted Set
Score:  trending_score
Value:  hashtag_id|hashtag_text
TTL:    600s
```

### Phonetic Key Index
```
Key:    bondhu:hashtag:phonetic:<phonetic_key>
Type:   Set
Value:  hashtag_id(s) mapped to same phonetic key
TTL:    86400s
```

---

## 5. Real-Time Presence & Chat

### User Presence
```
Key:    bondhu:presence:<user_id>
Type:   Hash
Fields: status (online|busy|offline), last_seen_at, device_count
TTL:    300s (refreshed by heartbeat every 30s)
```

### Presence Index (for "who is online")
```
Key:    bondhu:presence:online
Type:   Set
Value:  user_id(s)
TTL:    Key-level — members expire via individual presence keys
```

### Typing Indicators
```
Key:    bondhu:typing:<conversation_id>:<user_id>
Type:   String
Value:  timestamp
TTL:    10s
```

### Chat Message Buffer (recent messages per conversation)
```
Key:    bondhu:chat:buffer:<conversation_id>
Type:   List (LPUSH)
Value:  JSON message objects (last 100)
TTL:    3600s
```

### Unread Count
```
Key:    bondhu:chat:unread:<user_id>:<conversation_id>
Type:   Integer (String)
TTL:    86400s
```

---

## 6. Rate Limiting

### OTP Requests
```
Key:    bondhu:ratelimit:otp:<phone_number>
Type:   String (counter)
TTL:    3600s
Max:    5 requests / hour
```

### Login Attempts
```
Key:    bondhu:ratelimit:login:<ip_address>
Type:   String (counter)
TTL:    900s
Max:    10 attempts / 15 min
```

### API General
```
Key:    bondhu:ratelimit:api:<user_id_or_ip>
Type:   String (counter)
TTL:    60s
Max:    100 requests / min
```

---

## 7. Session & Auth

### JWT Blocklist (logout/revoke)
```
Key:    bondhu:auth:blocklist:<jti>
Type:   String
Value:  revoked_at
TTL:    Matches token expiry (15m - 7d)
```

### Refresh Token Index
```
Key:    bondhu:auth:refresh:<user_id>:<token_fingerprint>
Type:   Hash
Fields: device_id, ip_address, created_at
TTL:    604800s (7 days)
```

---

## 8. Search & Discovery

### Search Suggestions (prefix index)
```
Key:    bondhu:search:suggest:users:<prefix>
Type:   Sorted Set
Score:  follower_count
Value:  user_id|handle|display_name|avatar_url
TTL:    1800s
```

### Search Suggestions Hashtags
```
Key:    bondhu:search:suggest:hashtags:<prefix>
Type:   Sorted Set
Score:  post_count
Value:  hashtag_id|tag|post_count
TTL:    1800s
```

---

## 9. Marketplace Cache

### Item Detail
```
Key:    bondhu:marketplace:item:<item_id>
Type:   Hash
Fields: id, seller_id, title, price, condition, category,
        district_id, is_verified_seller, is_sold, created_at
TTL:    600s
```

### Category Listings
```
Key:    bondhu:marketplace:category:<category>:<district_id>
Type:   Sorted Set
Score:  created_at timestamp
Value:  item_id
TTL:    300s
```

---

## 10. Offline-First Queue (Client-Side Coordination)

### Pending Actions Queue (server-side backup)
```
Key:    bondhu:offline:queue:<user_id>
Type:   List (RPUSH → LPOP)
Value:  JSON action objects
TTL:    86400s
```

Action JSON Schema:
```json
{
  "id": "uuid",
  "type": "like|comment|bookmark|message|follow",
  "entityId": "uuid",
  "payload": {},
  "createdAt": "ISO timestamp",
  "retryCount": 0
}
```

---

## 11. Cache Invalidation Patterns

| Event | Invalidation Keys |
|-------|-------------------|
| New Post | `bondhu:feed:*:<author_followers>`, `bondhu:feed:local:*` |
| Post Deleted | `bondhu:post:<id>`, `bondhu:feed:*` |
| Reaction | `bondhu:post:<id>:reactions`, `bondhu:post:<id>:user_reaction:*` |
| Profile Update | `bondhu:profile:<id>`, `bondhu:profile:handle:<handle>` |
| Follow | `bondhu:profile:<id>:meta`, follower/following counts |
| New Message | `bondhu:chat:buffer:*`, `bondhu:chat:unread:*` |
| Block/Unblock | `bondhu:feed:foryou:<user_id>` |

---

## 12. Redis Memory Budget (Production)

| Service | Max Memory | Eviction Policy |
|---------|-----------|-----------------|
| Feed Cache | 512 MB | allkeys-lru |
| Profile Cache | 256 MB | allkeys-lru |
| Presence | 128 MB | volatile-lru |
| Chat Buffer | 512 MB | allkeys-lru |
| Trends | 64 MB | allkeys-lru |
| Rate Limit | 32 MB | volatile-ttl |
| Session | 128 MB | volatile-ttl |
| Search | 256 MB | allkeys-lru |
| Marketplace | 128 MB | allkeys-lru |
