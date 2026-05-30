import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME || 'Bondhu',
  url: process.env.APP_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:3001',
  port: parseInt(process.env.PORT ?? '', 10) || 3001,

  // Security
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  otpSecret: process.env.OTP_SECRET,
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS ?? '', 10) || 12,
  cookieSecret: process.env.COOKIE_SECRET || 'bondhu-cookie-secret',

  // External Services
  smsProviderUrl: process.env.SMS_PROVIDER_URL,
  smsApiKey: process.env.SMS_API_KEY,
  smsSenderId: process.env.SMS_SENDER_ID || 'BONDHU',

  // MFS Providers
  bKash: {
    baseUrl: process.env.BKASH_BASE_URL,
    appKey: process.env.BKASH_APP_KEY,
    appSecret: process.env.BKASH_APP_SECRET,
    username: process.env.BKASH_USERNAME,
    password: process.env.BKASH_PASSWORD,
  },
  nagad: {
    baseUrl: process.env.NAGAD_BASE_URL,
    merchantId: process.env.NAGAD_MERCHANT_ID,
    merchantPrivateKey: process.env.NAGAD_MERCHANT_PRIVATE_KEY,
  },

  // Feature Flags
  features: {
    enableStories: process.env.ENABLE_STORIES !== 'false',
    enableReels: process.env.ENABLE_REELS !== 'false',
    enableLive: process.env.ENABLE_LIVE !== 'false',
    enableMarketplace: process.env.ENABLE_MARKETPLACE !== 'false',
    enableFundraiser: process.env.ENABLE_FUNDRAISER !== 'false',
  },

  // WebSocket
  ws: {
    heartbeatInterval: parseInt(process.env.WS_HEARTBEAT_INTERVAL ?? '', 10) || 30000,
    maxConnectionsPerUser: parseInt(process.env.WS_MAX_CONNECTIONS_PER_USER ?? '', 10) || 5,
  },

  // Monitoring
  sentryDsn: process.env.SENTRY_DSN,
  datadogApiKey: process.env.DATADOG_API_KEY,
}));
