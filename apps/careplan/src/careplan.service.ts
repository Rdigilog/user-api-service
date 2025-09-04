import { Injectable } from '@nestjs/common';

@Injectable()
export class CareplanService {
  getHello(): string {
    return 'Hello World!';
  }
}
