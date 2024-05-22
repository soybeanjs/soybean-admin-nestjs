import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { RoleReadRepoPortToken } from '../../constants';
import { RoleProperties } from '../../domain/role.read-model';
import { RoleReadRepoPort } from '../../ports/role.read.repo-port';
import { GetRoleByIdQuery } from '../../queries/role.by-id.query';

@QueryHandler(GetRoleByIdQuery)
export class GetRoleByIdQueryHandler
  implements IQueryHandler<GetRoleByIdQuery, Readonly<RoleProperties> | null>
{
  @Inject(RoleReadRepoPortToken) private readonly repository: RoleReadRepoPort;

  async execute(
    query: GetRoleByIdQuery,
  ): Promise<Readonly<RoleProperties> | null> {
    return this.repository.getRoleById(query.id);
  }
}
