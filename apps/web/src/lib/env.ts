export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001',
  MINIO_URL: process.env.NEXT_PUBLIC_MINIO_URL || 'http://localhost:9000',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://bondhu.app',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;
