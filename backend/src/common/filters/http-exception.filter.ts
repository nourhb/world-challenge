import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : typeof exceptionResponse === 'object' &&
            exceptionResponse !== null &&
            'message' in exceptionResponse
          ? String(
              Array.isArray(
                (exceptionResponse as { message: string | string[] }).message,
              )
                ? (exceptionResponse as { message: string[] }).message[0]
                : (exceptionResponse as { message: string }).message,
            )
          : 'Internal server error';

    const details =
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse &&
      Array.isArray((exceptionResponse as { message: unknown }).message)
        ? (exceptionResponse as { message: unknown[] }).message
        : [];

    const code =
      status === HttpStatus.BAD_REQUEST
        ? 'VALIDATION_ERROR'
        : status === HttpStatus.UNAUTHORIZED
          ? 'UNAUTHORIZED'
          : status === HttpStatus.FORBIDDEN
            ? 'FORBIDDEN'
            : status === HttpStatus.CONFLICT
              ? 'CONFLICT'
              : status === HttpStatus.TOO_MANY_REQUESTS
                ? 'RATE_LIMITED'
                : status === HttpStatus.NOT_FOUND
                  ? 'NOT_FOUND'
                  : 'INTERNAL_ERROR';

    this.logger.error(
      JSON.stringify({
        requestId: request.headers['x-request-id'] ?? null,
        route: request.url,
        status,
        errorCode: code,
      }),
    );

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        details,
      },
    });
  }
}
