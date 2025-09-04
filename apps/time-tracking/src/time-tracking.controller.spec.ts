import { Test, TestingModule } from '@nestjs/testing';
import { TimeTrackingController } from './time-tracking.controller';
import { TimeTrackingService } from './time-tracking.service';

describe('TimeTrackingController', () => {
  let timeTrackingController: TimeTrackingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TimeTrackingController],
      providers: [TimeTrackingService],
    }).compile();

    timeTrackingController = app.get<TimeTrackingController>(
      TimeTrackingController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(timeTrackingController.getHello()).toBe('Hello World!');
    });
  });
});
