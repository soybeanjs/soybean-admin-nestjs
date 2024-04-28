import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import config from './init';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.production'], load: [config] })],
  providers: [ConfigsService]
})
export class ConfigsModule {}
