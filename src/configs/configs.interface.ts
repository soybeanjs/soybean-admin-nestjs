export interface AppConfig {
  nodeEnv: NodeEnv;
  appName: string;
  http: AppConfigHttp;
  database: AppConfigDataBase;
  swagger: AppConfigSwagger;
}

export type AppConfigKey = keyof AppConfig;

export type NodeEnv = 'dev' | 'prod';

export interface AppConfigHttp {
  host: string;
  port: number;
  url: string;
}

export interface AppConfigDataBase {
  host: string;
  port: number;
}

export interface AppConfigSwagger {
  enable: boolean;
  path: string;
  title: string;
  description: string;
  version: string;
}
