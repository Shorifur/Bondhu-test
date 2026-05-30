import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { RedisService } from '../common/services/redis.service';
import type { CreatePostDto, UpdatePostDto, ReactToPostDto, FeedQueryDto } from './dto/posts.dto';
import { ReactionType, VisibilityScope } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(userId: string, dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        userId,
        content: dto.content,
        contentMarkdown: dto.contentMarkdown ?? false,
        locationName: dto.locationName,
        districtId: dto.districtId,
        subDistrictId: dto.subDistrictId,
        visibility: dto.visibility ?? VisibilityScope.PUBLIC,
        editDeadline: new Date(Date.now() + 30 * 60 * 1000),
      },
      include: { user: { include: { profile: true } }, mediaAssets: true, hashtags: { include: { hashtag: true } } },
    });

    // Link media assets
    if (dto.mediaAssetIds?.length) {
      await this.prisma.mediaAsset.updateMany({
        where: { id: { in: dto.mediaAssetIds } },
        data: { postId: post.id },
      });
    }

    // Process hashtags
    if (dto.hashtagNames?.length) {
      await this.processHashtags(post.id, dto.hashtagNames);
    } else if (dto.content) {
      const extracted = this.extractHashtags(dto.content);
      if (extracted.length) await this.processHashtags(post.id, extracted);
    }

    await this.prisma.userProfile.update({
      where: { userId },
      data: { postCount: { increment: 1 } },
    });

    // Invalidate feeds
    await this.invalidateUserFeeds(userId);

    return this.getById(post.id, userId);
  }

  async getById(id: string, currentUserId?: string) {
    const cacheKey = `post:${id}`;
    const cached = await this.redis.get<unknown>(cacheKey);
    let post;

    if (cached) {
      post = cached;
    } else {
      post = await this.prisma.post.findUnique({
        where: { id },
        include: {
          user: { include: { profile: true } },
          mediaAssets: { orderBy: { orderIndex: 'asc' } },
          hashtags: { include: { hashtag: true } },
          poll: { include: { options: { orderBy: { orderIndex: 'asc' } } } },
        },
      });
      if (post) await this.redis.set(cacheKey, post, 600);
    }

    if (!post) throw new NotFoundException('Post not found');

    const myReaction = currentUserId
      ? await this.prisma.postInteraction.findFirst({
          where: { postId: id, userId: currentUserId },
        })
      : null;

    const isBookmarked = currentUserId
      ? !!(await this.prisma.bookmark.findUnique({
          where: { userId_postId: { userId: currentUserId, postId: id } },
        }))
      : false;

    return { ...(post as object), myReaction: myReaction?.type || null, isBookmarked };
  }

  async update(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException('Not your post');
    if (post.editDeadline && new Date() > post.editDeadline) {
      throw new BadRequestException('Edit window expired (30 minutes)');
    }

    const updated = await this.prisma.post.update({
      where: { id: postId },
      data: { content: dto.content, isEdited: true, editedAt: new Date() },
      include: { user: { include: { profile: true } }, mediaAssets: true, hashtags: { include: { hashtag: true } } },
    });

    await this.redis.del(`post:${postId}`);
    return updated;
  }

  async delete(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException('Not your post');

    await this.prisma.post.delete({ where: { id: postId } });
    await this.prisma.userProfile.update({ where: { userId }, data: { postCount: { decrement: 1 } } });
    await this.redis.del(`post:${postId}`);
    await this.invalidateUserFeeds(userId);
    return { success: true };
  }

  async pin(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.userId !== userId) throw new ForbiddenException('Not your post');
    await this.prisma.post.update({ where: { id: postId }, data: { isPinned: !post.isPinned } });
    await this.redis.del(`post:${postId}`);
    return { isPinned: !post.isPinned };
  }

  async archive(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.userId !== userId) throw new ForbiddenException('Not your post');
    await this.prisma.post.update({ where: { id: postId }, data: { isArchived: !post.isArchived } });
    await this.redis.del(`post:${postId}`);
    return { isArchived: !post.isArchived };
  }

  async getForYouFeed(userId: string, query: FeedQueryDto) {
    const { page = 1, limit = 20 } = query;
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId, status: 'ACCEPTED' },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    const posts = await this.prisma.post.findMany({
      where: {
        isArchived: false,
        visibility: { in: [VisibilityScope.PUBLIC, VisibilityScope.FOLLOWERS] },
        OR: [
          { userId: { in: followingIds } },
          { visibility: VisibilityScope.PUBLIC },
        ],
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      include: {
        user: { include: { profile: true } },
        mediaAssets: { orderBy: { orderIndex: 'asc' } },
        hashtags: { include: { hashtag: true } },
        poll: { include: { options: { orderBy: { orderIndex: 'asc' } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 3,
    });

    // Score and rank
    const scored = posts.map((post) => {
      let score = 0;
      const ageHours = (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60);
      score += Math.max(0, 30 - ageHours) * 0.3; // Chronological decay
      if (profile?.language && post.languageScript === profile.language) score += 35; // Language match
      if (post.user.profile?.isVerified) score += 15; // Verification boost
      score += Math.min(post.reactionCount * 0.5 + post.commentCount * 2 + post.shareCount * 3, 20); // Interaction affinity
      return { post, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const paginated = scored.slice((page - 1) * limit, page * limit).map((s) => s.post);

    const enriched = await Promise.all(
      paginated.map((p) => this.enrichPost(p as unknown as Record<string, unknown>, userId)),
    );

    return { data: enriched, meta: { page, limit, hasMore: scored.length > page * limit } };
  }

  async getLatestFeed(userId: string, query: FeedQueryDto) {
    const { page = 1, limit = 20 } = query;
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId, status: 'ACCEPTED' },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          userId: { in: followingIds },
          isArchived: false,
          visibility: { in: [VisibilityScope.PUBLIC, VisibilityScope.FOLLOWERS] },
        },
        include: {
          user: { include: { profile: true } },
          mediaAssets: { orderBy: { orderIndex: 'asc' } },
          hashtags: { include: { hashtag: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.post.count({
        where: {
          userId: { in: followingIds },
          isArchived: false,
          visibility: { in: [VisibilityScope.PUBLIC, VisibilityScope.FOLLOWERS] },
        },
      }),
    ]);

    const enriched = await Promise.all(
      posts.map((p) => this.enrichPost(p as unknown as Record<string, unknown>, userId)),
    );

    return { data: enriched, meta: { page, limit, total, hasMore: page * limit < total } };
  }

  async getLocalFeed(userId: string, query: FeedQueryDto) {
    const { page = 1, limit = 20 } = query;
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile?.districtId) {
      // Return empty results gracefully instead of throwing 400
      return { data: [], meta: { page, limit, total: 0, hasMore: false } };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          districtId: profile.districtId,
          isArchived: false,
          visibility: VisibilityScope.PUBLIC,
        },
        include: {
          user: { include: { profile: true } },
          mediaAssets: { orderBy: { orderIndex: 'asc' } },
          hashtags: { include: { hashtag: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.post.count({
        where: { districtId: profile.districtId, isArchived: false, visibility: VisibilityScope.PUBLIC },
      }),
    ]);

    const enriched = await Promise.all(
      posts.map((p) => this.enrichPost(p as unknown as Record<string, unknown>, userId)),
    );

    return { data: enriched, meta: { page, limit, total, hasMore: page * limit < total } };
  }

  async getUserPosts(targetUserId: string, currentUserId: string, query: FeedQueryDto) {
    const { page = 1, limit = 20 } = query;
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          userId: targetUserId,
          isArchived: false,
          visibility: { in: [VisibilityScope.PUBLIC, VisibilityScope.FOLLOWERS] },
        },
        include: {
          user: { include: { profile: true } },
          mediaAssets: { orderBy: { orderIndex: 'asc' } },
          hashtags: { include: { hashtag: true } },
          poll: { include: { options: { orderBy: { orderIndex: 'asc' } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.post.count({
        where: {
          userId: targetUserId,
          isArchived: false,
          visibility: { in: [VisibilityScope.PUBLIC, VisibilityScope.FOLLOWERS] },
        },
      }),
    ]);

    const enriched = await Promise.all(
      posts.map((p) => this.enrichPost(p as unknown as Record<string, unknown>, currentUserId)),
    );

    return { data: enriched, meta: { page, limit, total, hasMore: page * limit < total } };
  }

  async react(userId: string, postId: string, dto: ReactToPostDto) {
    await this.prisma.postInteraction.upsert({
      where: {
        postId_userId_type: { postId, userId, type: dto.type },
      },
      update: {},
      create: { postId, userId, type: dto.type },
    });

    await this.prisma.post.update({
      where: { id: postId },
      data: { reactionCount: { increment: 1 } },
    });

    await this.redis.del(`post:${postId}:reactions`);
    await this.redis.del(`post:${postId}`);
    return { success: true };
  }

  async removeReaction(userId: string, postId: string, type: ReactionType) {
    try {
      await this.prisma.postInteraction.delete({
        where: { postId_userId_type: { postId, userId, type } },
      });
      await this.prisma.post.update({
        where: { id: postId },
        data: { reactionCount: { decrement: 1 } },
      });
      await this.redis.del(`post:${postId}:reactions`);
      await this.redis.del(`post:${postId}`);
    } catch {
      // ignore
    }
    return { success: true };
  }

  async bookmark(userId: string, postId: string) {
    await this.prisma.bookmark.upsert({
      where: { userId_postId: { userId, postId } },
      update: {},
      create: { userId, postId },
    });
    await this.prisma.post.update({ where: { id: postId }, data: { bookmarkCount: { increment: 1 } } });
    return { success: true };
  }

  async removeBookmark(userId: string, postId: string) {
    try {
      await this.prisma.bookmark.delete({
        where: { userId_postId: { userId, postId } },
      });
      await this.prisma.post.update({ where: { id: postId }, data: { bookmarkCount: { decrement: 1 } } });
    } catch {
      // ignore
    }
    return { success: true };
  }

  async trackShare(postId: string) {
    await this.prisma.post.update({
      where: { id: postId },
      data: { shareCount: { increment: 1 } },
    });
    return { success: true };
  }

  async repost(userId: string, postId: string, content?: string) {
    const original = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!original) throw new NotFoundException('Post not found');

    const post = await this.prisma.post.create({
      data: {
        userId,
        content: content || '',
        sharedPostId: postId,
        visibility: VisibilityScope.PUBLIC,
        editDeadline: new Date(Date.now() + 30 * 60 * 1000),
      },
      include: { user: { include: { profile: true } }, mediaAssets: true, hashtags: { include: { hashtag: true } } },
    });

    await this.prisma.post.update({
      where: { id: postId },
      data: { shareCount: { increment: 1 } },
    });

    await this.prisma.userProfile.update({
      where: { userId },
      data: { postCount: { increment: 1 } },
    });

    await this.awardPoints(userId, 'POST_CREATED', 10, { postId: post.id });

    return this.getById(post.id, userId);
  }

  async hide(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException('Not your post');

    await this.prisma.post.update({
      where: { id: postId },
      data: { hiddenFromTimeline: true },
    });
    await this.redis.del(`post:${postId}`);
    return { success: true };
  }

  async flagRumor(userId: string, postId: string) {
    const existing = await this.prisma.rumorFlag.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existing) return { success: true, message: 'Already flagged' };

    await this.prisma.rumorFlag.create({
      data: { postId, userId },
    });

    const count = await this.prisma.rumorFlag.count({ where: { postId } });

    if (count >= 5) {
      await this.prisma.post.update({
        where: { id: postId },
        data: { factCheckStatus: 'UNDER_REVIEW' },
      });
    }

    await this.awardPoints(userId, 'MISINFO_REPORTED', 15, { postId });

    return { success: true, flagCount: count };
  }

  async factCheck(userId: string, postId: string, status: 'VERIFIED' | 'FALSE_INFORMATION') {
    // In production, check if user is admin/moderator
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    await this.prisma.post.update({
      where: { id: postId },
      data: { factCheckStatus: status },
    });
    await this.redis.del(`post:${postId}`);
    return { success: true, status };
  }

  private async awardPoints(userId: string, reason: any, amount: number, metadata?: Record<string, unknown>) {
    await this.prisma.pointsLog.create({
      data: { userId, amount, reason, metadata: (metadata || {}) as any },
    });
    await this.prisma.userProfile.update({
      where: { userId },
      data: { bondhuPoints: { increment: amount } },
    });
    await this.updatePointsLevel(userId);
  }

  private async updatePointsLevel(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) return;
    const points = profile.bondhuPoints;
    let level: any = 'NEW_FRIEND';
    if (points > 5000) level = 'LEGEND';
    else if (points > 1000) level = 'STAR';
    else if (points > 500) level = 'TRUSTED_FRIEND';
    else if (points > 100) level = 'ACQUAINTANCE';
    if (profile.pointsLevel !== level) {
      await this.prisma.userProfile.update({ where: { userId }, data: { pointsLevel: level } });
    }
  }

  async getBookmarkedPosts(userId: string, query: FeedQueryDto) {
    const { page = 1, limit = 20 } = query;
    const [bookmarks, total] = await Promise.all([
      this.prisma.bookmark.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          post: {
            include: {
              user: { include: { profile: true } },
              mediaAssets: { orderBy: { orderIndex: 'asc' } },
              hashtags: { include: { hashtag: true } },
              poll: { include: { options: { orderBy: { orderIndex: 'asc' } } } },
            },
          },
        },
      }),
      this.prisma.bookmark.count({ where: { userId } }),
    ]);

    const posts = bookmarks.map((b) => b.post).filter(Boolean);
    const enriched = await Promise.all(
      posts.map((p) => this.enrichPost(p as unknown as Record<string, unknown>, userId)),
    );

    return { data: enriched, meta: { page, limit, total, hasMore: page * limit < total } };
  }

  private async enrichPost(post: Record<string, unknown>, currentUserId?: string) {
    const postId = post.id as string;
    const myReaction = currentUserId
      ? await this.prisma.postInteraction.findFirst({
          where: { postId, userId: currentUserId },
        })
      : null;
    const isBookmarked = currentUserId
      ? !!(await this.prisma.bookmark.findUnique({
          where: { userId_postId: { userId: currentUserId, postId } },
        }))
      : false;
    return { ...post, myReaction: myReaction?.type || null, isBookmarked };
  }

  private extractHashtags(content: string): string[] {
    const matches = content.match(/#\w+/g);
    return matches ? [...new Set(matches.map((m) => m.slice(1).toLowerCase()))] : [];
  }

  private async processHashtags(postId: string, names: string[]) {
    for (const name of names) {
      const phoneticKey = this.toPhoneticKey(name);
      const hashtag = await this.prisma.hashtag.upsert({
        where: { tag: name },
        update: { postCount: { increment: 1 }, lastUsedAt: new Date() },
        create: { tag: name, phoneticKey, postCount: 1 },
      });
      await this.prisma.postHashtag.upsert({
        where: { postId_hashtagId: { postId, hashtagId: hashtag.id } },
        update: {},
        create: { postId, hashtagId: hashtag.id },
      });
    }
  }

  private toPhoneticKey(tag: string): string {
    // Simplified phonetic unification for Bangla/English/Banglish
    return tag
      .toLowerCase()
      .replace(/[০-৯]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 2534 + 48))
      .replace(/[ক খ গ ঘ ঙ]/g, 'k')
      .replace(/[চ ছ জ ঝ ঞ]/g, 'c')
      .replace(/[ট ঠ ড ঢ ণ]/g, 't')
      .replace(/[ত থ দ ধ ন]/g, 't')
      .replace(/[প ফ ব ভ ম]/g, 'p')
      .replace(/[য র ল ব শ ষ স হ]/g, 'y')
      .replace(/[া ি ী ু ূ ৃ ে ৈ ো ৌ]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  private async invalidateUserFeeds(userId: string) {
    await this.redis.delPattern(`feed:foryou:${userId}*`);
    await this.redis.delPattern(`feed:latest:${userId}*`);
  }
}
