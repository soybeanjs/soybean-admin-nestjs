import { ICommand } from '@nestjs/cqrs';

export class PasswordLoginCommand implements ICommand {
  constructor(
    public readonly identifier: string,
    public readonly password: string,
  ) {}
}
