import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { PasswordLoginDTO } from '../dto/password-login.dto';
import { PasswordLoginCommand } from '@src/lib/bounded-contexts/iam/authentication/commands/password-login.command';

@ApiTags('Auth - 认证模块')
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('login')
  async login(@Body() dto: PasswordLoginDTO) {
    const result = await this.commandBus.execute(
      new PasswordLoginCommand(dto.identifier, dto.password),
    );
    return result;
  }
}
