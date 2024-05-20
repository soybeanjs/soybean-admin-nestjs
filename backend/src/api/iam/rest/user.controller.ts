import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PageUsersQuery } from '@src/lib/bounded-contexts/iam/authentication/queries/page-users.query';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { UserEssentialProperties } from '@src/lib/bounded-contexts/iam/authentication/domain/user.read-model';
import { PageUsersQueryDto } from '../dto/page-users.query-dto';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @ApiQuery({ type: PageUsersQueryDto })
  async page(
    @Query() queryDto: PageUsersQueryDto,
  ): Promise<PaginationResult<UserEssentialProperties>> {
    const query = new PageUsersQuery({
      current: queryDto.current,
      size: queryDto.size,
      username: queryDto.username,
      nikeName: queryDto.nikeName,
      status: queryDto.status,
    });
    return this.queryBus.execute<
      PageUsersQuery,
      PaginationResult<UserEssentialProperties>
    >(query);
  }
}
