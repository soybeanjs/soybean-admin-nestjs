import { AuthActionVerb, CustomAuthActionVerb } from '../casbin';

export interface Permission {
  resource: string;
  action: AuthActionVerb | CustomAuthActionVerb;
}
