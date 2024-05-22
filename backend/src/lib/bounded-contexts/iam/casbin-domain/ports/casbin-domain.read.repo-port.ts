import { PaginationResult } from '@src/shared/prisma/pagination';
import { PageCasbinDomainsQuery } from '../queries/page-casbin-domains.query';
import { CasbinDomainProperties } from '../domain/casbin-domain.read-model';

export interface CasbinDomainReadRepoPort {
  pageCasbinDomains(
    query: PageCasbinDomainsQuery,
  ): Promise<PaginationResult<CasbinDomainProperties>>;

  getDomainById(code: string): Promise<CasbinDomainProperties | null>;
}
