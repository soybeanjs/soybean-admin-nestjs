import { Module } from '@nestjs/common';
import { AuthController } from '@src/api/auth/rest/authentication.controller';
import { IamModule } from '@src/infra/bounded-contexts/iam/iam/iam.module';
import { RoleInfraModule } from '@src/infra/bounded-contexts/iam/role/role.infra.module';
import { ApiEndpointInfraModule } from '@src/infra/bounded-contexts/api-endpoint/endpoint/api-endpoint.infra.module';
import { OperationLogInfraModule } from '@src/infra/bounded-contexts/log-audit/operation-log/operation-log.infra.module';

@Module({
  imports: [
    IamModule,
    RoleInfraModule,
    ApiEndpointInfraModule,
    OperationLogInfraModule,
  ],
  controllers: [AuthController],
})
export class ApiModule {}
