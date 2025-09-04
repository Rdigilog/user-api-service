import { Injectable } from '@nestjs/common';

@Injectable()
export class RosteringService {
  getHello(): string {
    return 'Hello World!';
  }
}
