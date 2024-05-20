import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PubSubCommandHandlers } from './application/command-handlers';
import { EventHandlers } from './application/event-handlers';
import { Services } from './application/service';
import { QueryHandlers } from './application/query-handlers';

@Module({})
export class AuthenticationModule {
  static register(options: {
    inject: Provider[];
    imports: any[];
  }): DynamicModule {
    return {
      module: AuthenticationModule,
      imports: [...options.imports],
      providers: [
        ...PubSubCommandHandlers,
        ...EventHandlers,
        ...Services,
        ...QueryHandlers,
        ...options.inject,
      ],
      exports: [...Services, ...QueryHandlers],
    };
  }
}
