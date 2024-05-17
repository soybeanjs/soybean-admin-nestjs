import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { EndpointWriteRepoPort } from '@src/lib/bounded-contexts/api-endpoint/endpoint/ports/endpoint-write.repo-port';
import { SysEndpoint } from '@src/lib/bounded-contexts/api-endpoint/endpoint/domain/endpoint.model';

@Injectable()
export class EndpointWriteRepository implements EndpointWriteRepoPort {
  constructor(private prisma: PrismaService) {}

  async save(endpoints: SysEndpoint[]): Promise<void> {
    const existingEndpoints = await this.prisma.sys_endpoint.findMany();
    const existingIds = existingEndpoints.map((ep) => ep.id);
    const newIds = endpoints.map((ep) => ep.id);
    const idsToDelete = existingIds.filter((id) => !newIds.includes(id));

    const upsertPromises = endpoints.map((endpoint) => {
      return this.prisma.sys_endpoint.upsert({
        where: { id: endpoint.id },
        update: {
          path: endpoint.path,
          method: endpoint.method,
          action: endpoint.action,
          resource: endpoint.resource,
          controller: endpoint.controller,
          summary: endpoint.summary,
        },
        create: endpoint,
      });
    });

    const deletePromise = this.prisma.sys_endpoint.deleteMany({
      where: {
        id: { in: idsToDelete },
      },
    });

    await this.prisma.$transaction([...upsertPromises, deletePromise]);
  }
}
