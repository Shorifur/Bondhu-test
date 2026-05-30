import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SuggestionsDto {
  @ApiProperty({ example: 'raf' })
  @IsString()
  @IsNotEmpty()
  q: string;

  @ApiPropertyOptional({ default: 10 })
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number;
}
