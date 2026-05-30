import { IsString, IsOptional, Length, IsBoolean, IsArray, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VisibilityScope, ReactionType } from '@prisma/client';

export class CreatePostDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 2800)
  content?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  contentMarkdown?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  locationName?: string;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  mediaAssetIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtagNames?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  sharedPostId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  fundraiser?: {
    goal: number;
    endDate: string;
    beneficiary: string;
  };
}

export class UpdatePostDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 2800)
  content?: string;
}

export class ReactToPostDto {
  @ApiProperty({ enum: ReactionType })
  @IsEnum(ReactionType)
  type: ReactionType;
}

export class FeedQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
