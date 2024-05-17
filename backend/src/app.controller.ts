import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ApiOperation } from '@nestjs/swagger';
import { AuthActionVerb, AuthZGuard, UsePermissions } from '@src/infra/casbin';
import { RedisUtility } from '@src/shared/redis/services/redis.util';
import { Log } from '@src/infra/decorators/log.decorator';

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

  @ApiOperation({
    summary: 'casbin auth test',
  })
  @Get('users')
  @UseGuards(AuthZGuard)
  @UsePermissions({
    action: AuthActionVerb.READ,
    resource: 'users_list',
  })
  async users() {
    return 'users';
  }

  @ApiOperation({
    summary: 'Get own info',
  })
  @Get('users/me')
  async me(@Req() req: any) {
    return req.user;
  }

  private readonly redisClient = RedisUtility.client();

  @Get('redis')
  async redis(@Query('val') val: string) {
    await RedisUtility.instance.set(`key_${val}`, val);
    return RedisUtility.instance.get(`key_${val}`);
  }

  @Log('app.controller', 'operation log', {
    logParams: true,
    logBody: true,
    logResponse: true,
  })
  @Get('log')
  async log() {
    return new Date();
  }
}
