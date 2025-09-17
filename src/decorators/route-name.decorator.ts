// route-name.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const ROUTE_NAME_KEY = 'routeName';
export const RouteName = (name: string) => SetMetadata(ROUTE_NAME_KEY, name);
