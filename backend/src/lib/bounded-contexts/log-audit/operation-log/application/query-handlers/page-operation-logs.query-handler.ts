import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PageOperationLogsQuery } from '../../queries/page-operation-logs.query';
import { OperationLogReadRepoPortToken } from '../../constants';
import { OperationLogReadRepoPort } from '../../ports/operation-log.read.repo-port';
import { Inject } from '@nestjs/common';
import { OperationLogProperties } from '../../domain/operation-log.read-model';
import { PaginationResult } from '@src/shared/prisma/pagination';

@QueryHandler(PageOperationLogsQuery)
export class PageOperationLogsQueryHandler
  implements
    IQueryHandler<
      PageOperationLogsQuery,
      PaginationResult<OperationLogProperties>
    >
{
  @Inject(OperationLogReadRepoPortToken)
  private readonly repository: OperationLogReadRepoPort;

  async execute(
    query: PageOperationLogsQuery,
  ): Promise<PaginationResult<OperationLogProperties>> {
    return this.repository.pageOperationLogs(query);
  }
}
