import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type {
  ApiErrorCode,
  ApiErrorResponse,
} from '../interfaces/api-response.interface';

type ErrorResponsePayload = {
  code?: string;
  message?: string | string[];
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);
  private readonly badRequestStatus = 400;
  private readonly unauthorizedStatus = 401;
  private readonly forbiddenStatus = 403;
  private readonly notFoundStatus = 404;
  private readonly conflictStatus = 409;
  private readonly internalServerErrorStatus = 500;

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request & { user?: { id?: string } }>();
    const errorResponse = this.buildErrorResponse(exception);
    const logContext = JSON.stringify({
      method: request.method,
      path: request.url,
      statusCode: errorResponse.statusCode,
      userId: request.user?.id ?? null,
    });

    if (errorResponse.statusCode >= this.internalServerErrorStatus) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error(
        `${errorResponse.body.error.code}: ${errorResponse.body.error.message} ${logContext}`,
        stack,
      );
    } else {
      this.logger.warn(
        `${errorResponse.body.error.code}: ${errorResponse.body.error.message} ${logContext}`,
      );
    }

    response.status(errorResponse.statusCode).json(errorResponse.body);
  }

  private buildErrorResponse(exception: unknown): {
    statusCode: number;
    body: ApiErrorResponse;
  } {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const response = exception.getResponse() as string | ErrorResponsePayload;
      const details = this.extractDetails(response, statusCode);
      const code = this.extractCode(response, statusCode);
      const message = this.extractMessage(response, statusCode);

      return {
        statusCode,
        body: {
          success: false,
          error: {
            code,
            message,
            ...(details.length > 0 ? { details } : {}),
          },
        },
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error',
        },
      },
    };
  }

  private extractCode(
    response: string | ErrorResponsePayload,
    statusCode: number,
  ): ApiErrorCode {
    if (
      typeof response !== 'string' &&
      typeof response.code === 'string' &&
      response.code.length > 0
    ) {
      return response.code as ApiErrorCode;
    }

    if (
      statusCode === this.badRequestStatus &&
      typeof response !== 'string' &&
      Array.isArray(response.message)
    ) {
      return 'VALIDATION_ERROR';
    }

    switch (statusCode) {
      case this.badRequestStatus:
        return 'VALIDATION_ERROR';
      case this.unauthorizedStatus:
        return 'UNAUTHORIZED';
      case this.forbiddenStatus:
        return 'FORBIDDEN';
      case this.notFoundStatus:
        return 'NOT_FOUND';
      case this.conflictStatus:
        return 'CONFLICT';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }

  private extractMessage(
    response: string | ErrorResponsePayload,
    statusCode: number,
  ): string {
    if (typeof response === 'string') {
      return response;
    }

    if (
      statusCode === this.badRequestStatus &&
      Array.isArray(response.message)
    ) {
      return 'Invalid input';
    }

    if (typeof response.message === 'string' && response.message.length > 0) {
      return response.message;
    }

    return statusCode >= this.internalServerErrorStatus
      ? 'Internal server error'
      : 'Request failed';
  }

  private extractDetails(
    response: string | ErrorResponsePayload,
    statusCode: number,
  ): string[] {
    if (
      statusCode === this.badRequestStatus &&
      typeof response !== 'string' &&
      Array.isArray(response.message)
    ) {
      return response.message.filter(
        (detail): detail is string => typeof detail === 'string',
      );
    }

    return [];
  }
}
