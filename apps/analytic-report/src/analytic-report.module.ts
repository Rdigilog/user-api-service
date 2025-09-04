import { Module } from '@nestjs/common';
import { AnalyticReportController } from './analytic-report.controller';
import { AnalyticReportService } from './analytic-report.service';

@Module({
  imports: [],
  controllers: [AnalyticReportController],
  providers: [AnalyticReportService],
})
export class AnalyticReportModule {}
