import { Injectable } from '@nestjs/common';
import { UserReadRepoPort } from '@src/lib/bounded-contexts/iam/authentication/ports/user-read.repo-port';
import { UserProperties } from '@src/lib/bounded-contexts/iam/authentication/domain/user.read-model';
import { PrismaService } from '@src/shared/prisma/prisma.service';

@Injectable()
export class UserReadPostgresRepository implements UserReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async findUserByIdentifier(
    identifier: string,
  ): Promise<UserProperties | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
          { phone_number: identifier },
        ],
      },
    });
  }
}
