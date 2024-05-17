import { Inject } from '@nestjs/common';
import { EndpointWriteRepoPortToken } from '../../constants';
import { EndpointWriteRepoPort } from '../../ports/endpoint-write.repo-port';
import { SysEndpoint } from '../../domain/endpoint.model';
import { OnEvent } from '@nestjs/event-emitter';
import { API_ENDPOINT } from '@src/constants/event-emitter-token.constant';

export class ApiEndpointEventHandler {
  constructor(
    @Inject(EndpointWriteRepoPortToken)
    private readonly endpointWriteRepo: EndpointWriteRepoPort,
  ) {}

  @OnEvent(API_ENDPOINT)
  async handle(payload: SysEndpoint[]) {
    return await this.endpointWriteRepo.save(payload);
  }
}
