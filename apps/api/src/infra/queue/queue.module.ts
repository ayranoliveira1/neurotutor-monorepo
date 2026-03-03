import { Global, Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import {
  REDIS_OPTIONS,
  type RedisOptions,
} from '@/infra/redis/redis.module'

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [REDIS_OPTIONS],
      useFactory: (opts: RedisOptions) => ({
        connection: opts,
      }),
    }),
  ],
})
export class QueueModule {}
