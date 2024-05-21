import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PageCasbinDomainsQueryDto } from '@src/api/iam/dto/page-casbin-domains.query-dto';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { CasbinDomainProperties } from '@src/lib/bounded-contexts/iam/casbin-domain/domain/casbin-domain.read-model';
import { PageCasbinDomainsQuery } from '@src/lib/bounded-contexts/iam/casbin-domain/queries/page-casbin-domains.query';

@ApiTags('casbin-domain管理模块')
@Controller('casbin-domain')
export class CasbinDomainController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @ApiQuery({ type: PageCasbinDomainsQueryDto })
  async page(
    @Query() queryDto: PageCasbinDomainsQueryDto,
  ): Promise<PaginationResult<CasbinDomainProperties>> {
    const query = new PageCasbinDomainsQuery({
      current: queryDto.current,
      size: queryDto.size,
      name: queryDto.name,
      status: queryDto.status,
    });
    return this.queryBus.execute<
      PageCasbinDomainsQuery,
      PaginationResult<CasbinDomainProperties>
    >(query);
  }
}
