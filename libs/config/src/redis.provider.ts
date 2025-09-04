// redis.provider.ts
import { createClient, RedisClientType } from 'redis';

export const RedisProvider = {
  provide: 'REDIS_CONNECTION',
  useFactory: async (): Promise<RedisClientType> => {
    const client: RedisClientType = createClient({
      url: process.env.REDIS_URL,
    });

    await client.connect();
    return client;
  },
};
