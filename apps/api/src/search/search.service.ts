import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { RedisService } from '../common/services/redis.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async universalSearch(q: string, type: string = 'all', page = 1, limit = 20) {
    const results: Record<string, unknown> = {};

    if (type === 'all' || type === 'users') {
      const [users, userTotal] = await Promise.all([
        this.prisma.userProfile.findMany({
          where: {
            OR: [
              { handle: { contains: q, mode: 'insensitive' } },
              { displayName: { contains: q, mode: 'insensitive' } },
            ],
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { followerCount: 'desc' },
        }),
        this.prisma.userProfile.count({
          where: {
            OR: [
              { handle: { contains: q, mode: 'insensitive' } },
              { displayName: { contains: q, mode: 'insensitive' } },
            ],
          },
        }),
      ]);
      results.users = { data: users, meta: { page, limit, total: userTotal } };
    }

    if (type === 'all' || type === 'posts') {
      const [posts, postTotal] = await Promise.all([
        this.prisma.post.findMany({
          where: {
            isArchived: false,
            visibility: 'PUBLIC',
            content: { contains: q, mode: 'insensitive' },
          },
          skip: (page - 1) * limit,
          take: limit,
          include: { user: { include: { profile: true } }, mediaAssets: true },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.post.count({
          where: {
            isArchived: false,
            visibility: 'PUBLIC',
            content: { contains: q, mode: 'insensitive' },
          },
        }),
      ]);
      results.posts = { data: posts, meta: { page, limit, total: postTotal } };
    }

    if (type === 'all' || type === 'hashtags') {
      const [hashtags, hashtagTotal] = await Promise.all([
        this.prisma.hashtag.findMany({
          where: { tag: { contains: q, mode: 'insensitive' } },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { postCount: 'desc' },
        }),
        this.prisma.hashtag.count({ where: { tag: { contains: q, mode: 'insensitive' } } }),
      ]);
      results.hashtags = { data: hashtags, meta: { page, limit, total: hashtagTotal } };
    }

    if (type === 'all' || type === 'communities') {
      const [communities, communityTotal] = await Promise.all([
        this.prisma.community.findMany({
          where: {
            visibility: 'PUBLIC',
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { memberCount: 'desc' },
        }),
        this.prisma.community.count({
          where: {
            visibility: 'PUBLIC',
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          },
        }),
      ]);
      results.communities = { data: communities, meta: { page, limit, total: communityTotal } };
    }

    return results;
  }

  async getTrends(districtId?: number) {
    const cacheKey = districtId ? `trends:district:${districtId}` : 'trends:global';
    const cached = await this.redis.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const hashtags = await this.prisma.hashtag.findMany({
      where: districtId ? { posts: { some: { post: { districtId } } } } : undefined,
      orderBy: { trendingScore: 'desc' },
      take: 20,
    });

    // Group by phonetic key
    const phoneticMap = new Map<string, { hashtag: typeof hashtags[0]; postVolume24h: number }>();

    for (const hashtag of hashtags) {
      const existing = phoneticMap.get(hashtag.phoneticKey);
      if (!existing) {
        phoneticMap.set(hashtag.phoneticKey, {
          hashtag,
          postVolume24h: hashtag.postCount,
        });
      } else {
        existing.postVolume24h += hashtag.postCount;
      }
    }

    const trends = Array.from(phoneticMap.values())
      .sort((a, b) => b.postVolume24h - a.postVolume24h)
      .slice(0, 10)
      .map((t) => ({
        hashtag: t.hashtag,
        postVolume24h: t.postVolume24h,
        activityScore: t.hashtag.trendingScore,
      }));

    await this.redis.set(cacheKey, trends, 300);
    return trends;
  }

  async getSuggestions(q: string, type: string = 'users') {
    if (type === 'users') {
      return this.prisma.userProfile.findMany({
        where: {
          handle: { startsWith: q, mode: 'insensitive' },
        },
        take: 10,
        select: { id: true, handle: true, displayName: true, avatarUrl: true, followerCount: true },
        orderBy: { followerCount: 'desc' },
      });
    }

    if (type === 'hashtags') {
      return this.prisma.hashtag.findMany({
        where: { tag: { startsWith: q, mode: 'insensitive' } },
        take: 10,
        orderBy: { postCount: 'desc' },
      });
    }

    return [];
  }
}
