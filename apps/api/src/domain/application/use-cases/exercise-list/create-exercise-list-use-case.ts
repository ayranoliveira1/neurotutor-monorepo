import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnexpectedError } from '@/core/errors/errors/unexpected-error'
import { ExerciseListsRepository } from '@/domain/application/repositories/exercise-lists-repository'
import { ExerciseAnswersRepository } from '@/domain/application/repositories/exercise-answers-repository'
import { QuestionsProvider } from '@/domain/application/providers/questions-provider'
import {
  ExerciseList,
  type ExerciseListSection,
} from '@/domain/entreprise/entities/exercise-list'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

export interface CreateExerciseListUseCaseRequest {
  userId: string
  name: string
  shuffleQuestions?: boolean
  ignoreAnswered?: boolean
  sections: ExerciseListSection[]
}

type CreateExerciseListUseCaseResponse = Either<
  | ResourceNotFoundError<CreateExerciseListUseCaseRequest>
  | UnexpectedError<CreateExerciseListUseCaseRequest>,
  { exerciseList: ExerciseList }
>

@Injectable()
export class CreateExerciseListUseCase {
  constructor(
    private exerciseListsRepository: ExerciseListsRepository,
    private questionsProvider: QuestionsProvider,
    private exerciseAnswersRepository: ExerciseAnswersRepository,
  ) {}

  async execute({
    userId,
    name,
    shuffleQuestions,
    ignoreAnswered,
    sections,
  }: CreateExerciseListUseCaseRequest): Promise<CreateExerciseListUseCaseResponse> {
    const excludeIds: string[] = []

    if (ignoreAnswered) {
      const answeredIds =
        await this.exerciseAnswersRepository.findAnsweredQuestionIdsByUserId(
          userId,
        )
      excludeIds.push(...answeredIds)
    }

    const selectedQuestionIds: string[] = []

    for (const section of sections) {
      const questions = await this.questionsProvider.findRandomQuestions({
        subject: section.subject,
        origin: section.origin,
        categories: section.categories,
        year: section.year,
        difficulty: section.difficulty,
        quantity: section.quantity,
        exclude: [...excludeIds, ...selectedQuestionIds],
      })

      if (questions.length === 0) {
        const message = ignoreAnswered
          ? `Não há questões novas (não respondidas) para a disciplina "${section.subject}".`
          : `Nenhuma questão encontrada para a disciplina "${section.subject}".`

        return left(
          new ResourceNotFoundError({
            errors: [{ message }],
          }),
        )
      }

      selectedQuestionIds.push(...questions.map((q) => q.id))
    }

    if (shuffleQuestions) {
      for (let i = selectedQuestionIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[selectedQuestionIds[i], selectedQuestionIds[j]] = [
          selectedQuestionIds[j],
          selectedQuestionIds[i],
        ]
      }
    }

    const exerciseList = ExerciseList.create({
      userId: new UniqueEntityID(userId),
      name,
      shuffleQuestions,
      ignoreAnswered,
      sections,
      questionIds: selectedQuestionIds,
      totalQuestions: selectedQuestionIds.length,
    })

    await this.exerciseListsRepository.create(exerciseList)

    return right({ exerciseList })
  }
}
