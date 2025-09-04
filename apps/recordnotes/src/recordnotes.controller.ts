import { Controller, Get } from '@nestjs/common';
import { RecordnotesService } from './recordnotes.service';

@Controller()
export class RecordnotesController {
  constructor(private readonly recordnotesService: RecordnotesService) {}

  @Get()
  getHello(): string {
    return this.recordnotesService.getHello();
  }
}
