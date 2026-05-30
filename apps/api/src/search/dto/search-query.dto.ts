import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SearchType {
  USERS = 'users',
  POSTS = 'posts',
  HASHTAGS = 'hashtags',
  COMMUNITIES = 'communities',
  ALL = 'all',
}

export class SearchQueryDto {
  @ApiProperty({ example: 'cricket' })
  @IsString()
  @IsNotEmpty()
  q: string;

  @ApiPropertyOptional({ enum: SearchType, default: SearchType.ALL })
  @IsEnum(SearchType)
  @IsOptional()
  type?: SearchType;

  @ApiPropertyOptional({ default: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}
