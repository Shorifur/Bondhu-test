import { IsString, IsNotEmpty, Length, IsOptional, IsEnum, IsInt, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemCondition, VisibilityScope } from '@prisma/client';

export class CreateItemDto {
  @ApiProperty({ example: 'iPhone 14 Pro' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  title: string;

  @ApiProperty({ example: 'Brand new sealed box iPhone 14 Pro 256GB' })
  @IsString()
  @IsNotEmpty()
  @Length(10, 5000)
  description: string;

  @ApiProperty({ example: 125000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ enum: ItemCondition })
  @IsEnum(ItemCondition)
  condition: ItemCondition;

  @ApiProperty({ example: 'electronics' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  districtId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  subDistrictId?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  isNegotiable?: boolean;

  @ApiPropertyOptional({ enum: VisibilityScope, default: VisibilityScope.PUBLIC })
  @IsEnum(VisibilityScope)
  @IsOptional()
  visibility?: VisibilityScope;
}
