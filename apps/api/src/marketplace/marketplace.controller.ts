import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateMarketplaceItemDto, UpdateMarketplaceItemDto, BrowseItemsQueryDto } from './dto/marketplace.dto';

@ApiTags('Marketplace')
@Controller('marketplace')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('items')
  @ApiOperation({ summary: 'Create marketplace listing' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateMarketplaceItemDto) {
    return this.marketplaceService.create(userId, dto);
  }

  @Get('items')
  @ApiOperation({ summary: 'Browse items' })
  async browse(@Query() query: BrowseItemsQueryDto) {
    return this.marketplaceService.browse(query);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get item detail' })
  async getById(@Param('id') id: string) {
    return this.marketplaceService.getById(id);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update item' })
  async update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateMarketplaceItemDto) {
    return this.marketplaceService.update(userId, id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete/mark sold' })
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.marketplaceService.delete(userId, id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search items' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async search(@Query('q') q: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.marketplaceService.search(q, Number(page) || 1, Number(limit) || 20);
  }
}
