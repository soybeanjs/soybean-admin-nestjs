import { Status } from '@prisma/client';

export type UserEssentialProperties = Readonly<
  Required<{
    id: string;
    username: string;
    status: Status;
    domain: string;
    email: string | null;
    phoneNumber: string | null;
    nikeName: string;
  }> &
    CreationAuditInfo &
    UpdateAuditInfo
>;

export type UserOptionalProperties = Readonly<
  Partial<{
    password: string;
  }>
>;

export type UserProperties = UserEssentialProperties &
  Required<UserOptionalProperties>;
