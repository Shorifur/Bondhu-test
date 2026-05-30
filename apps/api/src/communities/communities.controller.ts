import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommunitiesService } from './communities.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateCommunityDto, UpdateMemberRoleDto, CreateRuleDto, CreateCommunityPostDto } from './dto/communities.dto';
import { CommunityCategory } from '@prisma/client';

@ApiTags('Communities')
@Controller('communities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create community' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateCommunityDto) {
    return this.communitiesService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List communities' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'districtId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('category') category?: CommunityCategory,
    @Query('districtId') districtId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.communitiesService.findAll(
      category,
      districtId ? Number(districtId) : undefined,
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get community by slug' })
  async findBySlug(@Param('slug') slug: string, @CurrentUser('id') userId: string) {
    return this.communitiesService.findBySlug(slug, userId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join community' })
  async join(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.communitiesService.join(userId, id);
  }

  @Post(':id/leave')
  @ApiOperation({ summary: 'Leave community' })
  async leave(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.communitiesService.leave(userId, id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'List members' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getMembers(@Param('id') id: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.communitiesService.getMembers(id, Number(page) || 1, Number(limit) || 50);
  }

  @Post(':id/members/:userId/role')
  @ApiOperation({ summary: 'Update member role' })
  async updateMemberRole(
    @CurrentUser('id') actorId: string,
    @Param('id') communityId: string,
    @Param('userId') targetId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.communitiesService.updateMemberRole(actorId, communityId, targetId, dto);
  }

  @Post(':id/rules')
  @ApiOperation({ summary: 'Add community rule' })
  async addRule(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: CreateRuleDto) {
    return this.communitiesService.addRule(userId, id, dto);
  }

  @Post(':id/posts')
  @ApiOperation({ summary: 'Create post in community' })
  async createPost(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: CreateCommunityPostDto) {
    return this.communitiesService.createPost(userId, id, dto);
  }

  @Get(':id/posts')
  @ApiOperation({ summary: 'Get community posts' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getCommunityPosts(@Param('id') id: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.communitiesService.getCommunityPosts(id, Number(page) || 1, Number(limit) || 20);
  }

  @Post(':id/transfer-ownership')
  @ApiOperation({ summary: 'Transfer ownership' })
  async transferOwnership(
    @CurrentUser('id') actorId: string,
    @Param('id') communityId: string,
    @Body() body: { targetUserId: string },
  ) {
    return this.communitiesService.transferOwnership(actorId, communityId, body.targetUserId);
  }
}
