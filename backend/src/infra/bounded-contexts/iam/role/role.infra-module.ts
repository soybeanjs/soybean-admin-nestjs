import { Module } from '@nestjs/common';
import { RoleModule } from '@src/lib/bounded-contexts/iam/role/role.module';
import { RoleReadRepoPortToken } from '@src/lib/bounded-contexts/iam/role/constants';
import { RoleReadPostgresRepository } from './repository/role-read.pg.repository';

const providers = [
  { provide: RoleReadRepoPortToken, useClass: RoleReadPostgresRepository },
];

@Module({
  imports: [
    RoleModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [RoleModule],
})
export class RoleInfraModule {}
