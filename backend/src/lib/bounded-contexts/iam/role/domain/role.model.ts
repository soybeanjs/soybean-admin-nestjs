import { AggregateRoot } from '@nestjs/cqrs';
import { RoleProperties } from '../domain/role.read-model';
import { Status } from '@prisma/client';

export interface IRole {
  commit(): void;
}

export class Role extends AggregateRoot implements IRole {
  id: string;
  code: string;
  name: string;
  description: string;
  pid: string;
  status: Status;
  createdAt: Date;
  createdBy: string;

  constructor(properties: RoleProperties) {
    super();
    Object.assign(this, properties);
  }
}
