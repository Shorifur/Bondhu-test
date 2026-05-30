import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import type { CreateCommentDto } from './dto/comments.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({ where: { id: dto.postId } });
    if (!post) throw new NotFoundException('Post not found');

    let depth = 0;
    if (dto.parentId) {
      const parent = await this.prisma.comment.findUnique({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException('Parent comment not found');
      if (parent.depth >= 4) throw new BadRequestException('Maximum reply depth reached');
      depth = parent.depth + 1;
    }

    const comment = await this.prisma.comment.create({
      data: {
        postId: dto.postId,
        userId,
        parentId: dto.parentId || null,
        content: dto.content,
        depth,
      },
      include: { user: { include: { profile: true } } },
    });

    await this.prisma.post.update({
      where: { id: dto.postId },
      data: { commentCount: { increment: 1 } },
    });

    if (dto.parentId) {
      await this.prisma.comment.update({
        where: { id: dto.parentId },
        data: { replyCount: { increment: 1 } },
      });
    }

    return comment;
  }

  async getByPost(postId: string, page = 1, limit = 20) {
    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { postId, parentId: null },
        include: { user: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.comment.count({ where: { postId, parentId: null } }),
    ]);
    return { data: comments, meta: { page, limit, total } };
  }

  async getReplies(parentId: string, page = 1, limit = 20) {
    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { parentId },
        include: { user: { include: { profile: true } } },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.comment.count({ where: { parentId } }),
    ]);
    return { data: comments, meta: { page, limit, total } };
  }

  async delete(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('Not your comment');

    await this.prisma.comment.delete({ where: { id: commentId } });

    await this.prisma.post.update({
      where: { id: comment.postId },
      data: { commentCount: { decrement: 1 } },
    });

    if (comment.parentId) {
      await this.prisma.comment.update({
        where: { id: comment.parentId },
        data: { replyCount: { decrement: 1 } },
      });
    }

    return { success: true };
  }

  async like(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    await this.prisma.commentInteraction.upsert({
      where: { commentId_userId: { commentId, userId } },
      update: {},
      create: { commentId, userId, type: 'LIKE' },
    });

    await this.prisma.comment.update({
      where: { id: commentId },
      data: { reactionCount: { increment: 1 } },
    });

    return { success: true };
  }

  async unlike(userId: string, commentId: string) {
    try {
      await this.prisma.commentInteraction.delete({
        where: { commentId_userId: { commentId, userId } },
      });
      await this.prisma.comment.update({
        where: { id: commentId },
        data: { reactionCount: { decrement: 1 } },
      });
    } catch {
      // ignore
    }
    return { success: true };
  }
}
