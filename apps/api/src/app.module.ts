import { Module } from '@nestjs/common'
import { EnvModule } from './infra/env/env.module'
import { DatabaseModule } from './infra/database/database.module'
import { HttpModule } from './infra/http/http.module'
import { CryptographyModule } from './infra/cryptography/cryptography.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { GuardsModule } from './infra/http/guards/guards.module'
import { PaymentModule } from './infra/payment/payment.module'
import { WebSocketModule } from './infra/web-socket/web-socket.module'
import { QuestionsModule } from './infra/questions/questions.module'

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 300,
        },
      ],
    }),
    GuardsModule,
    EnvModule,
    DatabaseModule,
    HttpModule,
    CryptographyModule,
    PaymentModule,
    WebSocketModule,
    QuestionsModule,
  ],
})
export class AppModule { }
