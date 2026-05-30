import { IsString, IsOptional, Length, Matches, IsNumber, IsBoolean, IsArray, IsEnum, IsUUID, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VisibilityScope, AppLanguage, AppTheme, FontScale, MessagePermission, AlertRate, VerificationRequestType } from '@prisma/client';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Rafiq Ahmed' })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 150)
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pronouns?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  districtId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  subDistrictId?: number;

  @ApiPropertyOptional({ enum: VisibilityScope })
  @IsOptional()
  @IsEnum(VisibilityScope)
  visibility?: VisibilityScope;

  @ApiPropertyOptional({ enum: AppLanguage })
  @IsOptional()
  @IsEnum(AppLanguage)
  language?: AppLanguage;

  @ApiPropertyOptional({ enum: AppTheme })
  @IsOptional()
  @IsEnum(AppTheme)
  theme?: AppTheme;

  @ApiPropertyOptional({ enum: FontScale })
  @IsOptional()
  @IsEnum(FontScale)
  fontScale?: FontScale;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  highContrast?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  reducedMotion?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoImageAlt?: boolean;
}

export class FollowActionDto {
  @ApiProperty()
  @IsUUID()
  targetUserId: string;
}

export class UpdateSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  @ApiPropertyOptional({ enum: AlertRate })
  @IsOptional()
  @IsEnum(AlertRate)
  likeAlertRate?: AlertRate;

  @ApiPropertyOptional({ enum: AlertRate })
  @IsOptional()
  @IsEnum(AlertRate)
  commentAlertRate?: AlertRate;

  @ApiPropertyOptional({ enum: AlertRate })
  @IsOptional()
  @IsEnum(AlertRate)
  followAlertRate?: AlertRate;

  @ApiPropertyOptional({ enum: AlertRate })
  @IsOptional()
  @IsEnum(AlertRate)
  messageAlertRate?: AlertRate;

  @ApiPropertyOptional({ enum: AlertRate })
  @IsOptional()
  @IsEnum(AlertRate)
  mentionAlertRate?: AlertRate;

  @ApiPropertyOptional({ enum: MessagePermission })
  @IsOptional()
  @IsEnum(MessagePermission)
  allowMessaging?: MessagePermission;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showActivityStatus?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showReadReceipts?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allowContactSync?: boolean;
}

export class UpdatePreferencesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topicCategories?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  closeFriends?: string[];
}

export class BlockedWordDto {
  @ApiProperty()
  @IsString()
  @Length(1, 100)
  word: string;
}

export class BlockedHashtagDto {
  @ApiProperty()
  @IsString()
  @Length(1, 100)
  hashtag: string;
}

export class CreateVerificationDto {
  @ApiProperty({ enum: VerificationRequestType })
  @IsEnum(VerificationRequestType)
  type: VerificationRequestType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentFrontUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentBackUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  faceMatchUrl?: string;
}

export class SearchUsersDto {
  @ApiProperty()
  @IsString()
  @Length(1, 100)
  q: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
