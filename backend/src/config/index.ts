import { AppConfig, IAppConfig, appConfigToken } from './app.configuration';
import {
  RedisConfig,
  IRedisConfig,
  redisRegToken,
} from './redis.configuration';
import {
  SecurityConfig,
  ISecurityConfig,
  securityRegToken,
} from './security.configuration';
import {
  ThrottlerConfig,
  IThrottlerConfig,
  throttlerConfigToken,
} from './throttler.configuration';

export * from './app.configuration';
export * from './redis.configuration';
export * from './security.configuration';
export * from './throttler.configuration';

export interface AllConfigType {
  [appConfigToken]: IAppConfig;
  [redisRegToken]: IRedisConfig;
  [securityRegToken]: ISecurityConfig;
  [throttlerConfigToken]: IThrottlerConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  RedisConfig,
  SecurityConfig,
  ThrottlerConfig,
};
