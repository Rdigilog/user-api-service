import { Controller, Get } from '@nestjs/common';
import { FamilyPortalService } from './family-portal.service';

@Controller()
export class FamilyPortalController {
  constructor(private readonly familyPortalService: FamilyPortalService) {}

  @Get()
  getHello(): string {
    return this.familyPortalService.getHello();
  }
}
