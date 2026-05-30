import { Injectable } from '@nestjs/common';
import { RedisService } from '../common/services/redis.service';

interface AddaRoom {
  id: string;
  topic: string;
  districtId: number;
  districtName: string;
  createdBy: string;
  createdAt: number;
  lastActivityAt: number;
  memberCount: number;
  pinned: boolean;
  reactions: Record<string, number>;
}

const ROOM_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const ROOM_PREFIX = 'adda:room:';
const ROOM_LIST_KEY = 'adda:rooms';

@Injectable()
export class AddasService {
  constructor(private readonly redis: RedisService) {}

  private client() {
    return this.redis.getClient();
  }

  async createRoom(userId: string, topic: string, districtId: number, districtName: string): Promise<AddaRoom> {
    const id = `adda-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const room: AddaRoom = {
      id,
      topic,
      districtId,
      districtName,
      createdBy: userId,
      createdAt: Date.now(),
      lastActivityAt: Date.now(),
      memberCount: 1,
      pinned: false,
      reactions: { 'চা': 0, '☕': 0, 'ভাত': 0, '🍚': 0, 'ইলিশ': 0, '🐟': 0, 'হাসি': 0, '😄': 0 },
    };
    await this.client().setex(`${ROOM_PREFIX}${id}`, Math.floor(ROOM_TTL_MS / 1000), JSON.stringify(room));
    await this.client().zadd(ROOM_LIST_KEY, Date.now(), id);
    return room;
  }

  async getRooms(districtId?: number): Promise<AddaRoom[]> {
    const ids = await this.client().zrevrange(ROOM_LIST_KEY, 0, 99);
    const rooms: AddaRoom[] = [];
    for (const id of ids) {
      const data = await this.client().get(`${ROOM_PREFIX}${id}`);
      if (!data) {
        await this.client().zrem(ROOM_LIST_KEY, id);
        continue;
      }
      const room = JSON.parse(data) as AddaRoom;
      if (Date.now() - room.lastActivityAt > ROOM_TTL_MS) {
        await this.client().del(`${ROOM_PREFIX}${id}`);
        await this.client().zrem(ROOM_LIST_KEY, id);
        continue;
      }
      if (!districtId || room.districtId === districtId) {
        rooms.push(room);
      }
    }
    // Pin popular rooms to top
    rooms.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.memberCount - a.memberCount);
    return rooms;
  }

  async getRoom(id: string): Promise<AddaRoom | null> {
    const data = await this.client().get(`${ROOM_PREFIX}${id}`);
    if (!data) return null;
    const room = JSON.parse(data) as AddaRoom;
    if (Date.now() - room.lastActivityAt > ROOM_TTL_MS) {
      await this.client().del(`${ROOM_PREFIX}${id}`);
      await this.client().zrem(ROOM_LIST_KEY, id);
      return null;
    }
    return room;
  }

  async bumpActivity(id: string) {
    const data = await this.client().get(`${ROOM_PREFIX}${id}`);
    if (!data) return;
    const room = JSON.parse(data) as AddaRoom;
    room.lastActivityAt = Date.now();
    await this.client().setex(`${ROOM_PREFIX}${id}`, Math.floor(ROOM_TTL_MS / 1000), JSON.stringify(room));
  }

  async addReaction(id: string, reaction: string) {
    const data = await this.client().get(`${ROOM_PREFIX}${id}`);
    if (!data) return;
    const room = JSON.parse(data) as AddaRoom;
    if (room.reactions[reaction] !== undefined) {
      room.reactions[reaction]++;
      room.lastActivityAt = Date.now();
      await this.client().setex(`${ROOM_PREFIX}${id}`, Math.floor(ROOM_TTL_MS / 1000), JSON.stringify(room));
    }
  }

  async joinRoom(id: string) {
    const data = await this.client().get(`${ROOM_PREFIX}${id}`);
    if (!data) return;
    const room = JSON.parse(data) as AddaRoom;
    room.memberCount++;
    room.lastActivityAt = Date.now();
    await this.client().setex(`${ROOM_PREFIX}${id}`, Math.floor(ROOM_TTL_MS / 1000), JSON.stringify(room));
  }

  async leaveRoom(id: string) {
    const data = await this.client().get(`${ROOM_PREFIX}${id}`);
    if (!data) return;
    const room = JSON.parse(data) as AddaRoom;
    room.memberCount = Math.max(0, room.memberCount - 1);
    room.lastActivityAt = Date.now();
    await this.client().setex(`${ROOM_PREFIX}${id}`, Math.floor(ROOM_TTL_MS / 1000), JSON.stringify(room));
  }
}
