import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import initConfig from './init';
import type { AppConfig, AppConfigKey } from './configs.interface';

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
    const keys: AppConfigKey[] = Object.keys(initConfig()) as AppConfigKey[];

    const config = {} as AppConfig;

    keys.forEach(key => {
      Object.assign(config, { [key]: this.get(key) });
    });

    return config;
  }
}
