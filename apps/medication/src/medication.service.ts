import { Injectable } from '@nestjs/common';

@Injectable()
export class MedicationService {
  getHello(): string {
    return 'Hello World!';
  }
}
