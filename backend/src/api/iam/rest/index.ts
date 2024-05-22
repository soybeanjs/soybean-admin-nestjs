import { AuthenticationController } from './authentication.controller';
import { AuthorizationController } from './authorization.controller';
import { UserController } from './user.controller';
import { RoleController } from './role.controller';
import { CasbinDomainController } from './casbin-domain.controller';

export const Controllers = [
  AuthenticationController,
  AuthorizationController,
  UserController,
  RoleController,
  CasbinDomainController,
];
