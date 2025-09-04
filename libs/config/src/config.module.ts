import { Module } from '@nestjs/common';
// import { ConfigService } from './config.service';
import { PrismaService } from './services/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [],
})
export class ConfigModule {}
