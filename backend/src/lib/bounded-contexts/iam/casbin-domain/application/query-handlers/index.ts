import { GetDomainByIdQueryHandler } from './domain.by-id.query-handler';
import { PageCasbinDomainsQueryHandler } from './page-casbin-domains.query-handler';

export const QueryHandlers = [
  PageCasbinDomainsQueryHandler,
  GetDomainByIdQueryHandler,
];
