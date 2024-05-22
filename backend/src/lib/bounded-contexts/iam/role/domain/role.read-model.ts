import { Status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export type RoleEssentialProperties = Readonly<
  Required<{
    id: string;
    code: string;
    name: string;
    pid: string;
    status: Status;
  }> &
    CreationAuditInfoProperties
>;

export type RoleOptionalProperties = Readonly<
  Partial<{
    description: string | null;
  }>
>;

export type RoleProperties = RoleEssentialProperties &
  Required<RoleOptionalProperties>;

export class RoleReadModel {
  @ApiProperty({ description: 'The unique identifier of the role' })
  id: string;

  @ApiProperty({ description: 'Code of the role' })
  code: string;

  @ApiProperty({ description: 'Name of the role' })
  name: string;

  @ApiProperty({ description: 'Parent ID of the role' })
  pid: string;

  @ApiProperty({
    description: 'Status of the role',
    enum: Object.values(Status),
  })
  status: Status;

  @ApiProperty({
    description: 'Description of the role',
    nullable: true,
    required: false,
  })
  description: string | null;
}
