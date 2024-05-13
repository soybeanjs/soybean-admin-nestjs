import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {CasbinService} from '@src/infrastructure/casbin/casbin.service';

@Injectable()
export class CasbinGuard implements CanActivate {
    constructor(private casbinService: CasbinService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user: IAuthentication = request.user;
        const {originalUrl: obj, method: act} = request;

        const enforcer = await this.casbinService.getEnforcer();
        return enforcer.enforce(user.uid, obj, act);
    }
}
