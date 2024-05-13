import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PubSubCommandHandlers } from './application/command-handlers';
import { EventHandlers } from './application/event-handlers';
import { Services } from './application/service';

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
        ...options.inject,
      ],
      exports: [...Services],
    };
  }
}
