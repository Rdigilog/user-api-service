import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaveAbsenceService {
  getHello(): string {
    return 'Hello World!';
  }
}
