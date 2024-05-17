import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { RoleReadRepoPort } from '@src/lib/bounded-contexts/iam/role/ports/role.read.repo-port';

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
}
