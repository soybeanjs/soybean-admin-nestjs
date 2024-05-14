import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ApiOperation } from '@nestjs/swagger';
import {
  AuthActionVerb,
  AuthPossession,
  AuthZGuard,
  UsePermissions,
} from '@src/infra/casbin';

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
    possession: AuthPossession.ANY,
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
}
