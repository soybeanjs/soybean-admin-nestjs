import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { ApiEndpointWriteRepoPort } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/ports/api-endpoint.write.repo-port';
import { ApiEndpoint } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/domain/api-endpoint.model';

@Injectable()
export class ApiEndpointWriteRepository implements ApiEndpointWriteRepoPort {
  constructor(private prisma: PrismaService) {}

  async save(endpoints: ApiEndpoint[]): Promise<void> {
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
