import { Injectable } from '@nestjs/common';

import { Role } from '@src/lib/bounded-contexts/iam/role/domain/role.model';
import { RoleWriteRepoPort } from '@src/lib/bounded-contexts/iam/role/ports/role.write.repo-port';
import { PrismaService } from '@src/shared/prisma/prisma.service';

@Injectable()
export class RoleWritePostgresRepository implements RoleWriteRepoPort {
  constructor(private prisma: PrismaService) {}

  async save(role: Role): Promise<void> {
    await this.prisma.sysRole.create({
      data: { ...role },
    });
  }
}
