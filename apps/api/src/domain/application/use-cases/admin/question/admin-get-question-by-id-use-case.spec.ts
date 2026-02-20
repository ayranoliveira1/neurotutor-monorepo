import { FakeQuestionsProvider } from '@test/providers/fake-questions-provider'
import { AdminGetQuestionByIdUseCase } from './admin-get-question-by-id-use-case'

let fakeQuestionsProvider: FakeQuestionsProvider
let sut: AdminGetQuestionByIdUseCase

describe('Admin Get Question By Id', () => {
  beforeEach(() => {
    fakeQuestionsProvider = new FakeQuestionsProvider()
    sut = new AdminGetQuestionByIdUseCase(fakeQuestionsProvider)
  })

  it('deve retornar a questão quando encontrada', async () => {
    const question = fakeQuestionsProvider.addQuestion({
      subject: 'Matemática',
    })

    const result = await sut.execute({ questionId: question.id })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.question.id).toBe(question.id)
      expect(result.value.question.subject).toBe('Matemática')
    }
  })

  it('deve retornar erro quando questão não encontrada', async () => {
    const result = await sut.execute({ questionId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
  })
})
