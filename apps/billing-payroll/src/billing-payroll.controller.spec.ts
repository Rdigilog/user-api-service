import { Test, TestingModule } from '@nestjs/testing';
import { BillingPayrollController } from './billing-payroll.controller';
import { BillingPayrollService } from './billing-payroll.service';

describe('BillingPayrollController', () => {
  let billingPayrollController: BillingPayrollController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BillingPayrollController],
      providers: [BillingPayrollService],
    }).compile();

    billingPayrollController = app.get<BillingPayrollController>(
      BillingPayrollController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(billingPayrollController.getHello()).toBe('Hello World!');
    });
  });
});
