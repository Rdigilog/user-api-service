import { Test, TestingModule } from '@nestjs/testing';
import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';

describe('MedicationController', () => {
  let medicationController: MedicationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MedicationController],
      providers: [MedicationService],
    }).compile();

    medicationController = app.get<MedicationController>(MedicationController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(medicationController.getHello()).toBe('Hello World!');
    });
  });
});
