import { IsOptional, IsString, IsInt, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BrowseItemsDto {
  @ApiPropertyOptional({ example: 'electronics' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @Transform(({ value }: { value: any }) => Number(value))
  @IsOptional()
  districtId?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsNumber()
  @Min(0)
  @Transform(({ value }: { value: any }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsNumber()
  @Min(0)
  @Transform(({ value }: { value: any }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @Transform(({ value }: { value: any }) => value === 'true' || value === true)
  @IsOptional()
  isVerifiedSeller?: boolean;

  @ApiPropertyOptional({ example: 'eyJjcmVhdGVkQXQiOiIyMDI0LTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpZCI6InV1aWQifQ==' })
  @IsString()
  @IsOptional()
  cursor?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }: { value: any }) => (value !== undefined ? Number(value) : 20))
  @IsOptional()
  limit?: number;
}
