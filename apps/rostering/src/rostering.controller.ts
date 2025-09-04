import { Controller, Get } from '@nestjs/common';
import { RosteringService } from './rostering.service';

@Controller()
export class RosteringController {
  constructor(private readonly rosteringService: RosteringService) {}

  @Get()
  getHello(): string {
    return this.rosteringService.getHello();
  }
}
