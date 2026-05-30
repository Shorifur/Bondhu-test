import { IsString, IsOptional, IsEnum, IsInt, IsNumber, Min, IsBoolean, IsDateString } from 'class-validator';
import { JobCategory } from '@prisma/client';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  districtId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsEnum(JobCategory)
  category: JobCategory;

  @IsOptional()
  @IsString()
  contactInfo?: string;

  @IsOptional()
  @IsDateString()
  applicationDeadline?: string;
}

export class JobFilterDto {
  @IsOptional()
  @IsInt()
  districtId?: number;

  @IsOptional()
  @IsEnum(JobCategory)
  category?: JobCategory;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
