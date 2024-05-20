import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { LoginLogWriteRepoPort } from '@src/lib/bounded-contexts/iam/authentication/ports/login-log-write.repo-port';
import { LoginLogEntity } from '@src/lib/bounded-contexts/iam/authentication/domain/login-log.entity';

@Injectable()
export class LoginLogWriteRepository implements LoginLogWriteRepoPort {
  constructor(private prisma: PrismaService) {}

  async save(loginLog: LoginLogEntity): Promise<void> {
    await this.prisma.sys_login_log.create({
      data: {
        userId: loginLog.userId,
        username: loginLog.username,
        domain: loginLog.domain,
        loginTime: new Date(),
        ip: loginLog.ip,
        port: loginLog.port,
        address: loginLog.address,
        userAgent: loginLog.userAgent,
        requestId: loginLog.requestId,
        type: loginLog.type,
        createdAt: new Date(),
        createdBy: loginLog.userId,
      },
    });
  }
}
