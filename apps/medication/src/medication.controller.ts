import { Controller, Get } from '@nestjs/common';
import { MedicationService } from './medication.service';

@Controller()
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Get()
  getHello(): string {
    return this.medicationService.getHello();
  }
}
