import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';

import { PrismaModule } from './common/modules/prisma.module';
import { RedisModule } from './common/modules/redis.module';
import { LoggerModule } from './common/modules/logger.module';
import { EventEmitterModule } from './common/modules/event-emitter.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { StoriesModule } from './stories/stories.module';
import { MessagesModule } from './messages/messages.module';
import { CommunitiesModule } from './communities/communities.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { PaymentsModule } from './payments/payments.module';
import { SearchModule } from './search/search.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MediaModule } from './media/media.module';
import { ModerationModule } from './moderation/moderation.module';
import { SettingsModule } from './settings/settings.module';
import { BazaarModule } from './bazaar/bazaar.module';
import { JobsModule } from './jobs/jobs.module';
import { ShopsModule } from './shops/shops.module';
import { AddasModule } from './addas/addas.module';

import { ThrottlerBehindProxyGuard } from './common/guards/throttler-behind-proxy.guard';
import { WsModule } from './ws/ws.module';
import { HealthController, RootController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig],
      envFilePath: ['.env', '../../.env'],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 30,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 3600000,
        limit: 1000,
      },
    ]),
    EventEmitterModule,
    PrismaModule,
    RedisModule,
    LoggerModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    StoriesModule,
    MessagesModule,
    CommunitiesModule,
    MarketplaceModule,
    PaymentsModule,
    SearchModule,
    NotificationsModule,
    MediaModule,
    ModerationModule,
    SettingsModule,
    BazaarModule,
    JobsModule,
    ShopsModule,
    AddasModule,
    WsModule,
  ],
  controllers: [HealthController, RootController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
