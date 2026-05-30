import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Search')
@Controller('search')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Universal search' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async search(
    @Query('q') q: string,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.universalSearch(q, type, Number(page) || 1, Number(limit) || 20);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Trending hashtags' })
  @ApiQuery({ name: 'districtId', required: false })
  async getTrends(@Query('districtId') districtId?: string) {
    return this.searchService.getTrends(districtId ? Number(districtId) : undefined);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Autocomplete suggestions' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'type', required: false })
  async getSuggestions(@Query('q') q: string, @Query('type') type?: string) {
    return this.searchService.getSuggestions(q, type);
  }
}
