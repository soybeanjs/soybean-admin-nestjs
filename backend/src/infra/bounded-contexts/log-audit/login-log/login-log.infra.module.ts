import { Module } from '@nestjs/common';
import { LoginLogWriteRepository } from './repository/login-log-write.pg.repository';
import { LoginLogModule } from '@src/lib/bounded-contexts/log-audit/login-log/login-log.module';
import { LoginLogWriteRepoPortToken } from '@src/lib/bounded-contexts/log-audit/login-log/constants';

const providers = [
  {
    provide: LoginLogWriteRepoPortToken,
    useClass: LoginLogWriteRepository,
  },
];

@Module({
  imports: [
    LoginLogModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [LoginLogModule],
})
export class LoginLogInfraModule {}
