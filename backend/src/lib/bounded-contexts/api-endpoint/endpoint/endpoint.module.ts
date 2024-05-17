import { DynamicModule, Module, Provider } from '@nestjs/common';
import { EventHandlers } from './application/event-handlers';

@Module({})
export class EndpointModule {
  static register(options: {
    inject: Provider[];
    imports: any[];
  }): DynamicModule {
    return {
      module: EndpointModule,
      imports: [...options.imports],
      providers: [...EventHandlers, ...options.inject],
      exports: [],
    };
  }
}
