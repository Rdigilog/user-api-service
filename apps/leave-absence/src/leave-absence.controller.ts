import { Controller, Get } from '@nestjs/common';
import { LeaveAbsenceService } from './leave-absence.service';

@Controller()
export class LeaveAbsenceController {
  constructor(private readonly leaveAbsenceService: LeaveAbsenceService) {}

  @Get()
  getHello(): string {
    return this.leaveAbsenceService.getHello();
  }
}
