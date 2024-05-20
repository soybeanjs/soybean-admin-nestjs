import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { RoleReadRepoPort } from '@src/lib/bounded-contexts/iam/role/ports/role.read.repo-port';
import { PageRolesQuery } from '@src/lib/bounded-contexts/iam/role/queries/page-roles.query';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { RoleProperties } from '@src/lib/bounded-contexts/iam/role/domain/role.read-model';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleReadPostgresRepository implements RoleReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async findRolesByUserId(userId: string): Promise<Set<string>> {
    const userRoles = await this.prisma.sys_user_role.findMany({
      where: {
        userId: userId,
      },
      select: {
        roleId: true,
      },
    });

    const roleIds = userRoles.map((userRole) => userRole.roleId);

    const roles = await this.prisma.sys_role.findMany({
      where: {
        id: {
          in: roleIds,
        },
      },
      select: {
        code: true,
      },
    });

    const roleCodes = new Set(roles.map((role) => role.code));

    return roleCodes;
  }

  async pageRoles(
    query: PageRolesQuery,
  ): Promise<PaginationResult<RoleProperties>> {
    const where: Prisma.sys_roleWhereInput = {};

    if (query.code) {
      where.code = {
        contains: query.code,
      };
    }

    if (query.name) {
      where.name = {
        contains: query.name,
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    const roles = await this.prisma.sys_role.findMany({
      where: where,
      skip: (query.current - 1) * query.size,
      take: query.size,
    });

    const total = await this.prisma.sys_role.count({ where: where });

    return new PaginationResult<RoleProperties>(
      query.current,
      query.size,
      total,
      roles,
    );
  }
}
