import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsBoolean, IsEmail, MinLength, MaxLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '+8801712345678' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+8801[3-9]\d{8}$/, {
    message: 'Invalid Bangladeshi phone number format',
  })
  phoneNumber: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+8801712345678' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  otp: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Test@1234' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ example: 'Rafiq Ahmed' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  legalName: string;

  @ApiProperty({ example: 'rafiq_ahmed' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]{3,30}$/, {
    message: 'Handle must be 3-30 alphanumeric characters or underscores',
  })
  handle: string;

  @ApiProperty({ example: 'male', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  districtId?: number;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Test@1234' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class GuestLoginDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fcmToken?: string;
}

export class CreateProfileDto {
  @ApiProperty({ example: 'Rafiq Ahmed' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  legalName: string;

  @ApiProperty({ example: 'rafiq_ahmed' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]{3,30}$/, {
    message: 'Handle must be 3-30 alphanumeric characters or underscores',
  })
  handle: string;

  @ApiProperty({ example: 1 })
  districtId: number;

  @ApiProperty({ example: 1 })
  subDistrictId: number;
}
