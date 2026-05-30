import { IsString, IsNotEmpty, IsNumber, Min, IsEnum, IsOptional, Length, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MfsProvider } from '@prisma/client';

export class SendPaymentDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ enum: MfsProvider })
  @IsEnum(MfsProvider)
  provider: MfsProvider;

  @ApiPropertyOptional({ example: 'Lunch split' })
  @IsString()
  @IsOptional()
  @Length(0, 255)
  description?: string;
}
