import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import type { AppConfig, AppConfigKey } from './types';

@Injectable()
export class ConfigsService {
  constructor(private configService: ConfigService<AppConfig, true>) {}

  get<K extends keyof AppConfig>(key: K) {
    return this.configService.get<AppConfig[K]>(key);
  }

  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]) {
    this.configService.set<AppConfig[K]>(key, value);
  }

  getAll() {
    const keys: AppConfigKey[] = ['nodeEnv', 'appName', 'http', 'database', 'swagger'];

    const config = {} as AppConfig;

    keys.forEach(key => {
      Object.assign(config, { [key]: this.get(key) });
    });

    return config;
  }
}
