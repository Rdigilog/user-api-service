import { Controller, Get } from '@nestjs/common';
import { TimeTrackingService } from './time-tracking.service';

@Controller()
export class TimeTrackingController {
  constructor(private readonly timeTrackingService: TimeTrackingService) {}

  @Get()
  getHello(): string {
    return this.timeTrackingService.getHello();
  }
}
