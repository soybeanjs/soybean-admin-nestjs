import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @CacheKey('cache_test_key')
  @CacheTTL(1000 * 60 * 10)
  @UseInterceptors(CacheInterceptor)
  @Get('cache')
  async cache(): Promise<string> {
    return randomStringGenerator();
  }
}
