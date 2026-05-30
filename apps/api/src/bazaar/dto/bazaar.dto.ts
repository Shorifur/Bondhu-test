import { IsString, IsNumber, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { PriceItemType } from '@prisma/client';

export class CreatePriceReportDto {
  @IsEnum(PriceItemType)
  itemType: PriceItemType;

  @IsString()
  itemName: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  unit: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsInt()
  districtId: number;
}
