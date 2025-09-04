import { Test, TestingModule } from '@nestjs/testing';
import { OperationsController } from './operations.controller';
import { OperationsService } from './operations.service';

describe('OperationsController', () => {
  let operationsController: OperationsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OperationsController],
      providers: [OperationsService],
    }).compile();

    operationsController = app.get<OperationsController>(OperationsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(operationsController.getHello()).toBe('Hello World!');
    });
  });
});
