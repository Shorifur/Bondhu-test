import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WsGateway } from './ws.gateway';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [JwtModule.register({}), MessagesModule],
  providers: [WsGateway],
  exports: [WsGateway],
})
export class WsModule {}
