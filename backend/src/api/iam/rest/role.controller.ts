import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { PageRolesQueryDto } from '../dto/page-roles.query-dto';
import { RoleProperties } from '@src/lib/bounded-contexts/iam/role/domain/role.read-model';
import { PageRolesQuery } from '@src/lib/bounded-contexts/iam/role/queries/page-roles.query';

@ApiTags('角色管理模块')
@Controller('role')
export class RoleController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @ApiQuery({ type: PageRolesQueryDto })
  async page(
    @Query() queryDto: PageRolesQueryDto,
  ): Promise<PaginationResult<RoleProperties>> {
    const query = new PageRolesQuery({
      current: queryDto.current,
      size: queryDto.size,
      code: queryDto.code,
      name: queryDto.name,
      status: queryDto.status,
    });
    return this.queryBus.execute<
      PageRolesQuery,
      PaginationResult<RoleProperties>
    >(query);
  }
}
