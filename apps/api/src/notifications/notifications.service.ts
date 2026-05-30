import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { RedisService } from '../common/services/redis.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(userId: string, type: NotificationType, data: {
    title?: string;
    body: string;
    actorId?: string;
    postId?: string;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title: data.title,
        body: data.body,
        actorId: data.actorId,
        postId: data.postId,
      },
      include: { actor: { include: { profile: true } } },
    });

    // TODO: Push to WebSocket
    return notification;
  }

  async getNotifications(userId: string, page = 1, limit = 50) {
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        include: { actor: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { data: notifications, unreadCount, meta: { page, limit, total } };
  }

  async markRead(userId: string, notificationId?: string) {
    if (notificationId) {
      await this.prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true, readAt: new Date() },
      });
    } else {
      await this.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });
    }
    return { success: true };
  }
}
