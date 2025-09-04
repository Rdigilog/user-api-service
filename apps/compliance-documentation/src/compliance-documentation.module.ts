import { Module } from '@nestjs/common';
import { ComplianceDocumentationController } from './compliance-documentation.controller';
import { ComplianceDocumentationService } from './compliance-documentation.service';

@Module({
  imports: [],
  controllers: [ComplianceDocumentationController],
  providers: [ComplianceDocumentationService],
})
export class ComplianceDocumentationModule {}
