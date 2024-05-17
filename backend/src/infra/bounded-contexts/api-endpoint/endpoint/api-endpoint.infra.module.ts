import { Module } from '@nestjs/common';
import { ApiEndpointWriteRepository } from './repository/api-endpoint.write.pg.repository';
import { ApiEndpointReadRepository } from './repository/api-endpoint.read.pg.repository';
import {
  ApiEndpointReadRepoPortToken,
  ApiEndpointWriteRepoPortToken,
} from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/constants';
import { ApiEndpointModule } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/api-endpoint.module';

const providers = [
  {
    provide: ApiEndpointReadRepoPortToken,
    useClass: ApiEndpointReadRepository,
  },
  {
    provide: ApiEndpointWriteRepoPortToken,
    useClass: ApiEndpointWriteRepository,
  },
];

@Module({
  imports: [
    ApiEndpointModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [ApiEndpointModule],
})
export class ApiEndpointInfraModule {}
