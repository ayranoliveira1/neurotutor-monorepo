import { FakeQuestionsProvider } from '@test/providers/fake-questions-provider'
import { AdminCreateQuestionUseCase } from './admin-create-question-use-case'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let fakeQuestionsProvider: FakeQuestionsProvider
let sut: AdminCreateQuestionUseCase

describe('Admin Create Question', () => {
  beforeEach(() => {
    fakeQuestionsProvider = new FakeQuestionsProvider()
    sut = new AdminCreateQuestionUseCase(fakeQuestionsProvider)
  })

  it('deve criar uma questão com sucesso', async () => {
    const result = await sut.execute({
      externalId: 'ext-1',
      statement: 'Qual a capital do Brasil?',
      alternatives: [
        'São Paulo',
        'Brasília',
        'Rio de Janeiro',
        'Belo Horizonte',
      ],
      origin: 'ENEM',
      subject: 'Geografia',
      categories: ['Capitalismo'],
      correctAnswer: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.question.statement).toBe(
        'Qual a capital do Brasil?',
      )
      expect(result.value.question.subject).toBe('Geografia')
    }
    expect(fakeQuestionsProvider.questions).toHaveLength(1)
  })

  it('deve criar uma questão com campos opcionais', async () => {
    const result = await sut.execute({
      externalId: 'ext-2',
      statement: 'Quanto é 2+2?',
      alternatives: ['3', '4', '5'],
      origin: 'ENEM',
      subject: 'Matemática',
      categories: ['Aritmética'],
      correctAnswer: 1,
      year: 2025,
      difficulty: 'EASY',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.question.year).toBe(2025)
      expect(result.value.question.difficulty).toBe('EASY')
    }
  })

  it('deve rejeitar quando correctAnswer é maior ou igual ao número de alternativas', async () => {
    const result = await sut.execute({
      externalId: 'ext-3',
      statement: 'Pergunta teste',
      alternatives: ['A', 'B'],
      origin: 'ENEM',
      subject: 'Matemática',
      categories: [],
      correctAnswer: 5,
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError)
    }
    expect(fakeQuestionsProvider.questions).toHaveLength(0)
  })

  it('deve rejeitar quando correctAnswer é igual ao comprimento das alternativas', async () => {
    const result = await sut.execute({
      externalId: 'ext-4',
      statement: 'Pergunta teste',
      alternatives: ['A', 'B', 'C'],
      origin: 'ENEM',
      subject: 'Matemática',
      categories: [],
      correctAnswer: 3,
    })

    expect(result.isLeft()).toBe(true)
  })
})
