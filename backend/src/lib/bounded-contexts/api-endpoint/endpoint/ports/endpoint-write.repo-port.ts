import { SysEndpoint } from '../../endpoint/domain/endpoint.model';

export interface EndpointWriteRepoPort {
  save(endpoints: SysEndpoint[]): Promise<void>;
}
