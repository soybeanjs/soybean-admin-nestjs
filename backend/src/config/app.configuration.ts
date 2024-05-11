import { ConfigType, registerAs } from '@nestjs/config';
import { getEnvNumber } from '@src/utils/env';

export const appConfigToken = 'app';

export const AppConfig = registerAs(appConfigToken, () => ({
  port: getEnvNumber('APP_PORT', 9528),
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
