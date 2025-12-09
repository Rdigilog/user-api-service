import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config.keys';

export const QueueConfig = BullModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    connection: {
      url:
        configService.get<string>(CONFIG_KEYS.REDIS_URL) ||
        'redis://127.0.0.1:6379',
      // db: 1, // 👈 this selects Redis DB 1
    },
    defaultJobOptions: {
      removeOnComplete: 1000,
      removeOnFail: 5000,
      attempts: 3,
    },
  }),
  inject: [ConfigService],
});
