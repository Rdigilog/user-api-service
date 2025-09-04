import { Module } from '@nestjs/common';
import { BillingPayrollController } from './billing-payroll.controller';
import { BillingPayrollService } from './billing-payroll.service';

@Module({
  imports: [],
  controllers: [BillingPayrollController],
  providers: [BillingPayrollService],
})
export class BillingPayrollModule {}
