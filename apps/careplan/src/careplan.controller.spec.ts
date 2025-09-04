import { Test, TestingModule } from '@nestjs/testing';
import { CareplanController } from './careplan.controller';
import { CareplanService } from './careplan.service';

describe('CareplanController', () => {
  let careplanController: CareplanController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CareplanController],
      providers: [CareplanService],
    }).compile();

    careplanController = app.get<CareplanController>(CareplanController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(careplanController.getHello()).toBe('Hello World!');
    });
  });
});
