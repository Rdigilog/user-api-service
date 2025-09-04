import { Module } from '@nestjs/common';
import { FamilyPortalController } from './family-portal.controller';
import { FamilyPortalService } from './family-portal.service';

@Module({
  imports: [],
  controllers: [FamilyPortalController],
  providers: [FamilyPortalService],
})
export class FamilyPortalModule {}
