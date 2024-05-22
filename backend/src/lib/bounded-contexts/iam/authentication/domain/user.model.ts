import { AggregateRoot } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import { Password } from './password.value-object';
import { UserProperties } from './user.read-model';

export interface IUser {
  verifyPassword(password: string): Promise<boolean>;
  canLogin(): Promise<boolean>;
  loginUser(password: string): Promise<{ success: boolean; message: string }>;
  commit(): void;
}

export class UserModel extends AggregateRoot implements IUser {
  private readonly id: string;
  private username: string;
  private password: Password;
  private status: Status;
  private domain: string;

  constructor(properties: UserProperties) {
    super();
    Object.assign(this, properties);
    this.password = Password.fromHashed(properties.password);
  }

  async verifyPassword(password: string): Promise<boolean> {
    return this.password.compare(password);
  }

  async canLogin(): Promise<boolean> {
    return this.status === Status.ENABLED;
  }

  async loginUser(
    password: string,
  ): Promise<{ success: boolean; message: string }> {
    if (this.status !== Status.ENABLED) {
      return {
        success: false,
        message: `User is ${this.status.toLowerCase()}.`,
      };
    }

    const isPasswordValid = await this.verifyPassword(password);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid credentials.' };
    }

    return { success: true, message: 'Login successful' };
  }
}
