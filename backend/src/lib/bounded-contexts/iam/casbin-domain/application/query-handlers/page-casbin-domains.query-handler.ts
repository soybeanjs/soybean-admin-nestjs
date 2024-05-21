import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PageCasbinDomainsQuery } from '../../queries/page-casbin-domains.query';
import { CasbinDomainReadRepoPortToken } from '../../constants';
import { CasbinDomainReadRepoPort } from '../../ports/casbin-domain.read.repo-port';
import { Inject } from '@nestjs/common';
import { CasbinDomainProperties } from '../../domain/casbin-domain.read-model';
import { PaginationResult } from '@src/shared/prisma/pagination';

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
