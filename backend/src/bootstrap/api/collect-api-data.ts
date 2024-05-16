import {
  Injectable,
  Logger,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { ModulesContainer, Reflector } from '@nestjs/core';
import { Module } from '@nestjs/core/injector/module';
import { PERMISSIONS_METADATA } from '@src/infra/casbin';
import {
  FUNCTION,
  METHOD,
  PATH,
  SWAGGER_API_OPERATION,
} from '@src/constants/rest.constant';

@Injectable()
export class ApiDataService implements OnModuleInit {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly reflector: Reflector,
  ) {}

  private readonly logger = new Logger(ApiDataService.name);

  onModuleInit() {
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

            const permissions = this.reflector.get(
              PERMISSIONS_METADATA,
              instance[method],
            );
            const apiOperation = this.reflector.get(
              SWAGGER_API_OPERATION,
              instance[method],
            );

            const methodMetadataKeys = Reflect.getMetadataKeys(
              instance[method],
            );
            this.logger.log(`methodMetadataKeys is ${methodMetadataKeys}`);

            const fullPath =
              controllerPath + (methodPath ? '/' + methodPath : '');
            const cleanedPath = fullPath
              .replace(/\/+/g, '/')
              .replace(/\/$/, '');

            const messages = [
              `Controller: ${controllerName}`,
              `Path: ${cleanedPath}`,
              `Method: ${RequestMethod[methodType] || 'UNKNOWN'}`,
              `Permissions: ${permissions ? JSON.stringify(permissions) : 'none'}`,
              `ApiOperation: ${apiOperation ? JSON.stringify(apiOperation) : 'none'}`,
            ];

            this.logger.log(messages.join(', '));
          });
      });
    });
  }
}
