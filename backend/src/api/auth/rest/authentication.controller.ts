import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { PasswordLoginDTO } from '../dto/password-login.dto';
import { AuthenticationService } from '@src/lib/bounded-contexts/iam/authentication/application/service/authentication.service';
import { PasswordIdentifierDTO } from '@src/lib/bounded-contexts/iam/authentication/application/dto/password-identifier.dto';
import { Public } from '@src/infra/decorators/public.decorator';
import { USER_AGENT, X_REQUEST_ID } from '@src/constants/rest.constant';
import { getClientIpAndPort } from '@src/utils/ip.util';
import { FastifyRequest } from 'fastify';

@ApiTags('Auth - 认证模块')
@Controller('auth')
export class AuthController {
  constructor(
    private authenticationService: AuthenticationService,
    private commandBus: CommandBus,
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() dto: PasswordLoginDTO,
    @Request() request: FastifyRequest,
  ) {
    const { ip, port } = getClientIpAndPort(request);
    const result = await this.authenticationService.execPasswordLogin(
      new PasswordIdentifierDTO(
        dto.identifier,
        dto.password,
        ip,
        'TODO',
        request.headers[USER_AGENT] ?? '',
        Array.isArray(request.headers[X_REQUEST_ID])
          ? request.headers[X_REQUEST_ID][0]
          : request.headers[X_REQUEST_ID] || '',
        'PC',
        port,
      ),
    );
    return result;
  }

  @Get('profile')
  async getProfile(@Request() req: any): Promise<IAuthentication> {
    return req.user;
  }
}
