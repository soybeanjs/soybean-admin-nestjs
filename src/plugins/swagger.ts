import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { AppConfigSwagger } from '../configs/types';

export function setupSwagger(app: INestApplication, config: AppConfigSwagger) {
  const { enable, path, title, description, version } = config;
  if (!enable) return;

  const swaggerConfig = new DocumentBuilder().setTitle(title).setDescription(description).setVersion(version).build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(path, app, document);
}
