import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, json, errors, printf, colorize } = winston.format;

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const isDev = process.env.NODE_ENV !== 'production';
    const logFormat = isDev
      ? combine(
          colorize(),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          printf(({ level, message, timestamp: ts, context, ...meta }) => {
            const ctx = context ? ` [${context}]` : '';
            const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
            return `${ts} ${level}${ctx}: ${message}${metaStr}`;
          }),
        )
      : combine(timestamp(), json(), errors({ stack: true }));

    const transports: winston.transport[] = [
      new winston.transports.Console({
        level: isDev ? 'debug' : 'info',
      }),
    ];

    if (!isDev) {
      transports.push(
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'info',
        }),
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
          level: 'error',
        }),
      );
    }

    this.logger = winston.createLogger({
      level: isDev ? 'debug' : 'info',
      format: logFormat,
      defaultMeta: { service: 'bondhu-api' },
      transports,
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
