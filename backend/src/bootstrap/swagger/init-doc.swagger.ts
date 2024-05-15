import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Response } from '@src/infra/rest/res.response';
import { ConfigService } from '@nestjs/config';
import { appConfigToken, ConfigKeyPaths, IAppConfig } from '@src/config';
import * as process from 'node:process';
import * as packageJson from '../../../package.json';

export function initDocSwagger(
  app: INestApplication,
  configService: ConfigService<ConfigKeyPaths>,
): void {
  const { docSwaggerEnable, docSwaggerPath, port } =
    configService.get<IAppConfig>(appConfigToken, {
      infer: true,
    });

  if (!docSwaggerEnable && process.env.NODE_ENV == 'dev') return;

  const documentBuilder = new DocumentBuilder()
    .setTitle('Soybean Admin NestJS Backend API')
    .setDescription(
      'This API serves as the backend service for Soybean Admin, providing a comprehensive set of functionalities for system management and operations.',
    )
    .setVersion(packageJson.version)
    .setTermsOfService('Soybean Terms of Service')
    .setContact(
      packageJson.author.name,
      packageJson.author.url,
      packageJson.author.email,
    )
    .setLicense(
      packageJson.license,
      'https://github.com/ByteByteBrew/soybean-admin-nest/blob/main/LICENSE',
    );

  documentBuilder.addSecurity('', {
    description: 'Bearer Authentication',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    ignoreGlobalPrefix: false,
    extraModels: [Response],
  });

  SwaggerModule.setup(docSwaggerPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const logger = new Logger('SwaggerModule');
  logger.log(`Document running on http://127.0.0.1:${port}/${docSwaggerPath}`);
}
