import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CasbinService } from '@src/infra/casbin/casbin.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@src/infra/decorators/public.decorator';

@Injectable()
export class CasbinGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private casbinService: CasbinService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: IAuthentication = request.user;
    const { originalUrl: obj, method: act } = request;

    const enforcer = await this.casbinService.getEnforcer();
    return enforcer.enforce(user.uid, obj, act);
  }
}
