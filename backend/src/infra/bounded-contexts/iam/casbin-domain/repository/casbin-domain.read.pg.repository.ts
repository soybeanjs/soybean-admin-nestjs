import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { CasbinDomainReadRepoPort } from '@src/lib/bounded-contexts/iam/casbin-domain/ports/casbin-domain.read.repo-port';
import { PageCasbinDomainsQuery } from '@src/lib/bounded-contexts/iam/casbin-domain/queries/page-casbin-domains.query';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { CasbinDomainProperties } from '@src/lib/bounded-contexts/iam/casbin-domain/domain/casbin-domain.read-model';
import { Prisma } from '@prisma/client';

@Injectable()
export class CasbinDomainReadRepository implements CasbinDomainReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async pageCasbinDomains(
    query: PageCasbinDomainsQuery,
  ): Promise<PaginationResult<CasbinDomainProperties>> {
    const where: Prisma.SysDomainWhereInput = {};

    if (query.name) {
      where.name = {
        contains: query.name,
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    const domains = await this.prisma.sysDomain.findMany({
      where: where,
      skip: (query.current - 1) * query.size,
      take: query.size,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });

    const total = await this.prisma.sysDomain.count({ where: where });

    return new PaginationResult<CasbinDomainProperties>(
      query.current,
      query.size,
      total,
      domains,
    );
  }

  async getDomainById(code: string): Promise<CasbinDomainProperties | null> {
    return this.prisma.sysDomain.findUnique({
      where: { code },
    });
  }
}
