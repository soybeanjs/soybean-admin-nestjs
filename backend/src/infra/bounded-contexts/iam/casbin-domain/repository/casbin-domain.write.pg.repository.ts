import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { CasbinDomainWriteRepoPort } from '@src/lib/bounded-contexts/iam/casbin-domain/ports/casbin-domain.write.repo-port';

@Injectable()
export class CasbinDomainWriteRepository implements CasbinDomainWriteRepoPort {
  constructor(private prisma: PrismaService) {}
}
