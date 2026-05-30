import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoriesService } from './stories.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateStoryDto } from './dto/stories.dto';

@ApiTags('Stories')
@Controller('stories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create story' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateStoryDto) {
    return this.storiesService.create(userId, dto);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Get stories feed' })
  async getFeed(@CurrentUser('id') userId: string) {
    return this.storiesService.getFeed(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get story detail' })
  async getById(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.storiesService.getById(id, userId);
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'View story' })
  async viewStory(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.storiesService.viewStory(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete/archive story' })
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.storiesService.delete(userId, id);
  }
}
