import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationMethod } from '@prisma/client';

export class VerifyPaymentDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  paymentId: string;

  @ApiProperty({ enum: VerificationMethod })
  @IsEnum(VerificationMethod)
  @IsNotEmpty()
  verifiedVia: VerificationMethod;
}
