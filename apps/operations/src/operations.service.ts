import { Injectable } from '@nestjs/common';

@Injectable()
export class OperationsService {
  getHello(): string {
    return 'Hello World!';
  }
}
