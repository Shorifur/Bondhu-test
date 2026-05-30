import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggerService } from './common/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: {
      origin: process.env.APP_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    },
  });

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", "*"],
        mediaSrc: ["'self'", "blob:", "*"],
        connectSrc: ["'self'", "ws:", "wss:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));
  app.use(compression());
  app.use(cookieParser(configService.get('COOKIE_SECRET') || 'bondhu-cookie-secret'));

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // Global pipes & interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger documentation (dev only)
  if (configService.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Bondhu API')
      .setDescription('Bondhu Social Platform REST API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('Auth', 'Authentication & Identity')
      .addTag('Users', 'User profiles & settings')
      .addTag('Posts', 'Posts, reactions, bookmarks')
      .addTag('Comments', 'Threaded comments')
      .addTag('Stories', 'Ephemeral stories')
      .addTag('Messages', 'Direct messaging & chat')
      .addTag('Communities', 'Groups & forums')
      .addTag('Marketplace', 'F-Commerce listings')
      .addTag('Payments', 'MFS & escrow')
      .addTag('Search', 'Discovery & trends')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get('PORT') || 3001;
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Bondhu API running on http://0.0.0.0:${port}`);
}

bootstrap();
