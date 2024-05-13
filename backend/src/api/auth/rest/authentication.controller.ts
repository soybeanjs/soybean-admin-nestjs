import {Body, Controller, Get, Post, Request} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {ApiTags} from '@nestjs/swagger';
import {PasswordLoginDTO} from '../dto/password-login.dto';
import {
  AuthenticationService
} from '@src/lib/bounded-contexts/iam/authentication/application/service/authentication.service';
import {
  PasswordIdentifierDTO
} from '@src/lib/bounded-contexts/iam/authentication/application/dto/password-identifier.dto';
import {Public} from '@src/infrastructure/decorators/public.decorator';

@ApiTags('Auth - 认证模块')
@Controller('auth')
export class AuthController {
  constructor(
    private authenticationService: AuthenticationService,
    private commandBus: CommandBus,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() dto: PasswordLoginDTO) {
    const result = await this.authenticationService.execPasswordLogin(
      new PasswordIdentifierDTO(dto.identifier, dto.password),
    );
    return result;
  }

  @Get('profile')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  async getProfile(@Request() req): IAuthentication {
    return req.user;
  }
}
