import { PaginationResult } from '@src/shared/prisma/pagination';

import { CasbinDomainProperties } from '../domain/casbin-domain.read-model';
import { PageCasbinDomainsQuery } from '../queries/page-casbin-domains.query';

export interface CasbinDomainReadRepoPort {
  pageCasbinDomains(
    query: PageCasbinDomainsQuery,
  ): Promise<PaginationResult<CasbinDomainProperties>>;

  getDomainById(code: string): Promise<CasbinDomainProperties | null>;
}
