import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AUTHZ_ENFORCER,
  PERMISSIONS_METADATA,
  AUTHZ_MODULE_OPTIONS,
} from '../constants/authz.constants';
import * as casbin from 'casbin';
import { Permission, AuthZModuleOptions } from '../interfaces';
import { UnauthorizedException } from '@nestjs/common';
import { RedisUtility } from '@src/shared/redis/services/redis.util';
import { CacheConstant } from '@src/constants/cache.constant';

@Injectable()
export class AuthZGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AUTHZ_ENFORCER) private enforcer: casbin.Enforcer,
    @Inject(AUTHZ_MODULE_OPTIONS) private options: AuthZModuleOptions,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const permissions: Permission[] = this.reflector.get<Permission[]>(
        PERMISSIONS_METADATA,
        context.getHandler(),
      );

      if (!permissions) {
        return true;
      }

      const user = this.options.userFromContext(context);

      if (!user) {
        throw new UnauthorizedException();
      }

      await this.enforcer.loadPolicy();
      const userRoles = await RedisUtility.instance.smembers(
        `${CacheConstant.AUTH_TOKEN_PREFIX}${user.uid}`,
      );

      if (userRoles && userRoles.length <= 0) {
        return false;
      }

      const result = await AuthZGuard.asyncEvery<Permission>(
        permissions,
        async (permission) =>
          this.hasPermission(
            new Set(userRoles),
            user.domain,
            permission,
            context,
            this.enforcer,
          ),
      );

      return result;
    } catch (e) {
      throw e;
    }
  }

  async hasPermission(
    roles: Set<string>,
    domain: string,
    permission: Permission,
    context: ExecutionContext,
    enforcer: casbin.Enforcer,
  ): Promise<boolean> {
    const { resource, action } = permission;

    return AuthZGuard.asyncSome<string>(Array.from(roles), async (role) => {
      return enforcer.enforce(role, resource, action, domain);
    });
  }

  static async asyncSome<T>(
    array: T[],
    callback: (value: T, index: number, a: T[]) => Promise<boolean>,
  ): Promise<boolean> {
    for (let i = 0; i < array.length; i++) {
      const result = await callback(array[i], i, array);
      if (result) {
        return result;
      }
    }

    return false;
  }

  static async asyncEvery<T>(
    array: T[],
    callback: (value: T, index: number, a: T[]) => Promise<boolean>,
  ): Promise<boolean> {
    for (let i = 0; i < array.length; i++) {
      const result = await callback(array[i], i, array);
      if (!result) {
        return result;
      }
    }

    return true;
  }
}
