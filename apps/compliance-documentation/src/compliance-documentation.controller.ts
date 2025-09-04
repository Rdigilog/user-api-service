import { Controller, Get } from '@nestjs/common';
import { ComplianceDocumentationService } from './compliance-documentation.service';

@Controller()
export class ComplianceDocumentationController {
  constructor(
    private readonly complianceDocumentationService: ComplianceDocumentationService,
  ) {}

  @Get()
  getHello(): string {
    return this.complianceDocumentationService.getHello();
  }
}
