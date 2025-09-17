import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class StatusInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const request = context.switchToHttp().getRequest();
    // const { path, method, user, company, params } = request;
    // const ipAddress = request.ip; // Extract the client's IP address
    // const routeDescription = this.reflector.get<string>(
    //   'description',
    //   context.getHandler(),
    // );
    return next.handle().pipe(
      map((responseBody) => {
        // const payload: ActivityLogDTO = {
        //   actor_id: user?.id,
        //   action: path,
        //   company_id: company ? company.id : params?.company_id || '',
        //   method,
        //   status: responseBody.statusCode.toString(),
        //   message: responseBody.message,
        //   log:
        //     responseBody.statusCode != 200
        //       ? JSON.stringify(responseBody.body)
        //       : '',
        //   created_at: new Date(),
        //   updated_at: new Date(),
        //   ip: ipAddress,
        //   description: routeDescription, // Add the route description to the log entry
        // };
        // this.activityService.save(payload);
        
        // Only set status code if it exists and is a valid number
        if (responseBody && typeof responseBody.statusCode === 'number') {
          context.switchToHttp().getResponse().status(responseBody.statusCode);
        }
        
        if (responseBody && responseBody.message && Array.isArray(responseBody.message)) {
          responseBody.message = responseBody.message.join(', ');
        }
        return responseBody;
      }),
    );
  }
}
