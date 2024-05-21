import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PageOperationLogsQueryDto } from '@src/api/log-audit/operation-log/dto/page-operation-log.query-dto';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { OperationLogProperties } from '@src/lib/bounded-contexts/log-audit/operation-log/domain/operation-log.read-model';
import { PageOperationLogsQuery } from '@src/lib/bounded-contexts/log-audit/operation-log/queries/page-operation-logs.query';

@ApiTags('操作日志模块')
@Controller('operation-log')
export class OperationLogController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @ApiQuery({ type: PageOperationLogsQueryDto })
  async page(
    @Query() queryDto: PageOperationLogsQueryDto,
  ): Promise<PaginationResult<OperationLogProperties>> {
    const query = new PageOperationLogsQuery({
      current: queryDto.current,
      size: queryDto.size,
      username: queryDto.username,
      domain: queryDto.domain,
      moduleName: queryDto.moduleName,
      method: queryDto.method,
    });
    return this.queryBus.execute<
      PageOperationLogsQuery,
      PaginationResult<OperationLogProperties>
    >(query);
  }
}
