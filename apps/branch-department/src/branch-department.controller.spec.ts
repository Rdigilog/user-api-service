import { Test, TestingModule } from '@nestjs/testing';
import { BranchDepartmentController } from './branch-department.controller';
import { BranchDepartmentService } from './branch-department.service';

describe('BranchDepartmentController', () => {
  let branchDepartmentController: BranchDepartmentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BranchDepartmentController],
      providers: [BranchDepartmentService],
    }).compile();

    branchDepartmentController = app.get<BranchDepartmentController>(
      BranchDepartmentController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(branchDepartmentController.getHello()).toBe('Hello World!');
    });
  });
});
