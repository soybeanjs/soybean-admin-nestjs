import { IQuery } from '@nestjs/cqrs';
export class GetRolesQuery implements IQuery {
  constructor(readonly userId: string) {}
}
