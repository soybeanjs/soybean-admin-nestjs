import { Module } from '@nestjs/common';
import { EndpointWriteRepository } from './repository/endpoint-write.pg.repository';
import { EndpointReadRepository } from './repository/endpoint-read.pg.repository';
import {
  EndpointReadRepoPortToken,
  EndpointWriteRepoPortToken,
} from '@src/lib/bounded-contexts/api-endpoint/endpoint/constants';
import { EndpointModule } from '@src/lib/bounded-contexts/api-endpoint/endpoint/endpoint.module';

const providers = [
  { provide: EndpointReadRepoPortToken, useClass: EndpointReadRepository },
  { provide: EndpointWriteRepoPortToken, useClass: EndpointWriteRepository },
];

@Module({
  imports: [
    EndpointModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [EndpointModule],
})
export class ApiEndpointModule {}
