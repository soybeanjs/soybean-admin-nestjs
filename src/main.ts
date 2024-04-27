import process from 'node:process';
import { consola } from 'consola';
import { blue, lightGreen } from 'kolorist';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME)
    .setDescription(`API description of ${process.env.APP_NAME}`)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = Number.parseInt(process.env.PORT, 10) || 8080;
  await app.listen(port);

  consola.log('\n');
  consola.success(lightGreen(`${process.env.APP_NAME} Service is running!`));
  consola.log('\n');
  consola.log(lightGreen(`Local: ${blue(`http://localhost:${port}`)}`));
  consola.log(lightGreen(`Swagger: ${blue(`http://localhost:${port}/api`)}`));
}

bootstrap();
