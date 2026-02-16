import { Global, Module } from '@nestjs/common'
import { envSchema } from './env'
import { EnvService } from './env.service'
import { ConfigModule } from '@nestjs/config'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: {
        validate: envSchema.parse,
      },
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
