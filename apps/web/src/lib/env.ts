export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || '/api',
  MINIO_URL: process.env.NEXT_PUBLIC_MINIO_URL || 'http://localhost:9000',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://bondhu.app',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;
