import { IQuery } from '@nestjs/cqrs';
export class GetRoleByIdQuery implements IQuery {
  constructor(readonly id: string) {}
}
