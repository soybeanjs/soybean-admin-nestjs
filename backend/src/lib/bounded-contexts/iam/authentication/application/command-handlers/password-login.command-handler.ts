import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { PasswordLoginCommand } from '../../commands/password-login.command';
import { UserReadRepoPort } from '../../ports/user-read.repo-port';
import { UserReadRepoPortToken } from '../../constants';
import { UserModel } from '../../domain/user.model';

@CommandHandler(PasswordLoginCommand)
export class PasswordLoginHandler
  implements ICommandHandler<PasswordLoginCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(UserReadRepoPortToken)
    private readonly repository: UserReadRepoPort,
  ) {}

  async execute(command: PasswordLoginCommand): Promise<any> {
    const { identifier, password } = command;
    const user = await this.repository.findUserByIdentifier(identifier);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const userAggregate = new UserModel(user);
    const loginResult = userAggregate.loginUser(password);

    if (!loginResult.success) {
      throw new UnauthorizedException(loginResult.message);
    }

    this.publisher.mergeObjectContext(userAggregate);
    userAggregate.commit();
  }
}
