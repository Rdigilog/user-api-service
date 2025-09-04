import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getHello(): string {
    return this.settingsService.getHello();
  }
}
