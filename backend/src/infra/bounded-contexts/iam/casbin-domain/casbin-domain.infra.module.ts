import { Module } from '@nestjs/common';

import { CasbinDomainModule } from '@src/lib/bounded-contexts/iam/casbin-domain/casbin-domain.module';
import {
  CasbinDomainReadRepoPortToken,
  CasbinDomainWriteRepoPortToken,
} from '@src/lib/bounded-contexts/iam/casbin-domain/constants';

import { CasbinDomainReadRepository } from './repository/casbin-domain.read.pg.repository';
import { CasbinDomainWriteRepository } from './repository/casbin-domain.write.pg.repository';

const providers = [
  {
    provide: CasbinDomainReadRepoPortToken,
    useClass: CasbinDomainReadRepository,
  },
  {
    provide: CasbinDomainWriteRepoPortToken,
    useClass: CasbinDomainWriteRepository,
  },
];

@Module({
  imports: [
    CasbinDomainModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [CasbinDomainModule],
})
export class CasbinDomainInfraModule {}
