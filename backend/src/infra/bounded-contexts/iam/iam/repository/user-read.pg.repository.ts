import { Injectable } from '@nestjs/common';
import { UserReadRepoPort } from '@src/lib/bounded-contexts/iam/authentication/ports/user-read.repo-port';
import { UserProperties } from '@src/lib/bounded-contexts/iam/authentication/domain/user.read-model';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { PageUsersQuery } from '@src/lib/bounded-contexts/iam/authentication/queries/page-users.query';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserReadPostgresRepository implements UserReadRepoPort {
  constructor(private prisma: PrismaService) {}

  private readonly USER_ESSENTIAL_FIELDS = {
    id: true,
    username: true,
    domain: true,
    avatar: true,
    email: true,
    phoneNumber: true,
    nikeName: true,
    status: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
    password: false,
  };

  async findUserByIdentifier(
    identifier: string,
  ): Promise<UserProperties | null> {
    return this.prisma.sysUser.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
          { phoneNumber: identifier },
        ],
      },
    });
  }

  async pageUsers(
    query: PageUsersQuery,
  ): Promise<PaginationResult<UserProperties>> {
    const where: Prisma.SysUserWhereInput = {};

    if (query.username) {
      where.username = {
        contains: query.username,
      };
    }

    if (query.nikeName) {
      where.nikeName = {
        contains: query.nikeName,
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    const users = await this.prisma.sysUser.findMany({
      where: where,
      skip: (query.current - 1) * query.size,
      take: query.size,
      select: this.USER_ESSENTIAL_FIELDS,
    });

    const total = await this.prisma.sysUser.count({ where: where });

    return new PaginationResult<UserProperties>(
      query.current,
      query.size,
      total,
      users,
    );
  }
}
