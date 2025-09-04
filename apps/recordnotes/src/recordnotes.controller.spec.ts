import { Test, TestingModule } from '@nestjs/testing';
import { RecordnotesController } from './recordnotes.controller';
import { RecordnotesService } from './recordnotes.service';

describe('RecordnotesController', () => {
  let recordnotesController: RecordnotesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RecordnotesController],
      providers: [RecordnotesService],
    }).compile();

    recordnotesController = app.get<RecordnotesController>(
      RecordnotesController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(recordnotesController.getHello()).toBe('Hello World!');
    });
  });
});
