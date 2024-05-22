import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordLoginDto {
  @ApiProperty({ description: '账户/邮箱/手机号' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly identifier: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
