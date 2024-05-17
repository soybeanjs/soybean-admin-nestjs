import { OperationLog } from '../../operation-log/domain/operation-log.model';

export interface OperationLogWriteRepoPort {
  save(operationLog: OperationLog): Promise<void>;
}
