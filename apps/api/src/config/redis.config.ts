import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  sentinelUrl: process.env.REDIS_SENTINEL_URL,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB ?? '', 10) || 0,
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'bondhu:',
  ttl: {
    feed: parseInt(process.env.REDIS_TTL_FEED ?? '', 10) || 300,
    profile: parseInt(process.env.REDIS_TTL_PROFILE ?? '', 10) || 3600,
    post: parseInt(process.env.REDIS_TTL_POST ?? '', 10) || 600,
    presence: parseInt(process.env.REDIS_TTL_PRESENCE ?? '', 10) || 300,
    session: parseInt(process.env.REDIS_TTL_SESSION ?? '', 10) || 604800,
    trends: parseInt(process.env.REDIS_TTL_TRENDS ?? '', 10) || 300,
    search: parseInt(process.env.REDIS_TTL_SEARCH ?? '', 10) || 1800,
  },
}));
