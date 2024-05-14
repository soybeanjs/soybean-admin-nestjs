import { ExecutionContext } from '@nestjs/common';
import {
  AuthActionVerb,
  AuthPossession,
  CustomAuthActionVerb,
} from '../casbin';

export interface Permission {
  resource: string;
  action: AuthActionVerb | CustomAuthActionVerb;
  possession: AuthPossession;
  isOwn?: (ctx: ExecutionContext) => boolean;
}
