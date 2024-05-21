import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PageEndpointsQueryDto } from '@src/api/endpoint/dto/page-endpoint.query-dto';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { EndpointProperties } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/domain/endpoint.read-model';
import { PageEndpointsQuery } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/queries/page-endpoints.query';

@ApiTags('接口资源管理模块')
@Controller('api-endpoint')
export class EndpointController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @ApiQuery({ type: PageEndpointsQueryDto })
  async page(
    @Query() queryDto: PageEndpointsQueryDto,
  ): Promise<PaginationResult<EndpointProperties>> {
    const query = new PageEndpointsQuery({
      current: queryDto.current,
      size: queryDto.size,
      path: queryDto.path,
      method: queryDto.method,
      action: queryDto.action,
      resource: queryDto.resource,
    });
    return this.queryBus.execute<
      PageEndpointsQuery,
      PaginationResult<EndpointProperties>
    >(query);
  }
}
