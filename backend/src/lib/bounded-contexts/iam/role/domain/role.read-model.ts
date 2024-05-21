import { Status } from '@prisma/client';

export type RoleEssentialProperties = Readonly<
  Required<{
    id: string;
    code: string;
    name: string;
    pid: string;
    status: Status;
  }> &
    CreationAuditInfo
>;

export type RoleOptionalProperties = Readonly<
  Partial<{
    description: string | null;
  }>
>;

export type RoleProperties = RoleEssentialProperties &
  Required<RoleOptionalProperties>;
