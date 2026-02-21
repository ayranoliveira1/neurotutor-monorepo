import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { LoggingInterceptor } from './interceptors/logging.interceptor'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const logger = new Logger(`Main`)
  const app = await NestFactory.create(AppModule)

  app.useGlobalInterceptors(new LoggingInterceptor())

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-API-Key'],
  })

  await app.listen(process.env.PORT ?? 3002)
  logger.log(`Questions API is running on: ${await app.getUrl()}`)
}
bootstrap()
