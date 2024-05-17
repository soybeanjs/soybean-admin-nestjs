import { Inject } from '@nestjs/common';
import { OperationLogWriteRepoPortToken } from '../../constants';
import { OperationLogWriteRepoPort } from '../../ports/operation-log.write.repo-port';
import { OperationLog } from '../../domain/operation-log.model';
import { OnEvent } from '@nestjs/event-emitter';
import { LOG_OPERATION } from '@src/constants/event-emitter-token.constant';
import { OperationLogProperties } from '../../domain/operation-log.read-model';

export class OperationLogEventHandler {
  constructor(
    @Inject(OperationLogWriteRepoPortToken)
    private readonly operationLogWriteRepo: OperationLogWriteRepoPort,
  ) {}

  @OnEvent(LOG_OPERATION)
  async handle(operationLogProperties: OperationLogProperties) {
    const operationLog = new OperationLog(operationLogProperties);
    return await this.operationLogWriteRepo.save(operationLog);
  }
}
