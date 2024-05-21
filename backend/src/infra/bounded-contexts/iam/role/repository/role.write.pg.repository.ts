import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { RoleWriteRepoPort } from '@src/lib/bounded-contexts/iam/role/ports/role.write.repo-port';
import { Role } from '@src/lib/bounded-contexts/iam/role/domain/role.model';

@Injectable()
export class RoleWritePostgresRepository implements RoleWriteRepoPort {
  constructor(private prisma: PrismaService) {}

  async save(role: Role): Promise<void> {
    await this.prisma.sysRole.create({
      data: { ...role },
    });
  }
}
