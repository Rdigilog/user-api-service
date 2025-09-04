import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceDocumentationController } from './compliance-documentation.controller';
import { ComplianceDocumentationService } from './compliance-documentation.service';

describe('ComplianceDocumentationController', () => {
  let complianceDocumentationController: ComplianceDocumentationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ComplianceDocumentationController],
      providers: [ComplianceDocumentationService],
    }).compile();

    complianceDocumentationController =
      app.get<ComplianceDocumentationController>(
        ComplianceDocumentationController,
      );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(complianceDocumentationController.getHello()).toBe('Hello World!');
    });
  });
});
