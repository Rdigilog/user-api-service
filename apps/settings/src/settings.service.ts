import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  getHello(): string {
    return 'Hello World!';
  }
}
