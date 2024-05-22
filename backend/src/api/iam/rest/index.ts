import { AuthenticationController } from './authentication.controller';
import { AuthorizationController } from './authorization.controller';
import { CasbinDomainController } from './casbin-domain.controller';
import { RoleController } from './role.controller';
import { UserController } from './user.controller';

export const Controllers = [
  AuthenticationController,
  AuthorizationController,
  UserController,
  RoleController,
  CasbinDomainController,
];
