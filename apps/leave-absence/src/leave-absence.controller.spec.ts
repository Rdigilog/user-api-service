import { Test, TestingModule } from '@nestjs/testing';
import { LeaveAbsenceController } from './leave-absence.controller';
import { LeaveAbsenceService } from './leave-absence.service';

describe('LeaveAbsenceController', () => {
  let leaveAbsenceController: LeaveAbsenceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LeaveAbsenceController],
      providers: [LeaveAbsenceService],
    }).compile();

    leaveAbsenceController = app.get<LeaveAbsenceController>(
      LeaveAbsenceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(leaveAbsenceController.getHello()).toBe('Hello World!');
    });
  });
});
