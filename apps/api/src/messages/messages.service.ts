import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { RedisService } from '../common/services/redis.service';
import type { CreateConversationDto, SendMessageDto, ForwardMessageDto } from './dto/messages.dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getConversations(userId: string) {
    const participants = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: { user: { include: { profile: true } } },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: { sender: { include: { profile: true } } },
            },
          },
        },
      },
      orderBy: { conversation: { lastMessageAt: 'desc' } },
    });

    return participants.map((p) => ({
      ...p.conversation,
      unreadCount: p.unreadCount,
      lastReadAt: p.lastReadAt,
      isMuted: p.isMuted,
      myRole: p.role,
      lastMessage: p.conversation.messages[0] || null,
    }));
  }

  async createConversation(userId: string, dto: CreateConversationDto) {
    if (userId === dto.participantId) throw new ForbiddenException('Cannot chat with yourself');

    // Check if direct conversation already exists
    const existing = await this.prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        participants: {
          every: {
            userId: { in: [userId, dto.participantId] },
          },
        },
      },
      include: { participants: { include: { user: { include: { profile: true } } } } },
    });

    if (existing) return existing;

    const conversation = await this.prisma.conversation.create({
      data: {
        type: 'DIRECT',
        participants: {
          create: [
            { userId, role: 'OWNER' },
            { userId: dto.participantId, role: 'OWNER' },
          ],
        },
      },
      include: { participants: { include: { user: { include: { profile: true } } } } },
    });

    return conversation;
  }

  async getConversation(userId: string, conversationId: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
      include: {
        conversation: {
          include: {
            participants: { include: { user: { include: { profile: true } } } },
          },
        },
      },
    });

    if (!participant) throw new ForbiddenException('Not a participant');
    return participant.conversation;
  }

  async getMessages(userId: string, conversationId: string, page = 1, limit = 50) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participant) throw new ForbiddenException('Not a participant');

    const [messages, total] = await Promise.all([
      this.prisma.directMessage.findMany({
        where: { conversationId },
        include: {
          sender: { include: { profile: true } },
          replyTo: { include: { sender: { include: { profile: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.directMessage.count({ where: { conversationId } }),
    ]);

    // Cache recent messages
    await this.redis.set(
      `chat:buffer:${conversationId}`,
      messages.slice(0, 100),
      3600,
    );

    return { data: messages.reverse(), meta: { page, limit, total } };
  }

  async sendMessage(userId: string, dto: SendMessageDto) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: dto.conversationId, userId } },
    });
    if (!participant) throw new ForbiddenException('Not a participant');

    const message = await this.prisma.directMessage.create({
      data: {
        conversationId: dto.conversationId,
        senderId: userId,
        content: dto.content,
        type: dto.type ?? 'TEXT',
        mediaUrl: dto.mediaUrl,
        replyToId: dto.replyToId || null,
        voiceDuration: dto.voiceDuration,
      },
      include: {
        sender: { include: { profile: true } },
        replyTo: { include: { sender: { include: { profile: true } } } },
      },
    });

    // Update conversation
    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: { lastMessageAt: new Date() },
    });

    // Increment unread for other participants
    await this.prisma.conversationParticipant.updateMany({
      where: {
        conversationId: dto.conversationId,
        userId: { not: userId },
      },
      data: {
        unreadCount: { increment: 1 },
      },
    });

    return message;
  }

  async markRead(userId: string, conversationId: string) {
    await this.prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { unreadCount: 0, lastReadAt: new Date() },
    });

    await this.prisma.directMessage.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true, readAt: new Date() },
    });

    return { success: true };
  }

  async forwardMessage(userId: string, messageId: string, dto: ForwardMessageDto) {
    const original = await this.prisma.directMessage.findUnique({
      where: { id: messageId },
    });
    if (!original) throw new NotFoundException('Message not found');

    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: dto.targetConversationId, userId } },
    });
    if (!participant) throw new ForbiddenException('Not a participant in target conversation');

    const message = await this.prisma.directMessage.create({
      data: {
        conversationId: dto.targetConversationId,
        senderId: userId,
        content: original.content,
        type: original.type,
        mediaUrl: original.mediaUrl,
        forwardedFromId: original.id,
      },
      include: { sender: { include: { profile: true } } },
    });

    await this.prisma.conversation.update({
      where: { id: dto.targetConversationId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  async deleteMessage(userId: string, messageId: string) {
    const message = await this.prisma.directMessage.findUnique({ where: { id: messageId } });
    if (!message) throw new NotFoundException('Message not found');
    if (message.senderId !== userId) throw new ForbiddenException('Not your message');

    await this.prisma.directMessage.update({
      where: { id: messageId },
      data: { isDeleted: true, deletedAt: new Date(), content: null, mediaUrl: null },
    });

    return { success: true };
  }
}
