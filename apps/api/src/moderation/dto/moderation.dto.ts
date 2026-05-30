import { IsString, IsOptional, Length, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportType, ReportCode } from '@prisma/client';

export class CreateReportDto {
  @ApiProperty({ enum: ReportType })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ enum: ReportCode })
  @IsEnum(ReportCode)
  code: ReportCode;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  postId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  commentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  reportedUserId?: string;
}

export class ResolveReportDto {
  @ApiProperty()
  @IsString()
  @Length(1, 1000)
  resolutionNote: string;
}
