import { PaginationResult } from '@src/shared/prisma/pagination';
import { PageOperationLogsQuery } from '../queries/page-operation-logs.query';
import { OperationLogProperties } from '../domain/operation-log.read-model';

export interface OperationLogReadRepoPort {
  pageOperationLogs(
    query: PageOperationLogsQuery,
  ): Promise<PaginationResult<OperationLogProperties>>;
}
