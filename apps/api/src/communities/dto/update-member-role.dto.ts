import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommunityRole } from '@prisma/client';

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: CommunityRole })
  @IsEnum(CommunityRole)
  @IsNotEmpty()
  role: CommunityRole;
}
