import { Controller, Get } from '@nestjs/common';
import { AnalyticReportService } from './analytic-report.service';

@Controller()
export class AnalyticReportController {
  constructor(private readonly analyticReportService: AnalyticReportService) {}

  @Get()
  getHello(): string {
    return this.analyticReportService.getHello();
  }
}
