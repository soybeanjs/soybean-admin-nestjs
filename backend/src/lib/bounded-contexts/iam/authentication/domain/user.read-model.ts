import { Status } from '@prisma/client';

export type UserEssentialProperties = Readonly<
  Required<{
    id: string;
    username: string;
    status: Status;
    domain: string;
  }>
>;

export type UserOptionalProperties = Readonly<
  Partial<{
    password: string;
  }>
>;

export type UserProperties = UserEssentialProperties &
  Required<UserOptionalProperties>;
