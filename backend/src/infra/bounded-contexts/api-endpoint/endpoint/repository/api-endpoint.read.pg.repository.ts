import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { ApiEndpointReadRepoPort } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/ports/api-endpoint.read.repo-port';

@Injectable()
export class ApiEndpointReadRepository implements ApiEndpointReadRepoPort {
  constructor(private prisma: PrismaService) {}
}
