import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto, UpdateSettingsDto, UpdatePreferencesDto, BlockedWordDto, BlockedHashtagDto, CreateVerificationDto, SearchUsersDto } from './dto/users.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@CurrentUser('id') userId: string) {
    return this.usersService.getMe(userId);
  }

  @Get(':handle')
  @ApiOperation({ summary: 'Get public profile by handle' })
  async getByHandle(@Param('handle') handle: string, @CurrentUser('id') userId: string) {
    return this.usersService.getByHandle(handle, userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update profile' })
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Post(':id/follow')
  @ApiOperation({ summary: 'Follow user' })
  async follow(@CurrentUser('id') userId: string, @Param('id') targetId: string) {
    return this.usersService.followUser(userId, targetId);
  }

  @Post(':id/unfollow')
  @ApiOperation({ summary: 'Unfollow user' })
  async unfollow(@CurrentUser('id') userId: string, @Param('id') targetId: string) {
    return this.usersService.unfollowUser(userId, targetId);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'List followers' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getFollowers(@Param('id') userId: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.usersService.getFollowers(userId, Number(page) || 1, Number(limit) || 20);
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'List following' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getFollowing(@Param('id') userId: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.usersService.getFollowing(userId, Number(page) || 1, Number(limit) || 20);
  }

  @Post(':id/mute')
  @ApiOperation({ summary: 'Mute user' })
  async mute(@CurrentUser('id') userId: string, @Param('id') targetId: string) {
    return this.usersService.muteUser(userId, targetId);
  }

  @Post(':id/block')
  @ApiOperation({ summary: 'Block user' })
  async block(@CurrentUser('id') userId: string, @Param('id') targetId: string) {
    return this.usersService.blockUser(userId, targetId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users' })
  async search(@Query() dto: SearchUsersDto) {
    return this.usersService.searchUsers(dto);
  }

  @Post('me/verification')
  @ApiOperation({ summary: 'Submit verification request' })
  async createVerification(@CurrentUser('id') userId: string, @Body() dto: CreateVerificationDto) {
    return this.usersService.createVerification(userId, dto);
  }

  @Get('me/settings')
  @ApiOperation({ summary: 'Get settings' })
  async getSettings(@CurrentUser('id') userId: string) {
    return this.usersService.getSettings(userId);
  }

  @Patch('me/settings')
  @ApiOperation({ summary: 'Update settings' })
  async updateSettings(@CurrentUser('id') userId: string, @Body() dto: UpdateSettingsDto) {
    return this.usersService.updateSettings(userId, dto);
  }

  @Get('me/preferences')
  @ApiOperation({ summary: 'Get preferences' })
  async getPreferences(@CurrentUser('id') userId: string) {
    return this.usersService.getPreferences(userId);
  }

  @Patch('me/preferences')
  @ApiOperation({ summary: 'Update preferences' })
  async updatePreferences(@CurrentUser('id') userId: string, @Body() dto: UpdatePreferencesDto) {
    return this.usersService.updatePreferences(userId, dto);
  }

  @Post('me/blocked-words')
  @ApiOperation({ summary: 'Add blocked word' })
  async addBlockedWord(@CurrentUser('id') userId: string, @Body() dto: BlockedWordDto) {
    return this.usersService.addBlockedWord(userId, dto.word);
  }

  @Delete('me/blocked-words/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove blocked word' })
  async removeBlockedWord(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.usersService.removeBlockedWord(userId, id);
  }

  @Post('me/blocked-hashtags')
  @ApiOperation({ summary: 'Add blocked hashtag' })
  async addBlockedHashtag(@CurrentUser('id') userId: string, @Body() dto: BlockedHashtagDto) {
    return this.usersService.addBlockedHashtag(userId, dto.hashtag);
  }

  @Delete('me/blocked-hashtags/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove blocked hashtag' })
  async removeBlockedHashtag(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.usersService.removeBlockedHashtag(userId, id);
  }

  // Trusted Contacts
  @Get('me/trusted-contacts')
  @ApiOperation({ summary: 'Get trusted contacts' })
  async getTrustedContacts(@CurrentUser('id') userId: string) {
    return this.usersService.getTrustedContacts(userId);
  }

  @Post('me/trusted-contacts')
  @ApiOperation({ summary: 'Add trusted contact' })
  async addTrustedContact(@CurrentUser('id') userId: string, @Body() dto: { contactName: string; contactPhone: string; relationship?: string }) {
    return this.usersService.addTrustedContact(userId, dto);
  }

  @Delete('me/trusted-contacts/:id')
  @ApiOperation({ summary: 'Remove trusted contact' })
  async removeTrustedContact(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.usersService.removeTrustedContact(userId, id);
  }

  // SOS
  @Post('me/sos')
  @ApiOperation({ summary: 'Trigger SOS alert' })
  async createSOS(@CurrentUser('id') userId: string, @Body() dto: { latitude?: number; longitude?: number; locationName?: string }) {
    return this.usersService.createSOS(userId, dto);
  }

  @Get('me/sos')
  @ApiOperation({ summary: 'Get SOS history' })
  async getSOSHistory(@CurrentUser('id') userId: string) {
    return this.usersService.getSOSHistory(userId);
  }

  // Points
  @Get('me/points')
  @ApiOperation({ summary: 'Get Bondhu points' })
  async getPoints(@CurrentUser('id') userId: string) {
    return this.usersService.getPoints(userId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get points leaderboard' })
  async getLeaderboard(@Query('districtId') districtId?: string) {
    return this.usersService.getLeaderboard(districtId ? Number(districtId) : undefined);
  }
}
