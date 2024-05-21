import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { LoginLogReadRepoPort } from '@src/lib/bounded-contexts/log-audit/login-log/ports/login-log.read.repo-port';
import { PageLoginLogsQuery } from '@src/lib/bounded-contexts/log-audit/login-log/queries/page-login-logs.query';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { LoginLogProperties } from '@src/lib/bounded-contexts/log-audit/login-log/domain/login-log.read-model';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoginLogReadRepository implements LoginLogReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async pageLoginLogs(
    query: PageLoginLogsQuery,
  ): Promise<PaginationResult<LoginLogProperties>> {
    const where: Prisma.sys_login_logWhereInput = {};

    if (query.username) {
      where.username = {
        contains: query.username,
      };
    }

    if (query.domain) {
      where.domain = query.domain;
    }

    if (query.address) {
      where.address = {
        contains: query.address,
      };
    }

    if (query.type) {
      where.type = query.type;
    }

    const loginLogs = await this.prisma.sys_login_log.findMany({
      where: where,
      skip: (query.current - 1) * query.size,
      take: query.size,
      orderBy: [
        {
          loginTime: 'desc',
        },
      ],
    });

    const total = await this.prisma.sys_login_log.count({ where: where });

    return new PaginationResult<LoginLogProperties>(
      query.current,
      query.size,
      total,
      loginLogs,
    );
  }
}