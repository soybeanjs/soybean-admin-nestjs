import {
  UserEssentialProperties,
  UserProperties,
} from '../domain/user.read-model';
import { PageUsersQuery } from '../queries/page-users.query';
import { PaginationResult } from '@src/shared/prisma/pagination';

export interface UserReadRepoPort {
  findUserByIdentifier(identifier: string): Promise<UserProperties | null>;

  pageUsers(
    query: PageUsersQuery,
  ): Promise<PaginationResult<UserEssentialProperties>>;
}
