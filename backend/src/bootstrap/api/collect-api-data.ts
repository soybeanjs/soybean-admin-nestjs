import * as crypto from 'crypto';

import {
  Injectable,
  Logger,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { ModulesContainer, Reflector } from '@nestjs/core';
import { Module } from '@nestjs/core/injector/module';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { API_ENDPOINT } from '@src/constants/event-emitter-token.constant';
import {
  FUNCTION,
  METHOD,
  PATH,
  SWAGGER_API_OPERATION,
} from '@src/constants/rest.constant';
import { Permission, PERMISSIONS_METADATA } from '@src/infra/casbin';
import { ApiEndpoint } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/domain/api-endpoint.model';
import { isMainCluster } from '@src/utils/env';

@Injectable()
export class ApiDataService implements OnModuleInit {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly reflector: Reflector,
    private eventEmitter: EventEmitter2,
  ) {}

  private readonly logger = new Logger(ApiDataService.name);

  onModuleInit() {
    if (isMainCluster) {
      const endpoints: ApiEndpoint[] = [];
      this.modulesContainer.forEach((module: Module) => {
        const controllers = Array.from(module.controllers.values());
        controllers.forEach((controller) => {
          const instance: Record<string, any> = controller.instance;
          if (!instance) return;

          const prototype = Object.getPrototypeOf(instance);
          const controllerName = controller.metatype.name;
          const controllerPath =
            Reflect.getMetadata(PATH, controller.metatype) || '';

          Object.getOwnPropertyNames(prototype)
            .filter((method) => typeof instance[method] === FUNCTION)
            .forEach((method) => {
              const methodPath =
                Reflect.getMetadata(PATH, instance[method]) || '';
              const methodType = Reflect.getMetadata(METHOD, instance[method]);
              if (methodType === undefined) return;

              const permissions: Permission[] = this.reflector.get(
                PERMISSIONS_METADATA,
                instance[method],
              ) || [{ action: '', resource: '' }];
              const fullPath =
                controllerPath + (methodPath ? '/' + methodPath : '');
              const cleanedPath = fullPath
                .replace(/\/+/g, '/')
                .replace(/\/$/, '');
              const summary =
                Reflect.getMetadata(SWAGGER_API_OPERATION, instance[method])
                  ?.summary || '';

              permissions.forEach((permission) => {
                const action = permission.action;
                const resource = permission.resource;
                const id = crypto
                  .createHash('md5')
                  .update(
                    JSON.stringify({
                      action,
                      resource,
                      path: cleanedPath,
                      method: RequestMethod[methodType],
                    }),
                  )
                  .digest('hex');

                endpoints.push(
                  new ApiEndpoint(
                    id,
                    cleanedPath,
                    RequestMethod[methodType],
                    action,
                    resource,
                    controllerName,
                    summary,
                  ),
                );
              });
            });
        });
      });

      setImmediate(() => {
        this.eventEmitter.emit(API_ENDPOINT, endpoints);
      });
    }
  }
}
