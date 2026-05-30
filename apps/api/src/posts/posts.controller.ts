import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreatePostDto, UpdatePostDto, ReactToPostDto, FeedQueryDto } from './dto/posts.dto';
import { ReactionType } from '@prisma/client';

@ApiTags('Posts')
@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('bookmarks')
  @ApiOperation({ summary: 'Get bookmarked posts' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getBookmarks(@CurrentUser('id') userId: string, @Query() query: FeedQueryDto) {
    return this.postsService.getBookmarkedPosts(userId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create post' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreatePostDto) {
    return this.postsService.create(userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  async getById(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.postsService.getById(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit post (30-min window)' })
  async update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete post' })
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.postsService.delete(userId, id);
  }

  @Post(':id/pin')
  @ApiOperation({ summary: 'Pin/unpin post' })
  async pin(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.postsService.pin(userId, id);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive/unarchive post' })
  async archive(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.postsService.archive(userId, id);
  }

  @Get('feed/foryou')
  @ApiOperation({ summary: 'For You feed' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async forYouFeed(@CurrentUser('id') userId: string, @Query() query: FeedQueryDto) {
    return this.postsService.getForYouFeed(userId, query);
  }

  @Get('feed/latest')
  @ApiOperation({ summary: 'Latest following feed' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async latestFeed(@CurrentUser('id') userId: string, @Query() query: FeedQueryDto) {
    return this.postsService.getLatestFeed(userId, query);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get posts by user' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getUserPosts(@Param('userId') targetUserId: string, @CurrentUser('id') userId: string, @Query() query: FeedQueryDto) {
    return this.postsService.getUserPosts(targetUserId, userId, query);
  }

  @Get('feed/local')
  @ApiOperation({ summary: 'Local district feed' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async localFeed(@CurrentUser('id') userId: string, @Query() query: FeedQueryDto) {
    return this.postsService.getLocalFeed(userId, query);
  }

  @Post(':id/react')
  @ApiOperation({ summary: 'React to post' })
  async react(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: ReactToPostDto) {
    return this.postsService.react(userId, id, dto);
  }

  @Delete(':id/react/:type')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove reaction' })
  async removeReaction(@CurrentUser('id') userId: string, @Param('id') id: string, @Param('type') type: ReactionType) {
    return this.postsService.removeReaction(userId, id, type);
  }

  @Post(':id/bookmark')
  @ApiOperation({ summary: 'Bookmark post' })
  async bookmark(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.postsService.bookmark(userId, id);
  }

  @Delete(':id/bookmark')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove bookmark' })
  async removeBookmark(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.postsService.removeBookmark(userId, id);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Track share' })
  async share(@Param('id') id: string) {
    return this.postsService.trackShare(id);
  }

  @Post(':id/repost')
  @ApiOperation({ summary: 'Repost a post' })
  async repost(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() body: { content?: string }) {
    return this.postsService.repost(userId, id, body.content);
  }

  @Patch(':id/hide')
  @ApiOperation({ summary: 'Hide from timeline' })
  async hide(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.postsService.hide(userId, id);
  }

  @Post(':id/rumor')
  @ApiOperation({ summary: 'Flag as rumor' })
  async flagRumor(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.postsService.flagRumor(userId, id);
  }

  @Post(':id/fact-check')
  @ApiOperation({ summary: 'Admin fact check post' })
  async factCheck(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() body: { status: 'VERIFIED' | 'FALSE_INFORMATION' }) {
    return this.postsService.factCheck(userId, id, body.status);
  }
}
