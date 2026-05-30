import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import type { CreateReportDto, ResolveReportDto } from './dto/moderation.dto';

@Injectable()
export class ModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(reporterId: string, dto: CreateReportDto) {
    return this.prisma.report.create({
      data: {
        reporterId,
        type: dto.type,
        code: dto.code,
        description: dto.description,
        postId: dto.postId,
        commentId: dto.commentId,
        reportedUserId: dto.reportedUserId,
        status: 'PENDING',
      },
    });
  }

  async getReports(userId: string, page = 1, limit = 50) {
    // Check if user is admin/moderator
    const isAdmin = await this.isAdmin(userId);
    if (!isAdmin) throw new ForbiddenException('Admin access required');

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          reporter: { include: { profile: true } },
          reportedUser: { include: { profile: true } },
          post: true,
          comment: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.report.count(),
    ]);

    return { data: reports, meta: { page, limit, total } };
  }

  async resolveReport(userId: string, reportId: string, dto: ResolveReportDto) {
    const isAdmin = await this.isAdmin(userId);
    if (!isAdmin) throw new ForbiddenException('Admin access required');

    const report = await this.prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');

    return this.prisma.report.update({
      where: { id: reportId },
      data: {
        status: 'RESOLVED',
        moderatorId: userId,
        resolvedAt: new Date(),
        resolutionNote: dto.resolutionNote,
      },
    });
  }

  private async isAdmin(userId: string): Promise<boolean> {
    // Simplified: in production check admin roles table
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user?.phoneNumber === '+8800000000000';
  }
}
