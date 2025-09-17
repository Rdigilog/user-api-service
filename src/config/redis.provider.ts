// redis.provider.ts
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config.keys';

export const RedisProvider = {
  provide: 'REDIS_CONNECTION',
  useFactory: async (configService: ConfigService): Promise<RedisClientType> => {
    const client: RedisClientType = createClient({
      url: configService.get<string>(CONFIG_KEYS.REDIS_URL),
    });

    await client.connect();
    return client;
  },
  inject: [ConfigService],
};
