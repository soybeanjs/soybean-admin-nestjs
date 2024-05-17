import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { OperationLogReadRepoPort } from '@src/lib/bounded-contexts/log-audit/operation-log/ports/operation-log.read.repo-port';

@Injectable()
export class OperationLogReadRepository implements OperationLogReadRepoPort {
  constructor(private prisma: PrismaService) {}
}
