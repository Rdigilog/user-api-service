import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticReportService {
  getHello(): string {
    return 'Hello World!';
  }
}
