import { AggregateRoot } from '@nestjs/cqrs';
import { Status } from '@prisma/client';
import { UserLoggedInEvent } from './events/user-logged-in.event';
import { UserProperties } from './user.read-model';

export interface IUser {
  verifyPassword(password: string): boolean;
  canLogin(): boolean;
  loginUser(password: string): { success: boolean; message: string };
  commit(): void;
}

export class UserModel extends AggregateRoot implements IUser {
  private readonly id: string;
  private username: string;
  private password: string;
  private status: Status;

  constructor(properties: UserProperties) {
    super();
    Object.assign(this, properties);
  }

  verifyPassword(password: string): boolean {
    // Suppose some hashing function is used
    return this.password === password;
  }

  canLogin(): boolean {
    return this.status === Status.ENABLED;
  }

  loginUser(password: string): { success: boolean; message: string } {
    if (this.status !== Status.ENABLED) {
      return {
        success: false,
        message: `User is ${this.status.toLowerCase()}.`,
      };
    }

    if (!this.verifyPassword(password)) {
      return { success: false, message: 'Invalid credentials.' };
    }

    this.apply(new UserLoggedInEvent(this.id));
    return { success: true, message: 'Login successful' };
  }
}
