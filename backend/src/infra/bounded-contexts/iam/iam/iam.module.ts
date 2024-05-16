import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigKeyPaths, ISecurityConfig, securityRegToken } from '@src/config';
import { UserReadPostgresRepository } from './repository/user-read.pg.repository';
import { LoginLogWriteRepository } from './repository/login-log-write.pg.repository';
import {
  LoginLogWriteRepoPortToken,
  UserReadRepoPortToken,
} from '@src/lib/bounded-contexts/iam/authentication/constants';
import { AuthenticationModule } from '@src/lib/bounded-contexts/iam/authentication/authentication.module';

const providers = [
  { provide: UserReadRepoPortToken, useClass: UserReadPostgresRepository },
  { provide: LoginLogWriteRepoPortToken, useClass: LoginLogWriteRepository },
];

@Module({
  imports: [
    AuthenticationModule.register({
      inject: [...providers],
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
            const { jwtSecret, jwtExpiresIn } =
              configService.get<ISecurityConfig>(securityRegToken, {
                infer: true,
              });

            return {
              secret: jwtSecret,
              signOptions: {
                expiresIn: `${jwtExpiresIn}s`,
              },
            };
          },
          inject: [ConfigService],
        }),
      ],
    }),
  ],
  exports: [AuthenticationModule],
})
export class IamModule {}
