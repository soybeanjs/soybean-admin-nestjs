import { Status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateAuditInfo } from '@src/shared/prisma/db.constant';

export type CasbinDomainEssentialProperties = Readonly<
  Required<{
    id: string;
    code: string;
    name: string;
    description: string | null;
    status: Status;
  }> &
    CreationAuditInfoProperties &
    UpdateAuditInfoProperties
>;

export type CasbinDomainProperties = CasbinDomainEssentialProperties;

export class CasbinDomainReadModel extends UpdateAuditInfo {
  @ApiProperty({ description: 'The unique identifier of the casbin domain' })
  id: string;

  @ApiProperty({ description: 'Code of the casbin domain' })
  code: string;

  @ApiProperty({ description: 'Name of the casbin domain' })
  name: string;

  @ApiProperty({
    description: 'Description of the casbin domain',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Current status of the casbin domain',
    enum: Object.values(Status),
  })
  status: Status;
}
