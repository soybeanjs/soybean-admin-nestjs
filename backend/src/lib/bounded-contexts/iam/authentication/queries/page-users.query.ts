import { IQuery } from '@nestjs/cqrs';
import { Status } from '@prisma/client';
import { PaginationParams } from '@src/shared/prisma/pagination';
export class PageUsersQuery extends PaginationParams implements IQuery {
  readonly username?: string;
  readonly nikeName?: string;
  readonly status?: Status;
  constructor(options: PageUsersQuery) {
    super(options.current, options.size);
    Object.assign(this, options);
  }
}
