import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/services/prisma.service';
import { RedisService } from '../common/services/redis.service';
import { MessagesService } from '../messages/messages.service';
import { DEV_TOKEN, DEV_USER_ID, getOrCreateDevUser } from '../common/helpers/dev-user.helper';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  path: '/ws',
  cors: { origin: '*' },
  pingInterval: 30000,
  pingTimeout: 10000,
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(WsGateway.name);
  private readonly userSockets = new Map<string, Set<string>>(); // userId -> socketIds

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly messagesService: MessagesService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = (client.handshake.auth?.token as string) || (client.handshake.query.token as string);
      if (!token) {
        client.disconnect();
        return;
      }

      let userId: string;

      if (
        process.env.NODE_ENV !== 'production' &&
        token === DEV_TOKEN
      ) {
        await getOrCreateDevUser(this.prisma);
        userId = DEV_USER_ID;
      } else {
        const payload = this.jwt.verify(token, {
          secret: this.config.get<string>('app.jwtSecret'),
        });

        if (payload.type !== 'access') {
          client.disconnect();
          return;
        }

        userId = payload.sub;
      }

      client.userId = userId;

      // Track socket
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      // Update presence
      await this.redis.set(`presence:${userId}`, { status: 'online', lastSeenAt: new Date().toISOString() }, 300);
      await this.redis.getClient().sadd('presence:online', userId);

      // Join personal room
      client.join(`user:${userId}`);

      this.logger.debug(`Client connected: ${client.id} (user: ${userId})`);
    } catch (err) {
      this.logger.warn(`Connection rejected: ${err}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    if (!client.userId) return;

    const sockets = this.userSockets.get(client.userId);
    if (sockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.userSockets.delete(client.userId);
        await this.redis.set(`presence:${client.userId}`, { status: 'offline', lastSeenAt: new Date().toISOString() }, 300);
        await this.redis.getClient().srem('presence:online', client.userId);
      }
    }

    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('presence:update')
  async handlePresenceUpdate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { status: 'online' | 'busy' | 'offline' },
  ) {
    if (!client.userId) return;
    await this.redis.set(`presence:${client.userId}`, { status: data.status, lastSeenAt: new Date().toISOString() }, 300);
    this.broadcastToFriends(client.userId, 'presence:broadcast', { userId: client.userId, status: data.status });
  }

  @SubscribeMessage('typing:start')
  async handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId) return;
    await this.redis.set(`typing:${data.conversationId}:${client.userId}`, Date.now(), 10);
    client.to(`conv:${data.conversationId}`).emit('typing:start', { conversationId: data.conversationId, userId: client.userId });
  }

  @SubscribeMessage('typing:stop')
  async handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId) return;
    await this.redis.del(`typing:${data.conversationId}:${client.userId}`);
    client.to(`conv:${data.conversationId}`).emit('typing:stop', { conversationId: data.conversationId, userId: client.userId });
  }

  @SubscribeMessage('message:send')
  async handleMessageSend(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; content?: string; type?: string; mediaUrl?: string; replyToId?: string; voiceDuration?: number },
  ) {
    if (!client.userId) return;

    try {
      const message = await this.messagesService.sendMessage(client.userId, {
        conversationId: data.conversationId,
        content: data.content,
        type: data.type as any,
        mediaUrl: data.mediaUrl,
        replyToId: data.replyToId,
        voiceDuration: data.voiceDuration,
      });

      // Emit to conversation room
      this.server.to(`conv:${data.conversationId}`).emit('message:received', message);
    } catch (err) {
      client.emit('error', { message: err.message });
    }
  }

  @SubscribeMessage('message:read')
  async handleMessageRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId) return;

    await this.messagesService.markRead(client.userId, data.conversationId);
    client.to(`conv:${data.conversationId}`).emit('message:read', { conversationId: data.conversationId, userId: client.userId });
  }

  @SubscribeMessage('call:offer')
  handleCallOffer(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { calleeId: string; sdp: string; conversationId: string },
  ) {
    if (!client.userId) return;
    this.server.to(`user:${data.calleeId}`).emit('call:offer', {
      callerId: client.userId,
      sdp: data.sdp,
      conversationId: data.conversationId,
    });
  }

  @SubscribeMessage('call:answer')
  handleCallAnswer(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { callerId: string; sdp: string },
  ) {
    if (!client.userId) return;
    this.server.to(`user:${data.callerId}`).emit('call:answer', {
      calleeId: client.userId,
      sdp: data.sdp,
    });
  }

  @SubscribeMessage('call:ice-candidate')
  handleIceCandidate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { targetId: string; candidate: RTCIceCandidateInit },
  ) {
    if (!client.userId) return;
    this.server.to(`user:${data.targetId}`).emit('call:ice-candidate', {
      senderId: client.userId,
      candidate: data.candidate,
    });
  }

  @SubscribeMessage('call:end')
  handleCallEnd(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { targetId: string },
  ) {
    if (!client.userId) return;
    this.server.to(`user:${data.targetId}`).emit('call:end', {
      senderId: client.userId,
    });
  }

  @SubscribeMessage('conversation:join')
  handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conv:${data.conversationId}`);
  }

  @SubscribeMessage('conversation:leave')
  handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conv:${data.conversationId}`);
  }

  private broadcastToFriends(userId: string, event: string, data: unknown) {
    // Simplified: broadcast to all online users
    // In production, use Redis pub/sub for multi-server
    this.server.emit(event, data);
  }

  // Public method for other services to emit events
  emitToUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
