import { Global, Module } from '@nestjs/common';
import { EventEmitter } from 'events';

export const EVENT_EMITTER = Symbol('EVENT_EMITTER');

@Global()
@Module({
  providers: [
    {
      provide: EVENT_EMITTER,
      useValue: new EventEmitter(),
    },
  ],
  exports: [EVENT_EMITTER],
})
export class EventEmitterModule {}
