import {
  CacheModuleOptions,
  CacheOptionsFactory,
  CacheStore,
} from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config.type';
import { redisStore } from 'cache-manager-redis-yet';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService<ConfigType>) {}
  async createCacheOptions(): Promise<CacheModuleOptions> {
    const store = await redisStore({
      socket: {
        host: this.configService.getOrThrow('REDIS_HOST'),
        port: this.configService.getOrThrow('REDIS_PORT'),
      },
    });
    return {
      store: store as unknown as CacheStore,
      ttl: 3 * 60000, // 3 minutes (milliseconds)
    };
  }
}
