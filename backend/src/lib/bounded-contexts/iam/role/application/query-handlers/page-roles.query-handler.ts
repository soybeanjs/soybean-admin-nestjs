import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PageRolesQuery } from '../../queries/page-roles.query';
import { RoleReadRepoPortToken } from '../../constants';
import { RoleReadRepoPort } from '../../ports/role.read.repo-port';
import { Inject } from '@nestjs/common';
import { RoleProperties } from '../../domain/role.read-model';
import { PaginationResult } from '@src/shared/prisma/pagination';

@QueryHandler(PageRolesQuery)
export class PageRolesQueryHandler
  implements IQueryHandler<PageRolesQuery, PaginationResult<RoleProperties>>
{
  @Inject(RoleReadRepoPortToken) private readonly repository: RoleReadRepoPort;

  async execute(
    query: PageRolesQuery,
  ): Promise<PaginationResult<RoleProperties>> {
    return this.repository.pageRoles(query);
  }
}
