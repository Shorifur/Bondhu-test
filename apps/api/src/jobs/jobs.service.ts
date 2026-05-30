import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { JobCategory } from '@prisma/client';
import type { CreateJobDto } from './dto/jobs.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateJobDto) {
    const job = await this.prisma.job.create({
      data: {
        posterId: userId,
        title: dto.title,
        company: dto.company,
        location: dto.location,
        districtId: dto.districtId,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
        description: dto.description,
        requirements: dto.requirements,
        category: dto.category,
        contactInfo: dto.contactInfo,
        applicationDeadline: dto.applicationDeadline ? new Date(dto.applicationDeadline) : undefined,
      },
      include: { poster: { include: { profile: true } }, district: true },
    });
    return { data: job };
  }

  async findAll(districtId?: number, category?: string, page = 1, limit = 20) {
    const where: Record<string, unknown> = { isActive: true };
    if (districtId) where.districtId = districtId;
    if (category) where.category = category as JobCategory;

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { poster: { include: { profile: true } }, district: true },
      }),
      this.prisma.job.count({ where }),
    ]);

    return { data: jobs, meta: { page, limit, total } };
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { poster: { include: { profile: true } }, district: true },
    });
    if (!job) throw new NotFoundException('Job not found');
    return { data: job };
  }

  async update(userId: string, id: string, dto: Partial<CreateJobDto>) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.posterId !== userId) throw new ForbiddenException('Not authorized');

    const updated = await this.prisma.job.update({
      where: { id },
      data: {
        ...dto,
        applicationDeadline: dto.applicationDeadline ? new Date(dto.applicationDeadline) : undefined,
      },
      include: { poster: { include: { profile: true } }, district: true },
    });
    return { data: updated };
  }

  async remove(userId: string, id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.posterId !== userId) throw new ForbiddenException('Not authorized');

    await this.prisma.job.delete({ where: { id } });
    return { success: true };
  }
}
