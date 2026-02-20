import { FakeQuestionsProvider } from '@test/providers/fake-questions-provider'
import { InMemoryExerciseListsRepository } from '@test/repositories/in-memory-exercise-lists-repository'
import { ExerciseList } from '@/domain/entreprise/entities/exercise-list'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AdminDeleteQuestionUseCase } from './admin-delete-question-use-case'

let fakeQuestionsProvider: FakeQuestionsProvider
let exerciseListsRepository: InMemoryExerciseListsRepository
let sut: AdminDeleteQuestionUseCase

describe('Admin Delete Question', () => {
  beforeEach(() => {
    fakeQuestionsProvider = new FakeQuestionsProvider()
    exerciseListsRepository = new InMemoryExerciseListsRepository()
    sut = new AdminDeleteQuestionUseCase(
      fakeQuestionsProvider,
      exerciseListsRepository,
    )
  })

  it('deve deletar com sucesso quando não vinculada a listas', async () => {
    const question = fakeQuestionsProvider.addQuestion()

    const result = await sut.execute({ questionId: question.id })

    expect(result.isRight()).toBe(true)
    expect(fakeQuestionsProvider.questions).toHaveLength(0)
  })

  it('deve retornar erro quando vinculada a listas de exercícios', async () => {
    const question = fakeQuestionsProvider.addQuestion()

    exerciseListsRepository.items.push(
      ExerciseList.create({
        userId: new UniqueEntityID('user-1'),
        name: 'Lista teste',
        sections: [],
        questionIds: [question.id],
        totalQuestions: 1,
      }),
    )

    const result = await sut.execute({ questionId: question.id })

    expect(result.isLeft()).toBe(true)
    expect(fakeQuestionsProvider.questions).toHaveLength(1)
  })

  it('deve retornar erro quando questão não encontrada', async () => {
    const result = await sut.execute({ questionId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
  })
})
