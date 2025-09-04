import { Injectable } from '@nestjs/common';

@Injectable()
export class FamilyPortalService {
  getHello(): string {
    return 'Hello World!';
  }
}
