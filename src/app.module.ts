import { Module } from '@nestjs/common';
import { ConfigsModule } from './configs/configs.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';

@Module({
  imports: [ConfigsModule, AuthModule, UserModule, RoleModule, PermissionModule]
})
export class AppModule {}
