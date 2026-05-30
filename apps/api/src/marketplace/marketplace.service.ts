import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import type { CreateMarketplaceItemDto, BrowseItemsQueryDto } from './dto/marketplace.dto';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateMarketplaceItemDto) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    return this.prisma.marketplaceItem.create({
      data: {
        sellerId: userId,
        title: dto.title,
        description: dto.description,
        price: dto.price,
        condition: dto.condition,
        category: dto.category,
        districtId: dto.districtId ?? profile?.districtId,
        subDistrictId: dto.subDistrictId ?? profile?.subDistrictId,
        isNegotiable: dto.isNegotiable ?? false,
        isVerifiedSeller: profile?.verificationType === 'GREEN_BUSINESS',
      },
      include: { seller: { include: { profile: true } }, mediaAssets: true },
    });
  }

  async browse(query: BrowseItemsQueryDto) {
    const { category, districtId, minPrice, maxPrice, verifiedOnly, page = 1, limit = 20 } = query;

    const where: Record<string, unknown> = { isSold: false, visibility: 'PUBLIC' };
    if (category) where.category = category;
    if (districtId) where.districtId = districtId;
    if (minPrice !== undefined) where.price = { ...(where.price as object), gte: minPrice };
    if (maxPrice !== undefined) where.price = { ...(where.price as object), lte: maxPrice };
    if (verifiedOnly) where.isVerifiedSeller = true;

    const [items, total] = await Promise.all([
      this.prisma.marketplaceItem.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { seller: { include: { profile: true } }, mediaAssets: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.marketplaceItem.count({ where }),
    ]);

    return { data: items, meta: { page, limit, total } };
  }

  async getById(id: string) {
    const item = await this.prisma.marketplaceItem.findUnique({
      where: { id },
      include: { seller: { include: { profile: true } }, mediaAssets: true },
    });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async update(userId: string, id: string, dto: Partial<CreateMarketplaceItemDto>) {
    const item = await this.prisma.marketplaceItem.findUnique({ where: { id } });
    if (!item || item.sellerId !== userId) throw new ForbiddenException('Not your item');
    return this.prisma.marketplaceItem.update({
      where: { id },
      data: dto,
      include: { seller: { include: { profile: true } }, mediaAssets: true },
    });
  }

  async delete(userId: string, id: string) {
    const item = await this.prisma.marketplaceItem.findUnique({ where: { id } });
    if (!item || item.sellerId !== userId) throw new ForbiddenException('Not your item');
    await this.prisma.marketplaceItem.update({ where: { id }, data: { isSold: true } });
    return { success: true };
  }

  async search(q: string, page = 1, limit = 20) {
    const [items, total] = await Promise.all([
      this.prisma.marketplaceItem.findMany({
        where: {
          isSold: false,
          visibility: 'PUBLIC',
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        skip: (page - 1) * limit,
        take: limit,
        include: { seller: { include: { profile: true } }, mediaAssets: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.marketplaceItem.count({
        where: {
          isSold: false,
          visibility: 'PUBLIC',
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
      }),
    ]);
    return { data: items, meta: { page, limit, total } };
  }
}
