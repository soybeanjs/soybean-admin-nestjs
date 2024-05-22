import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { CasbinDomainReadRepoPortToken } from '../../constants';
import { CasbinDomainProperties } from '../../domain/casbin-domain.read-model';
import { CasbinDomainReadRepoPort } from '../../ports/casbin-domain.read.repo-port';
import { GetDomainByCodeQuery } from '../../queries/domain.by-id.query';

@QueryHandler(GetDomainByCodeQuery)
export class GetDomainByIdQueryHandler
  implements IQueryHandler<GetDomainByCodeQuery, CasbinDomainProperties | null>
{
  @Inject(CasbinDomainReadRepoPortToken)
  private readonly repository: CasbinDomainReadRepoPort;

  async execute(
    query: GetDomainByCodeQuery,
  ): Promise<CasbinDomainProperties | null> {
    return this.repository.getDomainById(query.code);
  }
}
