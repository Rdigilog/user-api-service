import { Injectable } from '@nestjs/common';

@Injectable()
export class ComplianceDocumentationService {
  getHello(): string {
    return 'Hello World!';
  }
}
