import { IsString, IsOptional, Length, IsEnum, IsNumber, IsUUID, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VisibilityScope, CommunityCategory, JoinType, CommunityRole } from '@prisma/client';

export class CreateCommunityDto {
  @ApiProperty()
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: CommunityCategory })
  @IsEnum(CommunityCategory)
  category: CommunityCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  districtId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  subDistrictId?: number;

  @ApiPropertyOptional({ enum: VisibilityScope, default: VisibilityScope.PUBLIC })
  @IsOptional()
  @IsEnum(VisibilityScope)
  visibility?: VisibilityScope;

  @ApiPropertyOptional({ enum: JoinType, default: JoinType.OPEN })
  @IsOptional()
  @IsEnum(JoinType)
  joinType?: JoinType;
}

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: CommunityRole })
  @IsEnum(CommunityRole)
  role: CommunityRole;
}

export class CreateRuleDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateCommunityPostDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 2800)
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  mediaAssetIds?: string[];
}
