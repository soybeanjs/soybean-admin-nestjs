import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { PageRolesQueryDto } from '../dto/page-roles.query-dto';
import { RoleProperties } from '@src/lib/bounded-contexts/iam/role/domain/role.read-model';
import { PageRolesQuery } from '@src/lib/bounded-contexts/iam/role/queries/page-roles.query';
import { RoleCreateDto } from '@src/api/iam/dto/role-create.dto';
import { RoleCreateCommand } from '@src/lib/bounded-contexts/iam/role/commands/role-create.command';

@ApiTags('角色管理模块')
@Controller('role')
export class RoleController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

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

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createRole(@Body() dto: RoleCreateDto, @Request() req: any) {
    await this.commandBus.execute(
      new RoleCreateCommand(
        dto.code,
        dto.name,
        dto.pid,
        dto.description,
        req.user.uid,
      ),
    );
  }
}
