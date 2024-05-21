import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PageLoginLogsQueryDto } from '@src/api/log-audit/login-log/dto/page-login-log.query-dto';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { LoginLogProperties } from '@src/lib/bounded-contexts/log-audit/login-log/domain/login-log.read-model';
import { PageLoginLogsQuery } from '@src/lib/bounded-contexts/log-audit/login-log/queries/page-login-logs.query';

@ApiTags('登录日志模块')
@Controller('login-log')
export class LoginLogController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @ApiQuery({ type: PageLoginLogsQueryDto })
  async page(
    @Query() queryDto: PageLoginLogsQueryDto,
  ): Promise<PaginationResult<LoginLogProperties>> {
    const query = new PageLoginLogsQuery({
      current: queryDto.current,
      size: queryDto.size,
      username: queryDto.username,
      domain: queryDto.domain,
      address: queryDto.address,
      type: queryDto.type,
    });
    return this.queryBus.execute<
      PageLoginLogsQuery,
      PaginationResult<LoginLogProperties>
    >(query);
  }
}
