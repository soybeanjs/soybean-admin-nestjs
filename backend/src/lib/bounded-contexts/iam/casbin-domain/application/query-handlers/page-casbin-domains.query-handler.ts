import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginationResult } from '@src/shared/prisma/pagination';

import { CasbinDomainReadRepoPortToken } from '../../constants';
import { CasbinDomainProperties } from '../../domain/casbin-domain.read-model';
import { CasbinDomainReadRepoPort } from '../../ports/casbin-domain.read.repo-port';
import { PageCasbinDomainsQuery } from '../../queries/page-casbin-domains.query';

@QueryHandler(PageCasbinDomainsQuery)
export class PageCasbinDomainsQueryHandler
  implements
    IQueryHandler<
      PageCasbinDomainsQuery,
      PaginationResult<CasbinDomainProperties>
    >
{
  @Inject(CasbinDomainReadRepoPortToken)
  private readonly repository: CasbinDomainReadRepoPort;

  async execute(
    query: PageCasbinDomainsQuery,
  ): Promise<PaginationResult<CasbinDomainProperties>> {
    return this.repository.pageCasbinDomains(query);
  }
}
