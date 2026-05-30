import { IsString, IsOptional, IsNumber, IsEnum, Length, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentType, MfsProvider, VerificationMethod } from '@prisma/client';

export class CreatePaymentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  receiverId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  fundraiserId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  escrowId?: string;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: MfsProvider })
  @IsEnum(MfsProvider)
  provider: MfsProvider;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;
}

export class VerifyPaymentDto {
  @ApiProperty({ enum: VerificationMethod })
  @IsEnum(VerificationMethod)
  method: VerificationMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;
}

export class CreateEscrowDto {
  @ApiProperty()
  @IsUUID()
  marketplaceItemId: string;

  @ApiProperty()
  @IsUUID()
  sellerId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}

export class ConfirmEscrowDto {
  @ApiProperty()
  @IsBoolean()
  confirm: boolean;
}
