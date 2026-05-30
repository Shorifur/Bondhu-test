import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor(private readonly config: ConfigService) {
    const redisUrl = this.config.get<string>('redis.url') ?? 'redis://localhost:6379';
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });
    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  private prefix(key: string): string {
    const prefix = this.config.get('redis.keyPrefix') || 'bondhu:';
    return `${prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(this.prefix(key));
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    const fullKey = this.prefix(key);
    if (ttlSeconds) {
      await this.redis.setex(fullKey, ttlSeconds, serialized);
    } else {
      await this.redis.set(fullKey, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(this.prefix(key));
  }

  async delPattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(this.prefix(pattern));
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    const value = await this.redis.hget(this.prefix(key), field);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  async hset(key: string, field: string, value: unknown): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await this.redis.hset(this.prefix(key), field, serialized);
  }

  async hgetall<T extends Record<string, unknown>>(key: string): Promise<T | null> {
    const data = await this.redis.hgetall(this.prefix(key));
    if (!data || Object.keys(data).length === 0) return null;
    const parsed: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(data)) {
      try {
        parsed[field] = JSON.parse(value);
      } catch {
        parsed[field] = value;
      }
    }
    return parsed as T;
  }

  async zadd(key: string, score: number, member: string): Promise<void> {
    await this.redis.zadd(this.prefix(key), score, member);
  }

  async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redis.zrevrange(this.prefix(key), start, stop);
  }

  async zrem(key: string, member: string): Promise<void> {
    await this.redis.zrem(this.prefix(key), member);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(this.prefix(key), seconds);
  }

  async incr(key: string): Promise<number> {
    return this.redis.incr(this.prefix(key));
  }

  async decr(key: string): Promise<number> {
    return this.redis.decr(this.prefix(key));
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(this.prefix(key));
    return result === 1;
  }

  getClient(): Redis {
    return this.redis;
  }
}
