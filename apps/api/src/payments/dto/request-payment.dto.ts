import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, Length, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RequestPaymentDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  requesteeId: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({ example: 'Please send the rent' })
  @IsString()
  @IsOptional()
  @Length(0, 255)
  description?: string;
}
