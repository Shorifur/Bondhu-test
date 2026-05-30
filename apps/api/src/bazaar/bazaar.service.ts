import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { PriceItemType } from '@prisma/client';
import type { CreatePriceReportDto } from './dto/bazaar.dto';

@Injectable()
export class BazaarService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(userId: string, dto: CreatePriceReportDto) {
    const report = await this.prisma.priceReport.create({
      data: {
        reporterId: userId,
        districtId: dto.districtId,
        itemType: dto.itemType,
        itemName: dto.itemName,
        price: dto.price,
        unit: dto.unit,
        note: dto.note,
      },
      include: { reporter: { include: { profile: true } }, district: true },
    });
    return { data: report };
  }

  async getReports(districtId?: number, itemType?: string) {
    const where: Record<string, unknown> = {};
    if (districtId) where.districtId = districtId;
    if (itemType) where.itemType = itemType as PriceItemType;

    const reports = await this.prisma.priceReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { reporter: { include: { profile: true } }, district: true },
    });

    const grouped = new Map<string, { itemType: string; itemName: string; avgPrice: number; count: number; latest: Date; districtId: number }[]>();
    for (const r of reports) {
      const key = r.itemType;
      if (!grouped.has(key)) grouped.set(key, []);
      const arr = grouped.get(key)!;
      const existing = arr.find((x) => x.districtId === r.districtId);
      if (existing) {
        existing.avgPrice = (existing.avgPrice * existing.count + Number(r.price)) / (existing.count + 1);
        existing.count++;
        if (r.createdAt > existing.latest) existing.latest = r.createdAt;
      } else {
        arr.push({ itemType: r.itemType, itemName: r.itemName, avgPrice: Number(r.price), count: 1, latest: r.createdAt, districtId: r.districtId });
      }
    }

    return { data: reports, grouped: Object.fromEntries(grouped) };
  }

  async getTrends(districtId: number) {
    const reports = await this.prisma.priceReport.findMany({
      where: { districtId },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const trends = new Map<string, { current: number; previous: number | null; changePct: number | null }>();
    const byItem = new Map<string, typeof reports>();
    for (const r of reports) {
      if (!byItem.has(r.itemType)) byItem.set(r.itemType, []);
      byItem.get(r.itemType)!.push(r);
    }

    for (const [itemType, items] of byItem) {
      const sorted = items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const current = Number(sorted[0].price);
      const previous = sorted.length > 1 ? Number(sorted[1].price) : null;
      const changePct = previous ? ((current - previous) / previous) * 100 : null;
      trends.set(itemType, { current, previous, changePct });
    }

    return { data: Object.fromEntries(trends) };
  }
}
