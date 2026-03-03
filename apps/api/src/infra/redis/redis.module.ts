import { Global, Logger, Module, OnModuleInit } from '@nestjs/common'
import { EnvService } from '@/infra/env/env.service'
import Redis from 'ioredis'

export const REDIS_OPTIONS = Symbol('REDIS_OPTIONS')

export interface RedisOptions {
  host: string
  port: number
}

@Global()
@Module({
  providers: [
    {
      provide: REDIS_OPTIONS,
      inject: [EnvService],
      useFactory: (env: EnvService): RedisOptions => ({
        host: env.get('REDIS_HOST'),
        port: env.get('REDIS_PORT'),
      }),
    },
  ],
  exports: [REDIS_OPTIONS],
})
export class RedisModule implements OnModuleInit {
  private readonly logger = new Logger(RedisModule.name)

  constructor(private readonly env: EnvService) {}

  async onModuleInit() {
    const host = this.env.get('REDIS_HOST')
    const port = this.env.get('REDIS_PORT')

    const client = new Redis({ host, port, lazyConnect: true })

    try {
      await client.connect()
      await client.ping()
      this.logger.log(`Redis conectado com sucesso!`)
    } catch (error) {
      this.logger.error(
        `Falha ao conectar ao Redis — ${error instanceof Error ? error.message : error}`
      )
    } finally {
      await client.quit()
    }
  }
}
