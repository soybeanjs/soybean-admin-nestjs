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
import { AuthPossession } from '../casbin';
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

      const userId = this.options.uidFromContext(context);

      if (!userId) {
        throw new UnauthorizedException();
      }

      const userRoles = await RedisUtility.instance.smembers(
        `${CacheConstant.AUTH_TOKEN_PREFIX}${userId}`,
      );

      const result = await AuthZGuard.asyncEvery<Permission>(
        permissions,
        async (permission) =>
          this.hasPermission(
            new Set(userRoles),
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
    permission: Permission,
    context: ExecutionContext,
    enforcer: casbin.Enforcer,
  ): Promise<boolean> {
    const { possession, resource, action } = permission;
    const poss = [];

    if (possession === AuthPossession.OWN_ANY) {
      poss.push(AuthPossession.ANY, AuthPossession.OWN);
    } else {
      poss.push(possession);
    }

    return AuthZGuard.asyncSome<AuthPossession>(poss, async (p) => {
      if (p === AuthPossession.OWN) {
        return (permission as any).isOwn(context);
      } else {
        return AuthZGuard.asyncSome<string>(Array.from(roles), async (role) => {
          return enforcer.enforce(role, resource, `${action}:${p}`);
        });
      }
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
