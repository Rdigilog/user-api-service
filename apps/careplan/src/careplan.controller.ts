import { Controller, Get } from '@nestjs/common';
import { CareplanService } from './careplan.service';

@Controller()
export class CareplanController {
  constructor(private readonly careplanService: CareplanService) {}

  @Get()
  getHello(): string {
    return this.careplanService.getHello();
  }
}
