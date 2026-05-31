import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateJobDto } from './dto/jobs.dto';

@ApiTags('Jobs')
@Controller('jobs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiOperation({ summary: 'Create job listing' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateJobDto) {
    return this.jobsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List jobs' })
  @ApiQuery({ name: 'districtId', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('districtId') districtId?: string,
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.jobsService.findAll(
      districtId ? Number(districtId) : undefined,
      category,
      type,
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Get('my-posts')
  @ApiOperation({ summary: 'Get jobs posted by current user' })
  async findMyPosts(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.jobsService.findByPoster(userId, Number(page) || 1, Number(limit) || 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by id' })
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update job' })
  async update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: Partial<CreateJobDto>) {
    return this.jobsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete job' })
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.jobsService.remove(userId, id);
  }
}
