import { consola } from 'consola';
import { lightBlue, lightGreen } from 'kolorist';
import type { AppConfig } from '@/configs/types';

export function setupStartupLog(config: Pick<AppConfig, 'appName' | 'swagger' | 'http'>) {
  const { appName, swagger, http } = config;

  consola.log('\n');
  consola.success(lightGreen(`${appName} Service is running!`));
  consola.log('\n');
  consola.log(lightGreen(`Url: ${lightBlue(http.url)}`));

  if (swagger.enable) {
    consola.log(lightGreen(`Swagger: ${lightBlue(`${http.url}/${swagger.path}`)}`));
  }
}
