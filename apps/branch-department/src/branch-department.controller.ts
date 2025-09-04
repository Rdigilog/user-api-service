import { Controller, Get } from '@nestjs/common';
import { BranchDepartmentService } from './branch-department.service';

@Controller()
export class BranchDepartmentController {
  constructor(
    private readonly branchDepartmentService: BranchDepartmentService,
  ) {}

  @Get()
  getHello(): string {
    return this.branchDepartmentService.getHello();
  }
}
