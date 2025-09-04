import { BullModule } from '@nestjs/bullmq';
export const QueueConfig = BullModule.forRoot({
  connection: {
    url: `${process.env.REDIS_URL}/1`,
  },
  defaultJobOptions: {
    removeOnComplete: 1000,
    removeOnFail: 5000,
    attempts: 3,
  },
});
