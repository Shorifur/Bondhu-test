import { IsString, IsNotEmpty, Length, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommunityRuleDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  orderIndex: number;

  @ApiProperty({ example: 'Be respectful' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  title: string;

  @ApiPropertyOptional({ example: 'Treat all members with respect and kindness.' })
  @IsString()
  @IsOptional()
  description?: string;
}
