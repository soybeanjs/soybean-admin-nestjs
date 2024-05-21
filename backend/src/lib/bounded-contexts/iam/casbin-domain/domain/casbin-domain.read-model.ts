import { Status } from '@prisma/client';

export type CasbinDomainEssentialProperties = Readonly<
  Required<{
    id: string;
    code: string;
    name: string;
    description: string | null;
    status: Status;
  }> &
    CreationAuditInfo &
    UpdateAuditInfo
>;

export type CasbinDomainProperties = CasbinDomainEssentialProperties;
