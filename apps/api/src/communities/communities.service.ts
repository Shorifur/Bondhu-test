import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import type { CreateCommunityDto, UpdateMemberRoleDto, CreateRuleDto, CreateCommunityPostDto } from './dto/communities.dto';
import { CommunityRole, JoinType, CommunityCategory } from '@prisma/client';

@Injectable()
export class CommunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(name: string): string {
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }

  async create(userId: string, dto: CreateCommunityDto) {
    const slug = this.generateSlug(dto.name);
    const community = await this.prisma.community.create({
      data: {
        ownerId: userId,
        name: dto.name,
        slug,
        description: dto.description,
        category: dto.category,
        districtId: dto.districtId,
        subDistrictId: dto.subDistrictId,
        visibility: dto.visibility ?? 'PUBLIC',
        joinType: dto.joinType ?? 'OPEN',
        memberships: {
          create: { userId, role: 'OWNER' },
        },
      },
      include: { memberships: { include: { user: { include: { profile: true } } } } },
    });
    return community;
  }

  async findAll(category?: CommunityCategory, districtId?: number, page = 1, limit = 20) {
    const where: Record<string, unknown> = { visibility: 'PUBLIC' };
    if (category) where.category = category;
    if (districtId) where.districtId = districtId;

    const [communities, total] = await Promise.all([
      this.prisma.community.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { memberCount: 'desc' },
      }),
      this.prisma.community.count({ where }),
    ]);

    return { data: communities, meta: { page, limit, total } };
  }

  async findBySlug(slug: string, userId?: string) {
    const community = await this.prisma.community.findUnique({
      where: { slug },
      include: {
        rules: { orderBy: { orderIndex: 'asc' } },
        memberships: { include: { user: { include: { profile: true } } } },
      },
    });

    if (!community) throw new NotFoundException('Community not found');

    const myMembership = userId
      ? community.memberships.find((m) => m.userId === userId)
      : null;

    return {
      ...community,
      myRole: myMembership?.role || null,
      myMembershipStatus: myMembership?.status || null,
    };
  }

  async join(userId: string, communityId: string) {
    const community = await this.prisma.community.findUnique({ where: { id: communityId } });
    if (!community) throw new NotFoundException('Community not found');

    const existing = await this.prisma.communityMembership.findUnique({
      where: { communityId_userId: { communityId, userId } },
    });

    if (existing) {
      if (existing.status === 'BANNED') throw new ForbiddenException('You are banned from this community');
      return existing;
    }

    const status = community.joinType === JoinType.OPEN ? 'APPROVED' : 'PENDING';

    const membership = await this.prisma.communityMembership.create({
      data: { communityId, userId, role: 'MEMBER', status },
    });

    if (status === 'APPROVED') {
      await this.prisma.community.update({
        where: { id: communityId },
        data: { memberCount: { increment: 1 } },
      });
    }

    return membership;
  }

  async leave(userId: string, communityId: string) {
    const membership = await this.prisma.communityMembership.findUnique({
      where: { communityId_userId: { communityId, userId } },
    });
    if (!membership) throw new NotFoundException('Membership not found');
    if (membership.role === 'OWNER') {
      throw new ForbiddenException('Owner must transfer ownership before leaving');
    }

    await this.prisma.communityMembership.deleteMany({
      where: { communityId, userId },
    });
    await this.prisma.community.update({
      where: { id: communityId },
      data: { memberCount: { decrement: 1 } },
    });
    return { success: true };
  }

  async transferOwnership(actorId: string, communityId: string, targetUserId: string) {
    const actor = await this.prisma.communityMembership.findUnique({
      where: { communityId_userId: { communityId, userId: actorId } },
    });
    if (!actor || actor.role !== 'OWNER') throw new ForbiddenException('Only owner can transfer ownership');

    const target = await this.prisma.communityMembership.findUnique({
      where: { communityId_userId: { communityId, userId: targetUserId } },
    });
    if (!target || target.status !== 'APPROVED') throw new NotFoundException('Target member not found');

    await this.prisma.communityMembership.update({
      where: { communityId_userId: { communityId, userId: actorId } },
      data: { role: 'ADMIN' },
    });
    await this.prisma.communityMembership.update({
      where: { communityId_userId: { communityId, userId: targetUserId } },
      data: { role: 'OWNER' },
    });
    await this.prisma.community.update({
      where: { id: communityId },
      data: { ownerId: targetUserId },
    });

    return { success: true };
  }

  async getMembers(communityId: string, page = 1, limit = 50) {
    const [members, total] = await Promise.all([
      this.prisma.communityMembership.findMany({
        where: { communityId, status: 'APPROVED' },
        skip: (page - 1) * limit,
        take: limit,
        include: { user: { include: { profile: true } } },
        orderBy: { joinedAt: 'desc' },
      }),
      this.prisma.communityMembership.count({ where: { communityId, status: 'APPROVED' } }),
    ]);
    return { data: members, meta: { page, limit, total } };
  }

  async updateMemberRole(actorId: string, communityId: string, targetUserId: string, dto: UpdateMemberRoleDto) {
    const actor = await this.prisma.communityMembership.findUnique({
      where: { communityId_userId: { communityId, userId: actorId } },
    });
    if (!actor || !['OWNER', 'ADMIN'].includes(actor.role)) throw new ForbiddenException('Not authorized');

    const target = await this.prisma.communityMembership.findUnique({
      where: { communityId_userId: { communityId, userId: targetUserId } },
    });
    if (!target) throw new NotFoundException('Member not found');

    // Role hierarchy checks
    if (dto.role === 'OWNER' && actor.role !== 'OWNER') throw new ForbiddenException('Only owner can assign owner');
    if (dto.role === 'ADMIN' && actor.role !== 'OWNER') throw new ForbiddenException('Only owner can assign admin');
    if (dto.role === 'MODERATOR' && !['OWNER', 'ADMIN'].includes(actor.role)) throw new ForbiddenException('Not authorized');
    if (dto.role === 'SECRETARY' && !['OWNER', 'ADMIN'].includes(actor.role)) throw new ForbiddenException('Not authorized');

    return this.prisma.communityMembership.update({
      where: { communityId_userId: { communityId, userId: targetUserId } },
      data: { role: dto.role },
    });
  }

  async addRule(actorId: string, communityId: string, dto: CreateRuleDto) {
    const actor = await this.prisma.communityMembership.findUnique({
      where: { communityId_userId: { communityId, userId: actorId } },
    });
    if (!actor || !['OWNER', 'ADMIN'].includes(actor.role)) throw new ForbiddenException('Not authorized');

    const count = await this.prisma.communityRule.count({ where: { communityId } });
    if (count >= 10) throw new ForbiddenException('Maximum 10 rules allowed');

    return this.prisma.communityRule.create({
      data: { communityId, orderIndex: count + 1, title: dto.title, description: dto.description },
    });
  }

  async createPost(userId: string, communityId: string, dto: CreateCommunityPostDto) {
    const membership = await this.prisma.communityMembership.findUnique({
      where: { communityId_userId: { communityId, userId } },
    });
    if (!membership || membership.status !== 'APPROVED' || membership.role === 'MUTED') {
      throw new ForbiddenException('Cannot post in this community');
    }

    const post = await this.prisma.post.create({
      data: {
        userId,
        content: dto.content,
        visibility: 'PUBLIC',
      },
    });

    if (dto.mediaAssetIds?.length) {
      await this.prisma.mediaAsset.updateMany({
        where: { id: { in: dto.mediaAssetIds } },
        data: { postId: post.id },
      });
    }

    await this.prisma.communityPost.create({
      data: { communityId, postId: post.id },
    });

    await this.prisma.community.update({
      where: { id: communityId },
      data: { postCount: { increment: 1 } },
    });

    return post;
  }

  async getCommunityPosts(communityId: string, page = 1, limit = 20) {
    const [communityPosts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        where: { communityId },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          post: {
            include: { user: { include: { profile: true } }, mediaAssets: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.communityPost.count({ where: { communityId } }),
    ]);

    return { data: communityPosts.map((cp) => cp.post), meta: { page, limit, total } };
  }
}
