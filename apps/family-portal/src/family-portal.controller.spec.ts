import { Test, TestingModule } from '@nestjs/testing';
import { FamilyPortalController } from './family-portal.controller';
import { FamilyPortalService } from './family-portal.service';

describe('FamilyPortalController', () => {
  let familyPortalController: FamilyPortalController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FamilyPortalController],
      providers: [FamilyPortalService],
    }).compile();

    familyPortalController = app.get<FamilyPortalController>(
      FamilyPortalController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(familyPortalController.getHello()).toBe('Hello World!');
    });
  });
});
