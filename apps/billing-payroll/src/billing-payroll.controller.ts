import { Controller, Get } from '@nestjs/common';
import { BillingPayrollService } from './billing-payroll.service';

@Controller()
export class BillingPayrollController {
  constructor(private readonly billingPayrollService: BillingPayrollService) {}

  @Get()
  getHello(): string {
    return this.billingPayrollService.getHello();
  }
}
