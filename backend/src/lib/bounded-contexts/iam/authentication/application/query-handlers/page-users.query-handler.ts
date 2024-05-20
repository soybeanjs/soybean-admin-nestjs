import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PageUsersQuery } from '../../queries/page-users.query';
import { UserReadRepoPortToken } from '../../constants';
import { UserReadRepoPort } from '../../ports/user-read.repo-port';
import { Inject } from '@nestjs/common';
import { UserProperties } from '../../domain/user.read-model';
import { PaginationResult } from '@src/shared/prisma/pagination';

@QueryHandler(PageUsersQuery)
export class PageUsersQueryHandler
  implements IQueryHandler<PageUsersQuery, PaginationResult<UserProperties>>
{
  @Inject(UserReadRepoPortToken) private readonly repository: UserReadRepoPort;

  async execute(
    query: PageUsersQuery,
  ): Promise<PaginationResult<UserProperties>> {
    return this.repository.pageUsers(query);
  }
}
