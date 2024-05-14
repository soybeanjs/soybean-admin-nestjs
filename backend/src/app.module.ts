import {
  ClassSerializerInterceptor,
  ExecutionContext,
  Module,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import * as casbin from 'casbin';
import { AuthZModule, AUTHZ_ENFORCER, PrismaAdapter } from '@src/infra/casbin';
import { BootstrapModule } from '@src/bootstrap/bootstrap.module';
import { GlobalCqrsModule } from '@src/global/module/global.module';

import { JwtStrategy } from '@src/infra/strategies/jwt.passport-strategy';

import config, {
  ConfigKeyPaths,
  IRedisConfig,
  ISecurityConfig,
  IThrottlerConfig,
  redisRegToken,
  securityRegToken,
  throttlerConfigToken,
} from './config';
import { SharedModule } from '@src/shared/shared.module';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { Redis } from 'ioredis';

import { JwtAuthGuard } from '@src/infra/guards/jwt.auth-guard';

import { ApiModule } from '@src/api/api.module';

//nest init
import { AppController } from './app.controller';
import { AppService } from './app.service';

const strategies = [JwtStrategy];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    AuthZModule.register({
      imports: [ConfigModule],
      enforcerProvider: {
        provide: AUTHZ_ENFORCER,
        useFactory: async (configService: ConfigService) => {
          const adapter = await PrismaAdapter.newAdapter();
          const { casbinModel } = configService.get<ISecurityConfig>(
            securityRegToken,
            {
              infer: true,
            },
          );
          return casbin.newEnforcer(casbinModel, adapter);
        },
        inject: [ConfigService],
      },
      usernameFromContext: (ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: IAuthentication = request.user;
        return user && user.username;
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const { ttl, limit, errorMessage } =
          configService.get<IThrottlerConfig>(throttlerConfigToken, {
            infer: true,
          });

        const redisOpts = configService.get<IRedisConfig>(redisRegToken, {
          infer: true,
        });

        let throttlerStorageRedisService: ThrottlerStorageRedisService;

        switch (redisOpts.mode) {
          case 'cluster':
            throttlerStorageRedisService = new ThrottlerStorageRedisService(
              new Redis.Cluster(redisOpts.cluster),
            );
            break;
          default:
            throttlerStorageRedisService = new ThrottlerStorageRedisService(
              new Redis({
                host: redisOpts.standalone.host,
                port: redisOpts.standalone.port,
                password: redisOpts.standalone.password,
                db: redisOpts.standalone.db,
              }),
            );
            break;
        }

        return {
          errorMessage: errorMessage,
          throttlers: [
            {
              ttl: ttl,
              limit: limit,
            },
          ],
          storage: throttlerStorageRedisService,
        };
      },
    }),

    BootstrapModule,
    GlobalCqrsModule,

    ApiModule,

    SharedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    ...strategies,

    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },

    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
