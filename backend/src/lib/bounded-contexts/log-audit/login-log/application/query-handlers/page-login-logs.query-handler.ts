import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PageLoginLogsQuery } from '../../queries/page-login-logs.query';
import { LoginLogReadRepoPortToken } from '../../constants';
import { LoginLogReadRepoPort } from '../../ports/login-log.read.repo-port';
import { Inject } from '@nestjs/common';
import { LoginLogProperties } from '../../domain/login-log.read-model';
import { PaginationResult } from '@src/shared/prisma/pagination';

@QueryHandler(PageLoginLogsQuery)
export class PageLoginLogsQueryHandler
  implements
    IQueryHandler<PageLoginLogsQuery, PaginationResult<LoginLogProperties>>
{
  @Inject(LoginLogReadRepoPortToken)
  private readonly repository: LoginLogReadRepoPort;

  async execute(
    query: PageLoginLogsQuery,
  ): Promise<PaginationResult<LoginLogProperties>> {
    return this.repository.pageLoginLogs(query);
  }
}
