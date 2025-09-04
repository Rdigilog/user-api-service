import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { ROUTE_NAME_KEY } from 'libs/decorators/route-name.decorator';

@Injectable()
export class RouteRegisteryService implements OnModuleInit {
  private routes: string[] = [];
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    const controllers = this.discovery.getControllers();

    controllers.forEach((wrapper) => {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) return;

      const controllerPath: string =
        Reflect.getMetadata('path', metatype) || '';

      const prototype = Object.getPrototypeOf(instance);

      this.metadataScanner.scanFromPrototype(
        instance,
        prototype,
        (methodName: string) => {
          const method = prototype[methodName];

          const routeName =
            this.reflector.get<string>(ROUTE_NAME_KEY, method) || null;

          const methodPath = Reflect.getMetadata('path', method) || ''; // path from decorator
          const requestMethod = Reflect.getMetadata('method', method) || 'GET'; // http method

          const finalName =
            routeName || `${requestMethod} ${controllerPath}/${methodPath}`;

          this.routes.push(finalName);
        },
      );
    });

    console.log('Registered Routes:', this.routes);
  }

  getAll() {
    return this.routes;
  }
}
