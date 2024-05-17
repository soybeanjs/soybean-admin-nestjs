import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { EndpointReadRepoPort } from '@src/lib/bounded-contexts/api-endpoint/endpoint/ports/endpoint-read.repo-port';

@Injectable()
export class EndpointReadRepository implements EndpointReadRepoPort {
  constructor(private prisma: PrismaService) {}
}
