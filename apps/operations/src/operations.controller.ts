import { Controller, Get } from '@nestjs/common';
import { OperationsService } from './operations.service';

@Controller()
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get()
  getHello(): string {
    return this.operationsService.getHello();
  }
}
