import { Status } from '@prisma/client';

export type UserEssentialProperties = Readonly<
  Required<{
    id: string;
    username: string;
    domain: string;
    nikeName: string;
    status: Status;
  }> &
    CreationAuditInfo &
    UpdateAuditInfo
>;

export type UserOptionalProperties = Readonly<
  Partial<{
    password: string;
    avatar: string | null;
    email: string | null;
    phoneNumber: string | null;
  }>
>;

export type UserProperties = UserEssentialProperties &
  Required<UserOptionalProperties>;
