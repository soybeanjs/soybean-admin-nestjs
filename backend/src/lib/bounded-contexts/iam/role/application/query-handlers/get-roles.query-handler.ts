import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { RoleReadRepoPortToken } from '../../constants';
import { RoleReadRepoPort } from '../../ports/role.read.repo-port';
import { GetRolesQuery } from '../../queries/get-roles.query';

@QueryHandler(GetRolesQuery)
export class GetRolesQueryHandler
  implements IQueryHandler<GetRolesQuery, Set<string>>
{
  @Inject(RoleReadRepoPortToken) private readonly repository: RoleReadRepoPort;

  async execute(query: GetRolesQuery): Promise<Set<string>> {
    return this.repository.findRolesByUserId(query.userId);
  }
}
