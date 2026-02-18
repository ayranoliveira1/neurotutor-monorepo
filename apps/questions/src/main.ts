import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-API-Key'],
  })

  await app.listen(process.env.PORT ?? 3002)
  console.log(`Questions API is running on: ${await app.getUrl()}`)
}
bootstrap()
