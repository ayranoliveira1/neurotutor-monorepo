import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './infra/filters/nest-exception-filter'
import { LoggingInterceptor } from './infra/http/interceptors/logging.interceptor'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const logger = new Logger(`Main`)

  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  })
  await app.listen(process.env.PORT ?? 3001)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
