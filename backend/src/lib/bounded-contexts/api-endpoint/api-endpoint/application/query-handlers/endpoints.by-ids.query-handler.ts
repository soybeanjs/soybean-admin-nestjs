import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindEndpointsByIdsQuery } from '../../queries/endpoints.by-ids.query';
import { ApiEndpointReadRepoPortToken } from '../../constants';
import { ApiEndpointReadRepoPort } from '../../ports/api-endpoint.read.repo-port';
import { Inject } from '@nestjs/common';
import { EndpointProperties } from '../../domain/endpoint.read-model';

@QueryHandler(FindEndpointsByIdsQuery)
export class FindEndpointsByIdsQueryHandler
  implements IQueryHandler<FindEndpointsByIdsQuery, EndpointProperties[]>
{
  @Inject(ApiEndpointReadRepoPortToken)
  private readonly repository: ApiEndpointReadRepoPort;

  async execute(query: FindEndpointsByIdsQuery): Promise<EndpointProperties[]> {
    return this.repository.findEndpointsByIds(query.ids);
  }
}
