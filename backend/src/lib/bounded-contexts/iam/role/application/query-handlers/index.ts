import { GetRolesQueryHandler } from './get-roles.query-handler';
import { PageRolesQueryHandler } from './page-roles.query-handler';
import { GetRoleByIdQueryHandler } from './role.by-id.query-handler';

export const QueryHandlers = [
  GetRolesQueryHandler,
  PageRolesQueryHandler,
  GetRoleByIdQueryHandler,
];
