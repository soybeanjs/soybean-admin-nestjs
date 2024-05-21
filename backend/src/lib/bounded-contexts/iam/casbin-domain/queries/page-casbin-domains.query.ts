import { IQuery } from '@nestjs/cqrs';
import { PaginationParams } from '@src/shared/prisma/pagination';
import { Status } from '@prisma/client';
export class PageCasbinDomainsQuery extends PaginationParams implements IQuery {
  readonly name?: string;
  readonly status?: Status;
  constructor(options: PageCasbinDomainsQuery) {
    super(options.current, options.size);
    Object.assign(this, options);
  }
}
