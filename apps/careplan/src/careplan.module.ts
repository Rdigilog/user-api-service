import { Module } from '@nestjs/common';
import { CareplanController } from './careplan.controller';
import { CareplanService } from './careplan.service';

@Module({
  imports: [],
  controllers: [CareplanController],
  providers: [CareplanService],
})
export class CareplanModule {}
