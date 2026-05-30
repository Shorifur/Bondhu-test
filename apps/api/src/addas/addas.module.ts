import { Module } from '@nestjs/common';
import { AddasController } from './addas.controller';
import { AddasService } from './addas.service';

@Module({
  controllers: [AddasController],
  providers: [AddasService],
})
export class AddasModule {}
