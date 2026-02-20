import { FakeQuestionsProvider } from '@test/providers/fake-questions-provider'
import { AdminListQuestionsUseCase } from './admin-list-questions-use-case'

let fakeQuestionsProvider: FakeQuestionsProvider
let sut: AdminListQuestionsUseCase

describe('Admin List Questions', () => {
  beforeEach(() => {
    fakeQuestionsProvider = new FakeQuestionsProvider()
    sut = new AdminListQuestionsUseCase(fakeQuestionsProvider)
  })

  it('deve retornar lista vazia quando não há questões', async () => {
    const result = await sut.execute({ page: 1, perPage: 10 })

    expect(result.isRight()).toBe(true)
    expect(result.value.questions).toHaveLength(0)
    expect(result.value.meta.total).toBe(0)
  })

  it('deve retornar questões paginadas', async () => {
    for (let i = 0; i < 15; i++) {
      fakeQuestionsProvider.addQuestion({ subject: 'Matemática' })
    }

    const page1 = await sut.execute({ page: 1, perPage: 10 })

    expect(page1.isRight()).toBe(true)
    expect(page1.value.questions).toHaveLength(10)
    expect(page1.value.meta.total).toBe(15)
    expect(page1.value.meta.totalPages).toBe(2)

    const page2 = await sut.execute({ page: 2, perPage: 10 })

    expect(page2.isRight()).toBe(true)
    expect(page2.value.questions).toHaveLength(5)
  })

  it('deve filtrar por disciplina', async () => {
    fakeQuestionsProvider.addQuestion({ subject: 'Matemática' })
    fakeQuestionsProvider.addQuestion({ subject: 'Matemática' })
    fakeQuestionsProvider.addQuestion({ subject: 'Português' })

    const result = await sut.execute({
      page: 1,
      perPage: 10,
      subject: 'Matemática',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.questions).toHaveLength(2)
    expect(result.value.meta.total).toBe(2)
  })

  it('deve filtrar por dificuldade', async () => {
    fakeQuestionsProvider.addQuestion({ difficulty: 'EASY' })
    fakeQuestionsProvider.addQuestion({ difficulty: 'HARD' })
    fakeQuestionsProvider.addQuestion({ difficulty: 'HARD' })

    const result = await sut.execute({
      page: 1,
      perPage: 10,
      difficulty: 'HARD',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.questions).toHaveLength(2)
  })

  it('deve filtrar por ano', async () => {
    fakeQuestionsProvider.addQuestion({ year: 2024 })
    fakeQuestionsProvider.addQuestion({ year: 2025 })
    fakeQuestionsProvider.addQuestion({ year: 2025 })

    const result = await sut.execute({
      page: 1,
      perPage: 10,
      year: 2025,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.questions).toHaveLength(2)
  })
})
