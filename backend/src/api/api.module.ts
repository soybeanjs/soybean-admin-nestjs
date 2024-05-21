import { Module } from '@nestjs/common';
import { Controllers as IamRest } from './iam/rest';
import { Controllers as EndpointRest } from './endpoint/rest';
import { IamModule } from '@src/infra/bounded-contexts/iam/iam/iam.module';
import { RoleInfraModule } from '@src/infra/bounded-contexts/iam/role/role.infra.module';
import { ApiEndpointInfraModule } from '@src/infra/bounded-contexts/api-endpoint/endpoint/api-endpoint.infra.module';
import { OperationLogInfraModule } from '@src/infra/bounded-contexts/log-audit/operation-log/operation-log.infra.module';
import { LoginLogInfraModule } from '@src/infra/bounded-contexts/log-audit/login-log/login-log.infra.module';

@Module({
  imports: [
    IamModule,
    RoleInfraModule,
    ApiEndpointInfraModule,
    OperationLogInfraModule,
    LoginLogInfraModule,
  ],
  controllers: [...IamRest, ...EndpointRest],
})
export class ApiModule {}
