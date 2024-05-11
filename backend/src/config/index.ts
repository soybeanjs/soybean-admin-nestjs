import { AppConfig, IAppConfig, appConfigToken } from './app.configuration';
import {
  ThrottlerConfig,
  IThrottlerConfig,
  throttlerConfigToken,
} from './throttler.configuration';

export * from './app.configuration';
export * from './throttler.configuration';

export interface AllConfigType {
  [appConfigToken]: IAppConfig;
  [throttlerConfigToken]: IThrottlerConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  ThrottlerConfig,
};
