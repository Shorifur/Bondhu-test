import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import type { ApiResponse } from '@bondhu/shared-types';
import { LoggerService } from '../services/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as { message?: string | string[] }).message || exception.message
        : 'Internal server error';

    const errorResponse: ApiResponse = {
      success: false,
      error: {
        code: `HTTP_${status}`,
        message: Array.isArray(message) ? message[0] : message,
        ...(process.env.NODE_ENV === 'development' && exception instanceof Error
          ? { stack: exception.stack }
          : {}),
      },
    };

    this.logger.error(
      `${request.method} ${request.url} ${status} — ${message}`,
      exception instanceof Error ? exception.stack : undefined,
      'HttpExceptionFilter',
    );

    response.status(status).json(errorResponse);
  }
}
