import { DynamicModule, Module, Provider } from '@nestjs/common';
import { QueryHandlers } from './application/query-handlers';
import { EventHandlers } from './application/event-handlers';

@Module({})
export class RoleModule {
  static register(options: {
    inject: Provider[];
    imports: any[];
  }): DynamicModule {
    return {
      module: RoleModule,
      imports: [...options.imports],
      providers: [...QueryHandlers, ...EventHandlers, ...options.inject],
      exports: [...QueryHandlers],
    };
  }
}
