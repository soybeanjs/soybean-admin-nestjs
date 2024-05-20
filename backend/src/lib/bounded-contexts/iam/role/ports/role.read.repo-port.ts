import { PaginationResult } from '@src/shared/prisma/pagination';
import { PageRolesQuery } from '../queries/page-roles.query';
import { RoleProperties } from '../domain/role.read-model';

export interface RoleReadRepoPort {
  findRolesByUserId(userId: string): Promise<Set<string>>;

  pageRoles(query: PageRolesQuery): Promise<PaginationResult<RoleProperties>>;
}
