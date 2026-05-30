import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateShopDto, UpdateShopDto, CreateProductDto, UpdateProductDto } from './dto/shops.dto';

@ApiTags('Shops')
@Controller('shops')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @ApiOperation({ summary: 'Create shop' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateShopDto) {
    return this.shopsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List shops' })
  @ApiQuery({ name: 'districtId', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('districtId') districtId?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.shopsService.findAll(
      districtId ? Number(districtId) : undefined,
      category,
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Get(':handle')
  @ApiOperation({ summary: 'Get shop by handle' })
  async findByHandle(@Param('handle') handle: string) {
    return this.shopsService.findByHandle(handle);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update shop' })
  async update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateShopDto) {
    return this.shopsService.update(userId, id, dto);
  }

  @Post(':id/products')
  @ApiOperation({ summary: 'Add product to shop' })
  async addProduct(
    @CurrentUser('id') userId: string,
    @Param('id') shopId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.shopsService.addProduct(userId, shopId, dto);
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'List shop products' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getProducts(
    @Param('id') shopId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.shopsService.getProducts(shopId, Number(page) || 1, Number(limit) || 20);
  }

  @Patch(':id/products/:productId')
  @ApiOperation({ summary: 'Update product' })
  async updateProduct(
    @CurrentUser('id') userId: string,
    @Param('id') shopId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.shopsService.updateProduct(userId, shopId, productId, dto);
  }
}
