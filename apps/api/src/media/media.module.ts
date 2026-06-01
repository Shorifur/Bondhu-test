import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { R2Service } from './r2.service';
import { PrismaService } from '../common/services/prisma.service';

@Module({
  controllers: [MediaController],
  providers: [R2Service, PrismaService],
  exports: [R2Service],
})
export class MediaModule {}
