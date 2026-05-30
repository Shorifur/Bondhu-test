import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_DATABASE_URL,
  pool: {
    min: parseInt(process.env.DB_POOL_MIN ?? '', 10) || 10,
    max: parseInt(process.env.DB_POOL_MAX ?? '', 10) || 50,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE ?? '', 10) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE ?? '', 10) || 10000,
  },
}));
