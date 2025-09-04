import { Module } from '@nestjs/common';
import { BranchDepartmentController } from './branch-department.controller';
import { BranchDepartmentService } from './branch-department.service';

@Module({
  imports: [],
  controllers: [BranchDepartmentController],
  providers: [BranchDepartmentService],
})
export class BranchDepartmentModule {}
