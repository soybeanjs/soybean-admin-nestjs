import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RoleCreateDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'code must be a string' })
  @IsNotEmpty({ message: 'code cannot be empty' })
  code: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name cannot be empty' })
  name: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'pid must be a string' })
  @IsNotEmpty({ message: 'pid cannot be empty' })
  pid: string;

  @ApiProperty({ required: true })
  description: string | null;
}
