import { FakeQuestionsProvider } from '@test/providers/fake-questions-provider'
import { AdminUpdateQuestionUseCase } from './admin-update-question-use-case'

let fakeQuestionsProvider: FakeQuestionsProvider
let sut: AdminUpdateQuestionUseCase

describe('Admin Update Question', () => {
  beforeEach(() => {
    fakeQuestionsProvider = new FakeQuestionsProvider()
    sut = new AdminUpdateQuestionUseCase(fakeQuestionsProvider)
  })

  it('deve atualizar campos parciais com sucesso', async () => {
    const question = fakeQuestionsProvider.addQuestion({
      subject: 'Matemática',
      statement: 'Enunciado original',
    })

    const result = await sut.execute({
      questionId: question.id,
      subject: 'Português',
      statement: 'Enunciado atualizado',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.question.subject).toBe('Português')
      expect(result.value.question.statement).toBe('Enunciado atualizado')
    }
  })

  it('deve retornar erro quando questão não existe', async () => {
    const result = await sut.execute({
      questionId: 'non-existent-id',
      subject: 'Português',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('deve retornar erro quando correctAnswer é inválido', async () => {
    const question = fakeQuestionsProvider.addQuestion()

    const result = await sut.execute({
      questionId: question.id,
      alternatives: ['A', 'B'],
      correctAnswer: 5,
    })

    expect(result.isLeft()).toBe(true)
  })
})
