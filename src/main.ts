import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigsService } from './configs/configs.service';
import { setupSwagger } from './plugins/swagger';
import { setupStartupLog } from './plugins/startup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigsService);
  const { appName, swagger, http } = configService.getAll();

  setupSwagger(app, swagger);

  await app.listen(http.port, http.host);

  setupStartupLog({ appName, swagger, http });
}

bootstrap();
