import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiResponseDoc<T extends new (...args: any[]) => any>({
  type,
  isArray = false,
  isPaged = false,
  status = HttpStatus.OK,
}: {
  type: T;
  isArray?: boolean;
  isPaged?: boolean;
  status?: HttpStatus;
}) {
  const baseSchema = isArray
    ? {
        type: 'array',
        items: { $ref: getSchemaPath(type) },
      }
    : {
        $ref: getSchemaPath(type),
      };

  const pagedSchema = isPaged
    ? {
        type: 'object',
        properties: {
          results: baseSchema,
          pagination: {
            type: 'object',
            properties: {
              totalRecords: { type: 'integer' },
              totalPages: { type: 'integer' },
              currentPage: { type: 'integer' },
              pageSize: { type: 'integer' },
            },
          },
        },
      }
    : baseSchema;

  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: status,
      schema: pagedSchema,
    }),
  );
}
