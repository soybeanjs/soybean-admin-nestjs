import { Module } from '@nestjs/common';
import { AuthController } from '@src/api/auth/rest/authentication.controller';
import { IamModule } from '@src/infra/bounded-contexts/iam/iam/iam.module';
import { RoleInfraModule } from '@src/infra/bounded-contexts/iam/role/role.infra-module';
import { ApiEndpointModule } from '@src/infra/bounded-contexts/api-endpoint/endpoint/api-endpoint.module';

@Module({
  imports: [IamModule, RoleInfraModule, ApiEndpointModule],
  controllers: [AuthController],
})
export class ApiModule {}
