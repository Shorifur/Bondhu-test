import { IsString, IsOptional, IsBoolean, IsArray, IsUUID, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommunityPostDto {
  @ApiProperty({ example: 'Hello everyone!' })
  @IsString()
  @Length(1, 5000)
  content: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  contentMarkdown?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  locationName?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hashtags?: string[];
}
