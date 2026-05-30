import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateCommentDto } from './dto/comments.dto';

@ApiTags('Comments')
@Controller('comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create comment' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(userId, dto);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get post comments' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getByPost(@Param('postId') postId: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.commentsService.getByPost(postId, Number(page) || 1, Number(limit) || 20);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Get comment replies' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getReplies(@Param('id') id: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.commentsService.getReplies(id, Number(page) || 1, Number(limit) || 20);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete comment' })
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.commentsService.delete(userId, id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like comment' })
  async like(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.commentsService.like(userId, id);
  }

  @Delete(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unlike comment' })
  async unlike(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.commentsService.unlike(userId, id);
  }
}
