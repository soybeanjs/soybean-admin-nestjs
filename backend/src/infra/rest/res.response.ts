import { ApiProperty } from '@nestjs/swagger';

import {
  RESPONSE_SUCCESS_CODE,
  RESPONSE_SUCCESS_MSG,
} from '@src/constants/rest.constant';

export class Response<T> {
  @ApiProperty({ type: 'object', description: 'data' })
  data?: T;

  @ApiProperty({
    type: 'number',
    default: RESPONSE_SUCCESS_CODE,
    description: 'code',
  })
  code: number;

  @ApiProperty({
    type: 'string',
    default: RESPONSE_SUCCESS_MSG,
    description: 'message',
  })
  message: string;

  private constructor(
    code: number,
    data: any,
    message: string = RESPONSE_SUCCESS_MSG,
  ) {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static success<T>(
    data: T,
    message: string = RESPONSE_SUCCESS_MSG,
  ): Response<T> {
    return new Response(RESPONSE_SUCCESS_CODE, data, message);
  }

  static error<T = null>(code: number, message: string): Response<T> {
    return new Response(code, null, message);
  }

  static custom<T>(code: number, data: T, message: string): Response<T> {
    return new Response(code, data, message);
  }
}
