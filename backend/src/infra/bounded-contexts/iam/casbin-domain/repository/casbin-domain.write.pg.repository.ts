import { Injectable } from '@nestjs/common';

import { CasbinDomainWriteRepoPort } from '@src/lib/bounded-contexts/iam/casbin-domain/ports/casbin-domain.write.repo-port';
import { PrismaService } from '@src/shared/prisma/prisma.service';

@Injectable()
export class CasbinDomainWriteRepository implements CasbinDomainWriteRepoPort {
  constructor(private prisma: PrismaService) {}
}
