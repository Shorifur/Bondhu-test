import { IsString, IsNotEmpty, Length, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommunityCategory, VisibilityScope, JoinType } from '@prisma/client';

export class CreateCommunityDto {
  @ApiProperty({ example: 'Dhaka Freelancers' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiPropertyOptional({ example: 'A community for freelancers in Dhaka' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: CommunityCategory })
  @IsEnum(CommunityCategory)
  category: CommunityCategory;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  districtId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  subDistrictId?: number;

  @ApiPropertyOptional({ enum: VisibilityScope, default: VisibilityScope.PUBLIC })
  @IsEnum(VisibilityScope)
  @IsOptional()
  visibility?: VisibilityScope;

  @ApiPropertyOptional({ enum: JoinType, default: JoinType.OPEN })
  @IsEnum(JoinType)
  @IsOptional()
  joinType?: JoinType;

  @ApiPropertyOptional({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  geoRadiusKm?: number;
}
