import { Module } from '@nestjs/common';

import { ApiEndpointInfraModule } from '@src/infra/bounded-contexts/api-endpoint/api-endpoint/api-endpoint.infra.module';
import { IamModule } from '@src/infra/bounded-contexts/iam/authentication/iam.module';
import { CasbinDomainInfraModule } from '@src/infra/bounded-contexts/iam/casbin-domain/casbin-domain.infra.module';
import { RoleInfraModule } from '@src/infra/bounded-contexts/iam/role/role.infra.module';
import { LoginLogInfraModule } from '@src/infra/bounded-contexts/log-audit/login-log/login-log.infra.module';
import { OperationLogInfraModule } from '@src/infra/bounded-contexts/log-audit/operation-log/operation-log.infra.module';

import { Controllers as EndpointRest } from './endpoint/rest';
import { Controllers as IamRest } from './iam/rest';
import { Controllers as LoginLogRest } from './log-audit/login-log/rest';
import { Controllers as OperationLogRest } from './log-audit/operation-log/rest';

@Module({
  imports: [
    IamModule,
    RoleInfraModule,
    CasbinDomainInfraModule,
    ApiEndpointInfraModule,
    OperationLogInfraModule,
    LoginLogInfraModule,
  ],
  controllers: [
    ...IamRest,
    ...EndpointRest,
    ...LoginLogRest,
    ...OperationLogRest,
  ],
})
export class ApiModule {}
