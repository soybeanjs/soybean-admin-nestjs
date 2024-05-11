import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserLoggedInEvent } from '../../domain/events/user-logged-in.event';

@EventsHandler(UserLoggedInEvent)
export class UserLoggedInHandler implements IEventHandler<UserLoggedInEvent> {
  constructor() {
    console.log('UserLoggedInHandler initialized');
  }

  async handle(event: UserLoggedInEvent) {
    console.log(`User logged in: ${event.userId}`);
    // 这里可以添加更多逻辑，如更新用户最后登录时间，发送登录通知等
  }
}
