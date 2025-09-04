import { Test, TestingModule } from '@nestjs/testing';
import { RosteringController } from './rostering.controller';
import { RosteringService } from './rostering.service';

describe('RosteringController', () => {
  let rosteringController: RosteringController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RosteringController],
      providers: [RosteringService],
    }).compile();

    rosteringController = app.get<RosteringController>(RosteringController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(rosteringController.getHello()).toBe('Hello World!');
    });
  });
});
