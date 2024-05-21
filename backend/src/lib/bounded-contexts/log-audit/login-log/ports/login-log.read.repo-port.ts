import { PaginationResult } from '@src/shared/prisma/pagination';
import { PageLoginLogsQuery } from '../queries/page-login-logs.query';
import { LoginLogProperties } from '../domain/login-log.read-model';

export interface LoginLogReadRepoPort {
  pageLoginLogs(
    query: PageLoginLogsQuery,
  ): Promise<PaginationResult<LoginLogProperties>>;
}
