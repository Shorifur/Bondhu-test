import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import type { CreateShopDto, UpdateShopDto, CreateProductDto, UpdateProductDto } from './dto/shops.dto';

@Injectable()
export class ShopsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateHandle(name: string): string {
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }

  async create(userId: string, dto: CreateShopDto) {
    const handle = this.generateHandle(dto.name);
    const shop = await this.prisma.shop.create({
      data: {
        ownerId: userId,
        name: dto.name,
        handle,
        description: dto.description,
        category: dto.category || 'General',
        districtId: dto.districtId,
        logoUrl: dto.logoUrl,
        coverUrl: dto.coverUrl,
      },
      include: { owner: { include: { profile: true } }, district: true },
    });
    return { data: shop };
  }

  async findAll(districtId?: number, category?: string, page = 1, limit = 20) {
    const where: Record<string, unknown> = {};
    if (districtId) where.districtId = districtId;
    if (category) where.category = category;

    const [shops, total] = await Promise.all([
      this.prisma.shop.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { owner: { include: { profile: true } }, district: true },
      }),
      this.prisma.shop.count({ where }),
    ]);

    return { data: shops, meta: { page, limit, total } };
  }

  async findByHandle(handle: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { handle },
      include: {
        owner: { include: { profile: true } },
        district: true,
        products: { where: { status: 'AVAILABLE' }, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!shop) throw new NotFoundException('Shop not found');
    return { data: shop };
  }

  async update(userId: string, id: string, dto: UpdateShopDto) {
    const shop = await this.prisma.shop.findUnique({ where: { id } });
    if (!shop) throw new NotFoundException('Shop not found');
    if (shop.ownerId !== userId) throw new ForbiddenException('Not authorized');

    const updated = await this.prisma.shop.update({
      where: { id },
      data: dto,
      include: { owner: { include: { profile: true } }, district: true },
    });
    return { data: updated };
  }

  async addProduct(userId: string, shopId: string, dto: CreateProductDto) {
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');
    if (shop.ownerId !== userId) throw new ForbiddenException('Not authorized');

    const product = await this.prisma.shopProduct.create({
      data: {
        shopId,
        title: dto.title,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        condition: dto.condition,
        images: dto.images,
      },
    });
    return { data: product };
  }

  async getProducts(shopId: string, page = 1, limit = 20) {
    const [products, total] = await Promise.all([
      this.prisma.shopProduct.findMany({
        where: { shopId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.shopProduct.count({ where: { shopId } }),
    ]);
    return { data: products, meta: { page, limit, total } };
  }

  async updateProduct(userId: string, shopId: string, productId: string, dto: UpdateProductDto) {
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');
    if (shop.ownerId !== userId) throw new ForbiddenException('Not authorized');

    const product = await this.prisma.shopProduct.update({
      where: { id: productId },
      data: dto,
    });
    return { data: product };
  }
}
