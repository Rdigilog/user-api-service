import { Module } from '@nestjs/common';
import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';

@Module({
  imports: [],
  controllers: [MedicationController],
  providers: [MedicationService],
})
export class MedicationModule {}
