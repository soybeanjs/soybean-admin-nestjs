import {
  ClassSerializerInterceptor,
  ExecutionContext,
  Module,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

import * as casbin from 'casbin';
import { AuthZModule, AUTHZ_ENFORCER, PrismaAdapter } from '@src/infra/casbin';
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
    EventEmitterModule.forRoot({
      wildcard: process.env.EVENT_EMITTER_WILDCARD === 'true',
      delimiter: process.env.EVENT_EMITTER_DELIMITER || '.',
      newListener: process.env.EVENT_EMITTER_NEW_LISTENER === 'true',
      removeListener: process.env.EVENT_EMITTER_REMOVE_LISTENER === 'true',
      maxListeners: parseInt(
        process.env.EVENT_EMITTER_MAX_LISTENERS || '20',
        10,
      ),
      ignoreErrors: process.env.EVENT_EMITTER_IGNORE_ERRORS === 'true',
    }),

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
