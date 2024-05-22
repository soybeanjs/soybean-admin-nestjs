import { DynamicModule, Module, Provider } from '@nestjs/common';

import { PubSubCommandHandlers } from './application/command-handlers';
import { QueryHandlers } from './application/query-handlers';
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
        ...Services,
        ...QueryHandlers,
        ...options.inject,
      ],
      exports: [...Services, ...QueryHandlers],
    };
  }
}
