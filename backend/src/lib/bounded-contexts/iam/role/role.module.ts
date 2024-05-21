import { DynamicModule, Module, Provider } from '@nestjs/common';
import { QueryHandlers } from './application/query-handlers';
import { EventHandlers } from './application/event-handlers';
import { PubSubCommandHandlers } from './application/command-handlers';

@Module({})
export class RoleModule {
  static register(options: {
    inject: Provider[];
    imports: any[];
  }): DynamicModule {
    return {
      module: RoleModule,
      imports: [...options.imports],
      providers: [
        ...QueryHandlers,
        ...EventHandlers,
        ...PubSubCommandHandlers,
        ...options.inject,
      ],
      exports: [...QueryHandlers],
    };
  }
}
