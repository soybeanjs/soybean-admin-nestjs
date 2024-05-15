import { Module } from '@nestjs/common';
import { AuthController } from '@src/api/auth/rest/authentication.controller';
import { IamModule } from '@src/infra/bounded-contexts/iam/iam/iam.module';
import { RoleInfraModule } from '@src/infra/bounded-contexts/iam/role/role.infra-module';

@Module({
  imports: [IamModule, RoleInfraModule],
  controllers: [AuthController],
})
export class ApiModule {}
