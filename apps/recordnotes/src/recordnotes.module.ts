import { Module } from '@nestjs/common';
import { RecordnotesController } from './recordnotes.controller';
import { RecordnotesService } from './recordnotes.service';

@Module({
  imports: [],
  controllers: [RecordnotesController],
  providers: [RecordnotesService],
})
export class RecordnotesModule {}
