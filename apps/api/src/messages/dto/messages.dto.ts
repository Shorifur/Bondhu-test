import { IsString, IsOptional, Length, IsUUID, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType } from '@prisma/client';

export class CreateConversationDto {
  @ApiProperty()
  @IsUUID()
  participantId: string;
}

export class SendMessageDto {
  @ApiProperty()
  @IsUUID()
  conversationId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 5000)
  content?: string;

  @ApiPropertyOptional({ enum: MessageType, default: MessageType.TEXT })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  replyToId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  voiceDuration?: number;
}

export class ForwardMessageDto {
  @ApiProperty()
  @IsUUID()
  targetConversationId: string;
}
