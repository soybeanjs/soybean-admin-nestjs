import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  RESPONSE_SUCCESS_CODE,
  RESPONSE_SUCCESS_MSG,
  X_REQUEST_ID,
} from '@src/constants/rest.constant';
import { BYPASS_TRANSFORM_KEY } from '@src/infra/decorators/bypass-transform.decorator';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const bypassTransform = this.reflector.get<boolean>(
      BYPASS_TRANSFORM_KEY,
      context.getHandler(),
    );

    if (bypassTransform) return next.handle();

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    context.switchToHttp().getResponse<FastifyReply>();
    const requestId = Array.isArray(request.headers[X_REQUEST_ID])
      ? request.headers[X_REQUEST_ID][0]
      : request.headers[X_REQUEST_ID] || '';
    const path = request.url;

    return next.handle().pipe(
      timeout(3000),
      map((data) => ({
        code: RESPONSE_SUCCESS_CODE,
        message: RESPONSE_SUCCESS_MSG,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        path: path,
        data: data ?? null,
      })),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException('Request timed out');
        }
        throw err;
      }),
    );
  }
}
