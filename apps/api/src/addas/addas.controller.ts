import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddasService } from './addas.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Addas')
@Controller('addas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddasController {
  constructor(private readonly addasService: AddasService) {}

  @Post('rooms')
  @ApiOperation({ summary: 'Create adda room' })
  async createRoom(
    @CurrentUser('id') userId: string,
    @Body() body: { topic: string; districtId: number; districtName: string },
  ): Promise<any> {
    return this.addasService.createRoom(userId, body.topic, body.districtId, body.districtName);
  }

  @Get('rooms')
  @ApiOperation({ summary: 'List active adda rooms' })
  async getRooms(@Query('districtId') districtId?: string): Promise<any> {
    return this.addasService.getRooms(districtId ? Number(districtId) : undefined);
  }

  @Get('rooms/:id')
  @ApiOperation({ summary: 'Get room details' })
  async getRoom(@Param('id') id: string): Promise<any> {
    return this.addasService.getRoom(id);
  }

  @Post('rooms/:id/bump')
  @ApiOperation({ summary: 'Bump room activity' })
  async bump(@Param('id') id: string) {
    return this.addasService.bumpActivity(id);
  }

  @Post('rooms/:id/react')
  @ApiOperation({ summary: 'Add reaction to room' })
  async react(@Param('id') id: string, @Body() body: { reaction: string }) {
    return this.addasService.addReaction(id, body.reaction);
  }

  @Post('rooms/:id/join')
  @ApiOperation({ summary: 'Join room' })
  async join(@Param('id') id: string) {
    return this.addasService.joinRoom(id);
  }

  @Post('rooms/:id/leave')
  @ApiOperation({ summary: 'Leave room' })
  async leave(@Param('id') id: string) {
    return this.addasService.leaveRoom(id);
  }
}
