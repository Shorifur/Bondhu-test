import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateConversationDto, SendMessageDto, ForwardMessageDto } from './dto/messages.dto';

@ApiTags('Messages')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'List conversations' })
  async getConversations(@CurrentUser('id') userId: string) {
    return this.messagesService.getConversations(userId);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Start or get direct conversation' })
  async createConversation(@CurrentUser('id') userId: string, @Body() dto: CreateConversationDto) {
    return this.messagesService.createConversation(userId, dto);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation detail' })
  async getConversation(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.messagesService.getConversation(userId, id);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getMessages(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.getMessages(userId, id, Number(page) || 1, Number(limit) || 50);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send message' })
  async sendMessage(@CurrentUser('id') userId: string, @Body() dto: SendMessageDto) {
    return this.messagesService.sendMessage(userId, dto);
  }

  @Post('conversations/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark conversation as read' })
  async markRead(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.messagesService.markRead(userId, id);
  }

  @Post('messages/:id/forward')
  @ApiOperation({ summary: 'Forward message' })
  async forwardMessage(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: ForwardMessageDto,
  ) {
    return this.messagesService.forwardMessage(userId, id, dto);
  }

  @Delete('messages/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete message' })
  async deleteMessage(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.messagesService.deleteMessage(userId, id);
  }
}
