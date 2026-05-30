import Dexie, { type Table } from 'dexie';

// ================================================================
// BONDHU OFFLINE-FIRST CLIENT DATABASE (Dexie / IndexedDB)
// ================================================================

export interface CachedPost {
  id: string;
  userId: string;
  content?: string | null;
  locationName?: string | null;
  districtId?: number | null;
  subDistrictId?: number | null;
  visibility: string;
  commentCount: number;
  reactionCount: number;
  shareCount: number;
  bookmarkCount: number;
  score: number;
  createdAt: string;
  updatedAt: string;
  user?: string; // JSON serialized UserProfile
  mediaAssets?: string; // JSON serialized
  hashtags?: string; // JSON serialized
  cachedAt: number;
}

export interface CachedMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string | null;
  type: string;
  content?: string | null;
  mediaUrl?: string | null;
  voiceDuration?: number | null;
  voicePlaybackSpeed: number;
  replyToId?: string | null;
  isDeleted: boolean;
  isRead: boolean;
  createdAt: string;
  sender?: string; // JSON serialized
  cachedAt: number;
}

export interface CachedProfile {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  isVerified: boolean;
  verificationType?: string | null;
  followerCount: number;
  followingCount: number;
  postCount: number;
  cachedAt: number;
}

export interface OfflineAction {
  id: string;
  type: 'like' | 'unlike' | 'bookmark' | 'unbookmark' | 'comment' | 'message' | 'follow' | 'unfollow';
  entityId: string;
  payload?: string; // JSON serialized
  createdAt: number;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed';
}

export class BondhuDatabase extends Dexie {
  posts!: Table<CachedPost>;
  messages!: Table<CachedMessage>;
  profiles!: Table<CachedProfile>;
  offlineQueue!: Table<OfflineAction>;

  constructor() {
    super('BondhuDB');
    this.version(1).stores({
      posts: 'id, userId, districtId, subDistrictId, score, createdAt, cachedAt',
      messages: 'id, conversationId, senderId, createdAt, cachedAt',
      profiles: 'id, handle, cachedAt',
      offlineQueue: '++id, type, entityId, status, createdAt',
    });
  }
}

export const db = typeof window !== 'undefined' ? new BondhuDatabase() : null;

// ================================================================
// OFFLINE QUEUE OPERATIONS
// ================================================================

export async function queueOfflineAction(
  type: OfflineAction['type'],
  entityId: string,
  payload?: Record<string, unknown>,
): Promise<void> {
  if (!db) return;
  await db.offlineQueue.add({
    id: crypto.randomUUID(),
    type,
    entityId,
    payload: payload ? JSON.stringify(payload) : undefined,
    createdAt: Date.now(),
    retryCount: 0,
    status: 'pending',
  });
}

export async function getPendingActions(): Promise<OfflineAction[]> {
  if (!db) return [];
  return db.offlineQueue.where('status').equals('pending').sortBy('createdAt');
}

export async function markActionSynced(id: string): Promise<void> {
  if (!db) return;
  await db.offlineQueue.delete(id);
}

export async function markActionFailed(id: string): Promise<void> {
  if (!db) return;
  await db.offlineQueue.update(id, { status: 'failed' });
}

export async function incrementRetryCount(id: string): Promise<void> {
  if (!db) return;
  const action = await db.offlineQueue.get(id);
  if (action) {
    await db.offlineQueue.update(id, { retryCount: action.retryCount + 1 });
  }
}

// ================================================================
// CACHE OPERATIONS
// ================================================================

export async function cachePosts(posts: CachedPost[]): Promise<void> {
  if (!db) return;
  const now = Date.now();
  await db.posts.bulkPut(
    posts.map((p) => ({ ...p, cachedAt: now })),
  );
}

export async function getCachedPosts(
  limit: number = 50,
): Promise<CachedPost[]> {
  if (!db) return [];
  return db.posts.orderBy('score').reverse().limit(limit).toArray();
}

export async function cacheMessages(
  conversationId: string,
  messages: CachedMessage[],
): Promise<void> {
  if (!db) return;
  const now = Date.now();
  await db.messages.bulkPut(
    messages.map((m) => ({ ...m, cachedAt: now })),
  );
}

export async function getCachedMessages(
  conversationId: string,
  limit: number = 100,
): Promise<CachedMessage[]> {
  if (!db) return [];
  return db.messages
    .where({ conversationId })
    .reverse()
    .limit(limit)
    .sortBy('createdAt');
}

export async function cacheProfile(profile: CachedProfile): Promise<void> {
  if (!db) return;
  await db.profiles.put({ ...profile, cachedAt: Date.now() });
}

export async function getCachedProfile(handle: string): Promise<CachedProfile | undefined> {
  if (!db) return undefined;
  return db.profiles.where({ handle }).first();
}

export async function clearExpiredCache(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  if (!db) return;
  const cutoff = Date.now() - maxAgeMs;
  await db.posts.where('cachedAt').below(cutoff).delete();
  await db.messages.where('cachedAt').below(cutoff).delete();
  await db.profiles.where('cachedAt').below(cutoff).delete();
}
