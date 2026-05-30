import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import type { CreateStoryDto } from './dto/stories.dto';

@Injectable()
export class StoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateStoryDto) {
    const story = await this.prisma.story.create({
      data: {
        userId,
        type: dto.type ?? 'STANDARD',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        locationName: dto.locationName,
      },
      include: { user: { include: { profile: true } }, mediaAssets: true },
    });

    if (dto.mediaAssetIds?.length) {
      await this.prisma.mediaAsset.updateMany({
        where: { id: { in: dto.mediaAssetIds } },
        data: { storyId: story.id },
      });
    }

    return story;
  }

  async getFeed(userId: string) {
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId, status: 'ACCEPTED' },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);
    followingIds.push(userId); // Include own stories

    const stories = await this.prisma.story.findMany({
      where: {
        userId: { in: followingIds },
        expiresAt: { gt: new Date() },
        isArchived: false,
      },
      include: {
        user: { include: { profile: true } },
        mediaAssets: { orderBy: { orderIndex: 'asc' } },
        _count: { select: { views: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check which stories user has viewed
    const viewedStoryIds = new Set(
      (
        await this.prisma.storyView.findMany({
          where: { viewerId: userId, storyId: { in: stories.map((s) => s.id) } },
          select: { storyId: true },
        })
      ).map((v) => v.storyId),
    );

    return stories.map((s) => ({
      ...s,
      hasViewed: viewedStoryIds.has(s.id),
    }));
  }

  async getById(id: string, userId?: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: {
        user: { include: { profile: true } },
        mediaAssets: true,
        stickers: true,
        _count: { select: { views: true } },
      },
    });

    if (!story) return null;

    const hasViewed = userId
      ? !!(await this.prisma.storyView.findUnique({
          where: { storyId_viewerId: { storyId: id, viewerId: userId } },
        }))
      : false;

    return { ...story, hasViewed };
  }

  async viewStory(storyId: string, viewerId: string) {
    await this.prisma.storyView.upsert({
      where: { storyId_viewerId: { storyId, viewerId } },
      update: {},
      create: { storyId, viewerId },
    });

    await this.prisma.story.update({
      where: { id: storyId },
      data: { viewCount: { increment: 1 } },
    });

    return { success: true };
  }

  async delete(userId: string, storyId: string) {
    const story = await this.prisma.story.findUnique({ where: { id: storyId } });
    if (!story || story.userId !== userId) throw new Error('Unauthorized');
    await this.prisma.story.update({ where: { id: storyId }, data: { isArchived: true } });
    return { success: true };
  }
}
