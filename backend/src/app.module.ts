import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { GlobalCqrsModule } from '@src/global/module/global.module';

import { JwtStrategy } from '@src/infrastructure/strategies/jwt.passport-strategy';

import config, {
  ConfigKeyPaths,
  IThrottlerConfig,
  throttlerConfigToken,
} from './config';
import { SharedModule } from '@src/shared/shared.module';

import { JwtAuthGuard } from '@src/infrastructure/guards/jwt.auth-guard';

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
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const { ttl, limit, errorMessage } =
          configService.get<IThrottlerConfig>(throttlerConfigToken, {
            infer: true,
          });
        return {
          errorMessage: errorMessage,
          throttlers: [
            {
              ttl: ttl,
              limit: limit,
            },
          ],
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
