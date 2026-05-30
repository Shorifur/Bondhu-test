import { IsString, IsOptional, IsEnum, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StoryType, StickerType } from '@prisma/client';

export class CreateStoryDto {
  @ApiPropertyOptional({ enum: StoryType, default: StoryType.STANDARD })
  @IsOptional()
  @IsEnum(StoryType)
  type?: StoryType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  locationName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  mediaAssetIds?: string[];
}

export class CreateStickerDto {
  @ApiProperty({ enum: StickerType })
  @IsEnum(StickerType)
  type: StickerType;

  @ApiProperty()
  positionX: number;

  @ApiProperty()
  positionY: number;

  @ApiPropertyOptional()
  @IsOptional()
  payload?: Record<string, unknown>;
}
