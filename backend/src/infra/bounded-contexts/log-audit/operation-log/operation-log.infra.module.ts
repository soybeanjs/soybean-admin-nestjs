import { Module } from '@nestjs/common';
import { OperationLogWriteRepository } from './repository/operation-log.write.pg.repository';
import { OperationLogReadRepository } from './repository/operation-log.read.pg.repository';
import { OperationLogModule } from '@src/lib/bounded-contexts/log-audit/operation-log/operation-log.module';
import {
  OperationLogReadRepoPortToken,
  OperationLogWriteRepoPortToken,
} from '@src/lib/bounded-contexts/log-audit/operation-log/constants';

const providers = [
  {
    provide: OperationLogReadRepoPortToken,
    useClass: OperationLogReadRepository,
  },
  {
    provide: OperationLogWriteRepoPortToken,
    useClass: OperationLogWriteRepository,
  },
];

@Module({
  imports: [
    OperationLogModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [OperationLogModule],
})
export class OperationLogInfraModule {}
