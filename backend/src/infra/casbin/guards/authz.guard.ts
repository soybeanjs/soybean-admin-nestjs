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

      const username = this.options.usernameFromContext(context);

      if (!username) {
        throw new UnauthorizedException();
      }

      await this.enforcer.loadPolicy();
      const roles = await this.enforcer.getAllRoles();
      console.log('[log]', roles);
      const actions = await this.enforcer.getAllActions();
      console.log('[log]', actions);
      const objects = await this.enforcer.getAllObjects();
      console.log('[log]', objects);
      const subjects = await this.enforcer.getAllSubjects();
      console.log('[log]', subjects);
      const groupingPolicy = await this.enforcer.getGroupingPolicy();
      console.log('[log]', groupingPolicy);

      const policy = await this.enforcer.getPolicy();
      console.log('[log]', policy);
      const r = await this.enforcer.enforce(
        '1571339199@qq.com',
        'users_list',
        'read:any',
      );
      console.log('[log]', r);
      const r2 = await this.enforcer.enforce(
        'role:admin',
        'users_list',
        'read:any',
      );
      console.log('[log]', r2);

      const user = '1571339199@qq.com'; // 实际的用户ID
      const role = 'role:admin'; // 角色名称，具有明确的前缀
      const resource = 'users_list';
      const action = 'read:any';

      // 检查用户权限
      const userHasPermission = await this.enforcer.enforce(
        user,
        resource,
        action,
      );
      console.log('User has permission:', userHasPermission);

      // 尝试检查角色权限（应该失败）
      const roleHasPermission = await this.enforcer.enforce(
        role,
        resource,
        action,
      );
      console.log('Role has permission:', roleHasPermission);

      const hasPermission = async (
        user: string,
        permission: Permission,
      ): Promise<boolean> => {
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
            console.log('[log]', 'enforce');
            console.log('[log]', user, resource, `${action}:${p}`);
            return this.enforcer.enforce(user, resource, `${action}:${p}`);
          }
        });
      };

      const result = await AuthZGuard.asyncEvery<Permission>(
        permissions,
        async (permission) => hasPermission(username, permission),
      );

      return result;
    } catch (e) {
      throw e;
    }
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
