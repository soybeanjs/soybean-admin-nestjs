import { DynamicModule, Module, Provider } from '@nestjs/common';
import { QueryHandlers } from './application/query-handlers';

@Module({})
export class CasbinDomainModule {
  static register(options: {
    inject: Provider[];
    imports: any[];
  }): DynamicModule {
    return {
      module: CasbinDomainModule,
      imports: [...options.imports],
      providers: [...QueryHandlers, ...options.inject],
      exports: [...QueryHandlers],
    };
  }
}
