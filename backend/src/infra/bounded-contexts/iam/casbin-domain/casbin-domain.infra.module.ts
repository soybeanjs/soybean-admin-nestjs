import { Module } from '@nestjs/common';
import { CasbinDomainWriteRepository } from './repository/casbin-domain.write.pg.repository';
import { CasbinDomainReadRepository } from './repository/casbin-domain.read.pg.repository';
import {
  CasbinDomainReadRepoPortToken,
  CasbinDomainWriteRepoPortToken,
} from '@src/lib/bounded-contexts/iam/casbin-domain/constants';
import { CasbinDomainModule } from '@src/lib/bounded-contexts/iam/casbin-domain/casbin-domain.module';

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
