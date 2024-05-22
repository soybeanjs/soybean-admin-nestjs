import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PageUsersQuery } from '@src/lib/bounded-contexts/iam/authentication/queries/page-users.query';
import { PaginationResult } from '@src/shared/prisma/pagination';
import {
  UserProperties,
  UserReadModel,
} from '@src/lib/bounded-contexts/iam/authentication/domain/user.read-model';
import { PageUsersQueryDto } from '../dto/page-users.query-dto';
import { ApiResponseDoc } from '@src/infra/decorators/api-result.decorator';

@ApiTags('User - Module')
@Controller('user')
export class UserController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve Paginated Users',
  })
  @ApiResponseDoc({ type: UserReadModel, isPaged: true })
  async page(
    @Query() queryDto: PageUsersQueryDto,
  ): Promise<PaginationResult<UserProperties>> {
    const query = new PageUsersQuery({
      current: queryDto.current,
      size: queryDto.size,
      username: queryDto.username,
      nikeName: queryDto.nikeName,
      status: queryDto.status,
    });
    return this.queryBus.execute<
      PageUsersQuery,
      PaginationResult<UserProperties>
    >(query);
  }
}
