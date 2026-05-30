import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BazaarService } from './bazaar.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreatePriceReportDto } from './dto/bazaar.dto';

@ApiTags('Bazaar')
@Controller('bazaar')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BazaarController {
  constructor(private readonly bazaarService: BazaarService) {}

  @Post('reports')
  @ApiOperation({ summary: 'Submit price report' })
  async createReport(@CurrentUser('id') userId: string, @Body() dto: CreatePriceReportDto) {
    return this.bazaarService.createReport(userId, dto);
  }

  @Get('reports')
  @ApiOperation({ summary: 'List price reports' })
  async getReports(@Query('districtId') districtId?: string, @Query('itemType') itemType?: string) {
    return this.bazaarService.getReports(
      districtId ? Number(districtId) : undefined,
      itemType,
    );
  }

  @Get('trends/:districtId')
  @ApiOperation({ summary: 'Get price trends by district' })
  async getTrends(@Param('districtId') districtId: string) {
    return this.bazaarService.getTrends(Number(districtId));
  }
}
