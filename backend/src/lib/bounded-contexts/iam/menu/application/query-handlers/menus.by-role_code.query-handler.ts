import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { MenuReadRepoPortToken } from '../../constants';
import { MenuProperties } from '../../domain/menu.read-model';
import { MenuReadRepoPort } from '../../ports/menu.read.repo-port';
import { MenusByRoleCodeQuery } from '../../queries/menus.by-role_code.query';

@QueryHandler(MenusByRoleCodeQuery)
export class MenusByRoleCodeQueryQueryHandler
  implements
    IQueryHandler<MenusByRoleCodeQuery, Readonly<MenuProperties[]> | []>
{
  @Inject(MenuReadRepoPortToken) private readonly repository: MenuReadRepoPort;

  async execute(
    query: MenusByRoleCodeQuery,
  ): Promise<Readonly<MenuProperties[]> | []> {
    return this.repository.findMenusByRoleCode(query.roleCode, query.domain);
  }
}
