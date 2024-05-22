import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { X_REQUEST_ID } from '@src/constants/rest.constant';
import {
  BizException,
  ErrorCode,
  ErrorMessages,
} from '@src/shared/errors/error-code.enum';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const requestId = request.headers[X_REQUEST_ID] as string;
    const timestamp = new Date().toISOString();
    const path = request.routeOptions.url ?? '';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorDetails = {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: ErrorMessages[ErrorCode.INTERNAL_SERVER_ERROR],
    };

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorDetails = this.buildErrorResponse(exception);
    } else if (exception instanceof BizException) {
      statusCode = HttpStatus.BAD_REQUEST;
      errorDetails = {
        code: exception.code,
        message: exception.message,
      };
    } else if (typeof exception === 'object' && exception !== null) {
      const message = (exception as any).message
        ? (exception as any).message
        : 'Unknown error';

      errorDetails = {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: message,
      };
    }

    const responsePayload: ApiResponse = {
      code: statusCode,
      message: errorDetails.message,
      timestamp,
      requestId,
      path,
      error: errorDetails,
    };

    response.status(statusCode).send(responsePayload);
  }

  private buildErrorResponse(exception: HttpException): {
    code: number;
    message: string;
  } {
    const responsePayload = exception.getResponse();
    return {
      code:
        typeof responsePayload === 'object' && 'statusCode' in responsePayload
          ? (responsePayload as any).statusCode
          : exception.getStatus(),
      message:
        typeof responsePayload === 'object' && 'message' in responsePayload
          ? (responsePayload as any).message
          : (responsePayload as any).toString(),
    };
  }
}
