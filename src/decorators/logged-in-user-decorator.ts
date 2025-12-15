/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { activeCompaany, LoggedInUser } from 'src/models/types/user.types';

export const AuthUser: any = createParamDecorator(
  (data: LoggedInUser, req: ExecutionContext) => {
    return req.switchToHttp().getRequest().user as LoggedInUser;
  },
);

export const AuthComapny: any = createParamDecorator(
  (data: activeCompaany, req: ExecutionContext) => {
    return req.switchToHttp().getRequest().company as activeCompaany;
  },
);
