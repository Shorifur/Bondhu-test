import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { RedisService } from '../common/services/redis.service';
import type { UpdateProfileDto, UpdateSettingsDto, UpdatePreferencesDto, CreateVerificationDto, SearchUsersDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, settings: true, preferences: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getByHandle(handle: string, currentUserId?: string) {
    const cacheKey = `profile:handle:${handle}`;
    const cached = await this.redis.get<any>(cacheKey);
    let profile;

    if (cached) {
      profile = cached;
    } else {
      profile = await this.prisma.userProfile.findUnique({
        where: { handle },
        include: { user: { select: { id: true, phoneVerified: true, emailVerified: true, createdAt: true } } },
      });
      if (!profile) throw new NotFoundException('Profile not found');
      await this.redis.set(cacheKey, JSON.stringify(profile), 3600);
    }

    const isFollowing = currentUserId
      ? !!(await this.prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: currentUserId, followingId: profile.userId } },
        }))
      : false;

    return { ...profile, isFollowing };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.bio && dto.bio.length > 150) {
      throw new BadRequestException('Bio must be at most 150 characters');
    }

    const profile = await this.prisma.userProfile.update({
      where: { userId },
      data: {
        ...(dto.displayName && { displayName: dto.displayName }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.pronouns && { pronouns: dto.pronouns }),
        ...(dto.avatarUrl && { avatarUrl: dto.avatarUrl }),
        ...(dto.coverUrl && { coverUrl: dto.coverUrl }),
        ...(dto.districtId && { districtId: dto.districtId }),
        ...(dto.subDistrictId && { subDistrictId: dto.subDistrictId }),
        ...(dto.visibility && { visibility: dto.visibility }),
        ...(dto.language && { language: dto.language }),
        ...(dto.theme && { theme: dto.theme }),
        ...(dto.fontScale && { fontScale: dto.fontScale }),
        ...(dto.highContrast !== undefined && { highContrast: dto.highContrast }),
        ...(dto.reducedMotion !== undefined && { reducedMotion: dto.reducedMotion }),
        ...(dto.autoImageAlt !== undefined && { autoImageAlt: dto.autoImageAlt }),
      },
    });

    await this.invalidateProfileCache(userId, profile.handle);
    return profile;
  }

  async followUser(userId: string, targetUserId: string) {
    if (userId === targetUserId) throw new BadRequestException('Cannot follow yourself');

    await this.prisma.follow.upsert({
      where: { followerId_followingId: { followerId: userId, followingId: targetUserId } },
      update: { status: 'ACCEPTED' },
      create: { followerId: userId, followingId: targetUserId, status: 'ACCEPTED' },
    });

    await this.prisma.userProfile.update({ where: { userId: targetUserId }, data: { followerCount: { increment: 1 } } });
    await this.prisma.userProfile.update({ where: { userId }, data: { followingCount: { increment: 1 } } });
    await this.invalidateProfileCache(userId);
    await this.invalidateProfileCache(targetUserId);
    return { success: true };
  }

  async unfollowUser(userId: string, targetUserId: string) {
    const result = await this.prisma.follow.deleteMany({
      where: { followerId: userId, followingId: targetUserId },
    });
    if (result.count > 0) {
      await this.prisma.userProfile.update({ where: { userId: targetUserId }, data: { followerCount: { decrement: 1 } } });
      await this.prisma.userProfile.update({ where: { userId }, data: { followingCount: { decrement: 1 } } });
      await this.invalidateProfileCache(userId);
      await this.invalidateProfileCache(targetUserId);
    }
    return { success: true };
  }

  async getFollowers(userId: string, page = 1, limit = 20) {
    const [followers, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followingId: userId, status: 'ACCEPTED' },
        skip: (page - 1) * limit,
        take: limit,
        include: { follower: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.follow.count({ where: { followingId: userId, status: 'ACCEPTED' } }),
    ]);
    return { data: followers.map((f) => f.follower.profile), meta: { page, limit, total } };
  }

  async getFollowing(userId: string, page = 1, limit = 20) {
    const [following, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followerId: userId, status: 'ACCEPTED' },
        skip: (page - 1) * limit,
        take: limit,
        include: { following: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.follow.count({ where: { followerId: userId, status: 'ACCEPTED' } }),
    ]);
    return { data: following.map((f) => f.following.profile), meta: { page, limit, total } };
  }

  async muteUser(userId: string, targetUserId: string) {
    await this.prisma.userPreference.update({
      where: { userId },
      data: { mutedUsers: { push: targetUserId } },
    });
    return { success: true };
  }

  async unmuteUser(userId: string, targetUserId: string) {
    const pref = await this.prisma.userPreference.findUnique({ where: { userId } });
    if (pref) {
      await this.prisma.userPreference.update({
        where: { userId },
        data: { mutedUsers: { set: pref.mutedUsers.filter((id) => id !== targetUserId) } },
      });
    }
    return { success: true };
  }

  async blockUser(userId: string, targetUserId: string) {
    await this.unfollowUser(userId, targetUserId);
    await this.unfollowUser(targetUserId, userId);
    // Add to blocked list in preferences
    const pref = await this.prisma.userPreference.findUnique({ where: { userId } });
    const blocked = (pref?.mutedUsers || []).filter((id) => id !== targetUserId);
    blocked.push(targetUserId);
    await this.prisma.userPreference.upsert({
      where: { userId },
      update: { mutedUsers: { set: blocked } },
      create: { userId, mutedUsers: blocked },
    });
    return { success: true };
  }

  async searchUsers(dto: SearchUsersDto) {
    const { q, page = 1, limit = 20 } = dto;
    const [users, total] = await Promise.all([
      this.prisma.userProfile.findMany({
        where: {
          OR: [
            { handle: { contains: q, mode: 'insensitive' } },
            { displayName: { contains: q, mode: 'insensitive' } },
            { legalName: { contains: q, mode: 'insensitive' } },
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
    return { data: users, meta: { page, limit, total } };
  }

  async createVerification(userId: string, dto: CreateVerificationDto) {
    return this.prisma.verificationRequest.create({
      data: {
        userId,
        type: dto.type,
        documentFrontUrl: dto.documentFrontUrl,
        documentBackUrl: dto.documentBackUrl,
        faceMatchUrl: dto.faceMatchUrl,
        status: 'PENDING',
      },
    });
  }

  async getSettings(userId: string) {
    return this.prisma.userSettings.findUnique({ where: { userId } });
  }

  async updateSettings(userId: string, dto: UpdateSettingsDto) {
    return this.prisma.userSettings.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }

  async getPreferences(userId: string) {
    return this.prisma.userPreference.findUnique({ where: { userId } });
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    return this.prisma.userPreference.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }

  async addBlockedWord(userId: string, word: string) {
    return this.prisma.blockedWord.create({ data: { userId, word: word.toLowerCase() } });
  }

  async removeBlockedWord(userId: string, id: string) {
    await this.prisma.blockedWord.deleteMany({ where: { id, userId } });
    return { success: true };
  }

  async addBlockedHashtag(userId: string, hashtag: string) {
    return this.prisma.blockedHashtag.create({ data: { userId, hashtag: hashtag.toLowerCase() } });
  }

  async removeBlockedHashtag(userId: string, id: string) {
    await this.prisma.blockedHashtag.deleteMany({ where: { id, userId } });
    return { success: true };
  }

  private async invalidateProfileCache(userId: string, handle?: string) {
    await this.redis.del(`profile:${userId}`);
    if (handle) await this.redis.del(`profile:handle:${handle}`);
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (profile?.handle) await this.redis.del(`profile:handle:${profile.handle}`);
  }

  // Trusted Contacts
  async getTrustedContacts(userId: string) {
    const contacts = await this.prisma.trustedContact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return { data: contacts };
  }

  async addTrustedContact(userId: string, dto: { contactName: string; contactPhone: string; relationship?: string }) {
    const contact = await this.prisma.trustedContact.create({
      data: { userId, contactName: dto.contactName, contactPhone: dto.contactPhone, relationship: dto.relationship },
    });
    return { data: contact };
  }

  async removeTrustedContact(userId: string, id: string) {
    await this.prisma.trustedContact.deleteMany({ where: { id, userId } });
    return { success: true };
  }

  // SOS
  async createSOS(userId: string, dto: { latitude?: number; longitude?: number; locationName?: string }) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const alert = await this.prisma.sOSAlert.create({
      data: {
        userId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        locationName: dto.locationName,
        expiresAt,
      },
    });
    return { data: alert };
  }

  async getSOSHistory(userId: string) {
    const alerts = await this.prisma.sOSAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return { data: alerts };
  }

  // Points & Leaderboard
  async getPoints(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      select: { bondhuPoints: true, pointsLevel: true, displayName: true, avatarUrl: true, districtId: true },
    });
    const logs = await this.prisma.pointsLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { data: { profile, logs } };
  }

  async getLeaderboard(districtId?: number) {
    const where: Record<string, unknown> = {};
    if (districtId) where.districtId = districtId;

    const topUsers = await this.prisma.userProfile.findMany({
      where,
      orderBy: { bondhuPoints: 'desc' },
      take: 50,
      select: { userId: true, displayName: true, handle: true, avatarUrl: true, bondhuPoints: true, pointsLevel: true, districtId: true },
    });
    return { data: topUsers };
  }
}
