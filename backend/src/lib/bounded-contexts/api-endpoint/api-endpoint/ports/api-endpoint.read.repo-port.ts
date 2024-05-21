import { PaginationResult } from '@src/shared/prisma/pagination';
import { EndpointProperties } from '../domain/endpoint.read-model';
import { PageEndpointsQuery } from '../queries/page-endpoints.query';

export interface ApiEndpointReadRepoPort {
  pageEndpoints(
    query: PageEndpointsQuery,
  ): Promise<PaginationResult<EndpointProperties>>;
}
