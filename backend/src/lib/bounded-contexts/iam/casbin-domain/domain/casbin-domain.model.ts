import { AggregateRoot } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import { CasbinDomainProperties } from '../domain/casbin-domain.read-model';

export interface ICasbinDomain {
  commit(): void;
}

export class CasbinDomain extends AggregateRoot implements ICasbinDomain {
  id: string;
  code: string;
  name: string;
  description: string;
  status: Status;

  constructor(properties: CasbinDomainProperties) {
    super();
    Object.assign(this, properties);
  }
}
