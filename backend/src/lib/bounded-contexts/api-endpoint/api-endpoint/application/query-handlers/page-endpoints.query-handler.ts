import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PageEndpointsQuery } from '../../queries/page-endpoints.query';
import { ApiEndpointReadRepoPortToken } from '../../constants';
import { ApiEndpointReadRepoPort } from '../../ports/api-endpoint.read.repo-port';
import { Inject } from '@nestjs/common';
import { EndpointProperties } from '../../domain/endpoint.read-model';
import { PaginationResult } from '@src/shared/prisma/pagination';

@QueryHandler(PageEndpointsQuery)
export class PageEndpointsQueryHandler
  implements
    IQueryHandler<PageEndpointsQuery, PaginationResult<EndpointProperties>>
{
  @Inject(ApiEndpointReadRepoPortToken)
  private readonly repository: ApiEndpointReadRepoPort;

  async execute(
    query: PageEndpointsQuery,
  ): Promise<PaginationResult<EndpointProperties>> {
    return this.repository.pageEndpoints(query);
  }
}
