import { IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class JoinCommunityDto {
  @ApiPropertyOptional({ description: 'Answers to join questions keyed by question orderIndex' })
  @IsObject()
  @IsOptional()
  answers?: Record<string, string>;
}
