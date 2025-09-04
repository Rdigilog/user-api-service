import { Injectable } from '@nestjs/common';

@Injectable()
export class RecordnotesService {
  getHello(): string {
    return 'Hello World!';
  }
}
