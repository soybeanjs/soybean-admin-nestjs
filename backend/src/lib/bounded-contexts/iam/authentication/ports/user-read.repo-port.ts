import { UserProperties } from '../domain/user.read-model';

export interface UserReadRepoPort {
  findUserByIdentifier(identifier: string): Promise<UserProperties | null>;
}
