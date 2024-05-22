import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { USER_AGENT, X_REQUEST_ID } from '@src/constants/rest.constant';
import { Public } from '@src/infra/decorators/public.decorator';
import { PasswordIdentifierDTO } from '@src/lib/bounded-contexts/iam/authentication/application/dto/password-identifier.dto';
import { AuthenticationService } from '@src/lib/bounded-contexts/iam/authentication/application/service/authentication.service';
import { getClientIpAndPort } from '@src/utils/ip.util';

import { PasswordLoginDto } from '../dto/password-login.dto';

@ApiTags('Authentication - Module')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private authenticationService: AuthenticationService,
    private commandBus: CommandBus,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Password-based User Authentication',
    description:
      'Authenticates a user by verifying provided password credentials and issues a JSON Web Token (JWT) upon successful authentication.',
  })
  async login(
    @Body() dto: PasswordLoginDto,
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
          : request.headers[X_REQUEST_ID] ?? '',
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
