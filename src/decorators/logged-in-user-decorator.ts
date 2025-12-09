import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoggedInUser } from 'src/models/types/user.types';

export const AuthUser: any = createParamDecorator(
  (data: LoggedInUser, req: ExecutionContext) => {
    return req.switchToHttp().getRequest().user as LoggedInUser;
  },
);
