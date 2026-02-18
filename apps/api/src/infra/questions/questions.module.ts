import { QuestionsProvider } from '@/domain/application/providers/questions-provider'
import { Global, Module } from '@nestjs/common'
import { HttpQuestionsProvider } from './http-questions-provider'

@Global()
@Module({
  providers: [
    {
      provide: QuestionsProvider,
      useClass: HttpQuestionsProvider,
    },
  ],
  exports: [QuestionsProvider],
})
export class QuestionsModule {}
