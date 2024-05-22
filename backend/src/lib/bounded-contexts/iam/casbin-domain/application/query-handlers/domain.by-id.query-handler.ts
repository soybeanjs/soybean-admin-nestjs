import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDomainByCodeQuery } from '../../queries/domain.by-id.query';
import { CasbinDomainReadRepoPortToken } from '../../constants';
import { CasbinDomainReadRepoPort } from '../../ports/casbin-domain.read.repo-port';
import { Inject } from '@nestjs/common';
import { CasbinDomainProperties } from '../../domain/casbin-domain.read-model';

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
