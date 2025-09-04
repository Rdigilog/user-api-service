import { Module } from '@nestjs/common';
import { LeaveAbsenceController } from './leave-absence.controller';
import { LeaveAbsenceService } from './leave-absence.service';

@Module({
  imports: [],
  controllers: [LeaveAbsenceController],
  providers: [LeaveAbsenceService],
})
export class LeaveAbsenceModule {}
