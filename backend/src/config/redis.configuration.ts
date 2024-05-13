import { ConfigType, registerAs } from '@nestjs/config';
import { getEnvNumber, getEnvString } from '@src/utils/env';

export const redisRegToken = 'redis';

export const RedisConfig = registerAs(redisRegToken, () => ({
  host: getEnvString('REDIS_HOST', '127.0.0.1'),
  port: getEnvNumber('REDIS_PORT', 6379),
  password: getEnvString('REDIS_PASSWORD', ''),
  db: getEnvNumber('REDIS_DB', 1),
}));

export type IRedisConfig = ConfigType<typeof RedisConfig>;
