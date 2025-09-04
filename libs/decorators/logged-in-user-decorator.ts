import { LoggedInUser } from '@app/model/types/user.types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: LoggedInUser, req: ExecutionContext) => {
    return req.switchToHttp().getRequest().user as LoggedInUser;
  },
);
