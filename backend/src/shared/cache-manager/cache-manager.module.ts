import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisOptions } from 'ioredis';
import { ConfigKeyPaths, IRedisConfig, redisRegToken } from '@src/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const redisOptions: RedisOptions = configService.get<IRedisConfig>(
          redisRegToken,
          { infer: true },
        );

        return {
          store: redisStore,
          isCacheableValue: () => true,
          ...redisOptions,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class CacheManagerModule {}
