import { FakeQuestionsProvider } from '@test/providers/fake-questions-provider'
import { GetQuestionsStatsUseCase } from './get-questions-stats-use-case'

let fakeQuestionsProvider: FakeQuestionsProvider
let sut: GetQuestionsStatsUseCase

describe('Get Questions Stats', () => {
  beforeEach(() => {
    fakeQuestionsProvider = new FakeQuestionsProvider()
    sut = new GetQuestionsStatsUseCase(fakeQuestionsProvider)
  })

  it('deve retornar estatísticas vazias quando não há questões', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      stats: { total: 0, bySubject: [] },
    })
  })

  it('deve retornar total e contagem por disciplina', async () => {
    fakeQuestionsProvider.addQuestion({ subject: 'Matemática' })
    fakeQuestionsProvider.addQuestion({ subject: 'Matemática' })
    fakeQuestionsProvider.addQuestion({ subject: 'Português' })

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      const { stats } = result.value
      expect(stats.total).toBe(3)
      expect(stats.bySubject).toContainEqual({
        subject: 'Matemática',
        count: 2,
      })
      expect(stats.bySubject).toContainEqual({
        subject: 'Português',
        count: 1,
      })
    }
  })

  it('deve ordenar disciplinas por contagem decrescente', async () => {
    fakeQuestionsProvider.addQuestion({ subject: 'Português' })
    fakeQuestionsProvider.addQuestion({ subject: 'Matemática' })
    fakeQuestionsProvider.addQuestion({ subject: 'Matemática' })
    fakeQuestionsProvider.addQuestion({ subject: 'Matemática' })

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      const { stats } = result.value
      expect(stats.bySubject[0].subject).toBe('Matemática')
      expect(stats.bySubject[0].count).toBe(3)
    }
  })
})
