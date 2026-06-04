import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './common/services/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    // Verify database connection
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'bondhu-api',
      uptime: process.uptime(),
    };
  }
}

@Controller('')
export class RootController {
  @Get()
  root() {
    return { status: 'ok', message: 'Bondhu API is running' };
  }
}
