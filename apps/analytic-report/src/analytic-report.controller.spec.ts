import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticReportController } from './analytic-report.controller';
import { AnalyticReportService } from './analytic-report.service';

describe('AnalyticReportController', () => {
  let analyticReportController: AnalyticReportController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticReportController],
      providers: [AnalyticReportService],
    }).compile();

    analyticReportController = app.get<AnalyticReportController>(
      AnalyticReportController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(analyticReportController.getHello()).toBe('Hello World!');
    });
  });
});
