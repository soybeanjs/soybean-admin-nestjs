import { Module } from '@nestjs/common';
import { UserReadPostgresRepository } from './repository/user-read.pg.repository';
import { UserReadRepoPortToken } from '@src/lib/bounded-contexts/iam/authentication/constants';
import { AuthenticationModule } from '@src/lib/bounded-contexts/iam/authentication/authentication.module';

const providers = [
  { provide: UserReadRepoPortToken, useClass: UserReadPostgresRepository },
];

@Module({
  imports: [
    AuthenticationModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [AuthenticationModule],
})
export class IamModule {}
