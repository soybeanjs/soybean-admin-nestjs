import { AuthController } from './authentication.controller';
import { UserController } from './user.controller';
import { RoleController } from './role.controller';
import { CasbinDomainController } from './casbin-domain.controller';

export const Controllers = [
  AuthController,
  UserController,
  RoleController,
  CasbinDomainController,
];
