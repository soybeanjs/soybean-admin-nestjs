import process from 'node:process';
import type { AppConfig } from './types';

function initAppConfig(): AppConfig {
  const appName = process.env.APP_NAME;

  return {
    nodeEnv: process.env.NODE_ENV,
    appName,
    http: {
      host: process.env.HOST,
      port: Number.parseInt(process.env.PORT, 10),
      get url() {
        return `http://${this.host}:${this.port}`;
      }
    },
    database: {
      host: process.env.DATABASE_HOST,
      port: Number.parseInt(process.env.DATABASE_PORT, 10)
    },
    swagger: {
      enable: true,
      path: 'api',
      title: appName,
      description: `API of ${appName}`,
      version: '1.0'
    }
  };
}

export default initAppConfig;
