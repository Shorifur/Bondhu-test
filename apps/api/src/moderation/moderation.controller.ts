import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ModerationService } from './moderation.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateReportDto, ResolveReportDto } from './dto/moderation.dto';

@ApiTags('Moderation')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post()
  @ApiOperation({ summary: 'Submit report' })
  async createReport(@CurrentUser('id') userId: string, @Body() dto: CreateReportDto) {
    return this.moderationService.createReport(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List reports (admin only)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getReports(@CurrentUser('id') userId: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.moderationService.getReports(userId, Number(page) || 1, Number(limit) || 50);
  }

  @Post(':id/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve report (admin only)' })
  async resolveReport(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: ResolveReportDto,
  ) {
    return this.moderationService.resolveReport(userId, id, dto);
  }
}
