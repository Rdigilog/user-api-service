import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async setTempData(key: string, value: string, ttl: number): Promise<void> {
    await this.redisClient.setex(key, ttl, value); // TTL in seconds
  }

  async getTempData(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async deleteTempData(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
