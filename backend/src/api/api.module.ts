import { Module } from '@nestjs/common';
import { AuthController } from '@src/api/auth/rest/authentication.controller';
import { IamModule } from '@src/infra/bounded-contexts/iam/iam/iam.module';

@Module({
  imports: [IamModule],
  controllers: [AuthController],
})
export class ApiModule {}
