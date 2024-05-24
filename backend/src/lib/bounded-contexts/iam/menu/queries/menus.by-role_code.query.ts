import { IQuery } from '@nestjs/cqrs';

export class MenusByRoleCodeQuery implements IQuery {
  constructor(
    readonly roleCode: string[],
    readonly domain: string,
  ) {}
}
